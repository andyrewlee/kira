import type { Application } from "express";
import type WebSocket from "ws";
import crypto from "crypto";
import { SessionManager } from "./session-manager";
import { RTCPeerManager } from "./rtc-peer";
import type { SignalingMessage } from "./types";

export interface RegisterWebrtcOptions {
  app: Application & { ws: any };
  requireAuth: any;
}

const sessionManager = new SessionManager();
const peerConnections = new Map<string, RTCPeerManager>();

const XAI_API_KEY = process.env.XAI_API_KEY || "";
const API_URL = process.env.API_URL || "wss://api.x.ai/v1/realtime";
const VOICE = process.env.VOICE || "ara";
const INSTRUCTIONS =
  process.env.INSTRUCTIONS ||
  "You are a helpful voice assistant. You are speaking to a user in real-time over audio. Keep your responses conversational and concise since they will be spoken aloud.";
const DEFAULT_CONNECT_TIMEOUT_MS = parseInt(process.env.WEBRTC_CONNECT_TIMEOUT_MS || "8000", 10);

const SUPPORTED_SAMPLE_RATES = [8000, 16000, 21050, 24000, 32000, 44100, 48000];

function pickSampleRate(requested: number | undefined): number {
  if (!requested) return 24000;
  if (SUPPORTED_SAMPLE_RATES.includes(requested)) return requested;
  return SUPPORTED_SAMPLE_RATES.reduce((prev, curr) =>
    Math.abs(curr - requested) < Math.abs(prev - requested) ? curr : prev
  );
}

function buildWsUrl(req: any, sessionId: string): string {
  const protoHeader = (req.headers["x-forwarded-proto"] as string | undefined) || req.protocol;
  const host = req.get("host");
  const wsProtocol = protoHeader === "https" ? "wss" : "ws";
  return `${wsProtocol}://${host}/webrtc/signaling/${sessionId}`;
}

function generateWsToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

export function registerWebrtcRoutes({ app, requireAuth }: RegisterWebrtcOptions) {
  // Create WebRTC session
  app.post("/webrtc/sessions", requireAuth, (req, res) => {
    if (!XAI_API_KEY) {
      return res.status(500).json({ error: "XAI_API_KEY not configured" });
    }

    const requestedRate = typeof req.body?.sample_rate === "number" ? req.body.sample_rate : undefined;
    const sampleRate = pickSampleRate(requestedRate);
    const wsToken = generateWsToken();
    const userId = (req as any).auth?.sub || (req as any).auth?.user_id;
    const session = sessionManager.createSession(sampleRate, wsToken, userId);

    res.json({
      sessionId: session.id,
      wsUrl: buildWsUrl(req, session.id),
      wsToken,
      sampleRate: session.sample_rate,
      connectTimeoutMs: DEFAULT_CONNECT_TIMEOUT_MS,
    });
  });

  // Optional: session stats
  app.get("/webrtc/sessions/:sessionId/stats", requireAuth, async (req, res) => {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    const peer = peerConnections.get(sessionId);
    if (!peer) return res.status(404).json({ error: "Peer connection not found" });
    const stats = await peer.getStats();
    sessionManager.updateSessionStats(sessionId, stats);
    res.json({ sessionId, stats });
  });

  // Delete session
  app.delete("/webrtc/sessions/:sessionId", requireAuth, (req, res) => {
    const { sessionId } = req.params;
    const peer = peerConnections.get(sessionId);
    if (peer) {
      peer.close();
      peerConnections.delete(sessionId);
    }
    const deleted = sessionManager.deleteSession(sessionId);
    if (!deleted) return res.status(404).json({ error: "Session not found" });
    res.json({ ok: true });
  });

  // Signaling WS
  app.ws("/webrtc/signaling/:sessionId", async (ws: WebSocket, req: any) => {
    const sessionId = req.params.sessionId;
    const token = (req.query?.token as string | undefined) || undefined;

    if (!sessionManager.validateToken(sessionId, token)) {
      ws.close(1008, "Invalid token");
      return;
    }

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      ws.close(1002, "Session not found");
      return;
    }

    sessionManager.updateSessionStatus(sessionId, "active");
    console.log(`[${sessionId}] 🔌 Client connected for signaling`);

    const peerManager = new RTCPeerManager({
      sessionId,
      xaiApiKey: XAI_API_KEY,
      xaiApiUrl: API_URL,
      voice: VOICE,
      instructions: INSTRUCTIONS,
      sampleRate: session.sample_rate,
    });
    peerConnections.set(sessionId, peerManager);

    const xaiInitPromise = peerManager.initializeXAI().catch((error) => {
      console.error(`[${sessionId}] ❌ Failed to initialize XAI API:`, error);
      ws.close(1011, "Failed to connect to XAI API");
    });

    ws.on("message", async (data: WebSocket.Data) => {
      try {
        const message: SignalingMessage = JSON.parse(data.toString());
        switch (message.type) {
          case "answer":
            await peerManager.handleAnswer({ type: "answer", sdp: message.sdp });
            ws.send(JSON.stringify({ type: "ready" } satisfies SignalingMessage));
            break;
          case "ice-candidate":
            if (message.candidate) await peerManager.handleIceCandidate(message.candidate);
            break;
          default:
            console.log(`[${sessionId}] ⚠️ Unknown signaling message type: ${message.type}`);
        }
      } catch (error) {
        console.error(`[${sessionId}] ❌ Error processing signaling message:`, error);
      }
    });

    ws.on("close", () => {
      peerManager.close();
      peerConnections.delete(sessionId);
      sessionManager.updateSessionStatus(sessionId, "closed");
      console.log(`[${sessionId}] Session cleaned up`);
    });

    ws.on("error", (error) => {
      console.error(`[${sessionId}] ❌ Signaling WebSocket error:`, error);
    });

    try {
      const offer = await peerManager.createOffer();
      const message: SignalingMessage = { type: "offer", sdp: offer.sdp! };
      ws.send(JSON.stringify(message));
      console.log(`[${sessionId}] 📤 Offer sent to client`);
    } catch (error) {
      console.error(`[${sessionId}] ❌ Failed to create offer:`, error);
      ws.close(1011, "Failed to create offer");
      return;
    }

    try {
      await xaiInitPromise;
    } catch (error) {
      return;
    }

    const statsInterval = setInterval(async () => {
      try {
        const stats = await peerManager.getStats();
        sessionManager.updateSessionStats(sessionId, stats);
      } catch (error) {
        // ignore stats errors
      }
    }, 5000);

    ws.on("close", () => clearInterval(statsInterval));
  });
}
