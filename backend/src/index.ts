import "dotenv/config";
import express from "express";
import cors from "cors";
import ExpressWs from "express-ws";
import { requireAuth, validateWsToken } from "./middleware/auth";

const { app } = ExpressWs(express());

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
app.post("/tts", requireAuth, (_req, res) => res.status(501).json({ error: "TTS not implemented" }));
app.post("/chat", requireAuth, (_req, res) => res.status(501).json({ error: "Chat not implemented" }));
app.post("/meetings/:id/ingest", requireAuth, (_req, res) => res.status(501).json({ error: "Ingest not implemented" }));
app.post("/notes/refresh", requireAuth, (_req, res) => res.status(501).json({ error: "Notes refresh not implemented" }));

// Phase 5 WebRTC relay placeholders (real relay will be mounted later)
app.post("/webrtc/sessions", requireAuth, (_req, res) => {
  return res.status(501).json({ error: "WebRTC session creation not implemented" });
});

app.ws("/webrtc/signaling/:sessionId", (ws, req) => {
  const token = (req.query?.token as string | undefined) || undefined;
  if (!validateWsToken(token)) {
    ws.close(1008, "Invalid token");
    return;
  }
  ws.send(JSON.stringify({ error: "Signaling not implemented" }));
  ws.close();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend stub listening on :${PORT}`);
});
