import "dotenv/config";
import express from "express";
import cors from "cors";
import ExpressWs from "express-ws";
import { requireAuth } from "./middleware/auth";
import { registerWebrtcRoutes } from "./webrtc/routes";
import { store } from "./store";
import {
  convexClient,
  convexSeedDemo,
  convexResetMeeting,
  convexGetContext,
  convexAppendTurn,
  convexSetNotes,
} from "./convexClient";

const { app } = ExpressWs(express() as any);

// CORS
const allowlist = (process.env.CORS_ALLOWLIST || "http://localhost:3000,http://localhost:5173,http://localhost:8080").split(",");
app.use(cors({ origin: allowlist, credentials: true }));
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Phase 4 baseline endpoint shapes (stubbed)
app.post("/stt", requireAuth, (_req, res) => res.status(501).json({ error: "STT not implemented" }));
app.post("/tts", requireAuth, async (req, res) => {
  try {
    const XAI_API_KEY = process.env.XAI_API_KEY;
    if (!XAI_API_KEY) return res.status(500).json({ error: "Missing XAI_API_KEY" });
    const text = req.body?.text || "";
    const voice = req.body?.voice || process.env.VOICE || "una";
    const speed = req.body?.speed || 1.0;
    const ttsRes = await fetch("https://api.x.ai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "grok-tts", input: text, voice, speed }),
    });
    if (!ttsRes.ok) {
      const errTxt = await ttsRes.text();
      console.error("TTS upstream error", errTxt);
      return res.status(500).json({ error: "TTS upstream failed" });
    }
    const buf = Buffer.from(await ttsRes.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TTS failed" });
  }
});
// Stubbed chat: returns summary + last turn (Convex first, fallback store)
app.post("/chat", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  const message = req.body?.message || "";
  let ctx: any = null;
  try {
    if (convexClient) ctx = await convexGetContext(meetingId, 5);
  } catch (err) {
    console.error("Convex chat context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, 5);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });
  const lastTurn = ctx.turns[ctx.turns.length - 1];
  res.json({
    reply: `Stubbed chat: ${message ? "You asked: " + message + ". " : ""}Last turn: ${lastTurn ? lastTurn.text : "(none)"}. Summary: ${ctx.summary}`,
  });
});

// Stubbed notes refresh: summarizes last 3 turns and writes to Convex/store
app.post("/notes/refresh", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  let ctx: any = null;
  try {
    if (convexClient) ctx = await convexGetContext(meetingId, 10);
  } catch (err) {
    console.error("Convex notes context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, 10);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });
  const recent = ctx.turns.slice(-3).map((t: any) => t.text).join(". ");
  const summary = recent ? `Recent: ${recent}` : ctx.summary;
  const notes = ctx.notes.length ? ctx.notes : ["(stubbed notes) No new notes yet."];
  try {
    if (convexClient) {
      await convexSetNotes(meetingId, notes, summary);
      return res.json({ summary, notes });
    }
  } catch (err) {
    console.error("Convex setNotes failed", err);
  }
  store.setNotesAndSummary(meetingId, notes, summary);
  res.json({ summary, notes, fallback: true });
});

// Meeting handlers (Convex first, fallback to in-memory)
app.post("/seedDemoMeeting", requireAuth, async (req, res) => {
  const userId = req.body?.userId || "demo-user";
  try {
    if (convexClient) {
      const meetingId = await convexSeedDemo(userId);
      return res.json({ meetingId });
    }
  } catch (err) {
    console.error("Convex seedDemoMeeting failed", err);
  }
  const meetingId = store.seedDemo(userId);
  res.json({ meetingId, fallback: true });
});

app.post("/resetMeeting", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  try {
    if (convexClient) {
      await convexResetMeeting(meetingId);
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error("Convex resetMeeting failed", err);
  }
  store.resetMeeting(meetingId);
  res.json({ ok: true, fallback: true });
});

app.get("/meetings/:id/context", requireAuth, async (req, res) => {
  const tail = Number(req.query.tail) || 60;
  try {
    if (convexClient) {
      const ctx = await convexGetContext(req.params.id, tail);
      return res.json(ctx);
    }
  } catch (err) {
    console.error("Convex getContext failed", err);
  }
  const ctx = store.getContext(req.params.id, tail);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });
  res.json(ctx);
});

app.post("/meetings/:id/ingest", requireAuth, async (req, res) => {
  const meetingId = req.params.id;
  const { channel = "mic", speakerKey = "me", text = "", ts = Date.now(), source = "human" } = req.body || {};
  try {
    if (convexClient) {
      await convexAppendTurn({ meetingId, channel, speakerKey, text, ts, source });
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error("Convex ingest failed", err);
  }
  store.appendTurn({ meetingId, channel, speakerKey, text, ts, source });
  res.json({ ok: true, fallback: true });
});

// Phase 5 WebRTC relay (xAI example integration)
registerWebrtcRoutes({ app: app as any, requireAuth });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend stub listening on :${PORT}`);
});
