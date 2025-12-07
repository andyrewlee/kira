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
import fetch, { Blob, FormData } from "node-fetch";

const { app } = ExpressWs(express() as any);

// CORS
const allowlist = (process.env.CORS_ALLOWLIST || "http://localhost:3000,http://localhost:5173,http://localhost:8080").split(",");
app.use(cors({ origin: allowlist, credentials: true }));
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Phase 4 baseline endpoint shapes
app.post("/stt", requireAuth, async (req, res) => {
  try {
    const XAI_API_KEY = process.env.XAI_API_KEY;
    if (!XAI_API_KEY) return res.status(500).json({ error: "Missing XAI_API_KEY" });
    const audio = req.body?.audio;
    const format = req.body?.format || "mp3";
    if (!audio) return res.status(400).json({ error: "Missing audio base64" });

    const binary = Buffer.from(audio, "base64");
    const form = new FormData();
    form.append("file", new Blob([binary]), `audio.${format}`);
    form.append("model", "grok-1" /* placeholder model name */);

    const sttRes = await fetch("https://api.x.ai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: form,
    });
    if (!sttRes.ok) {
      const txt = await sttRes.text();
      console.error("STT upstream error", txt);
      return res.status(502).json({ error: "STT upstream failed", details: txt });
    }
    const data: any = await sttRes.json();
    const text = data.text || "";

    // Optional ingest into Convex/store
    const meetingId = req.body?.meetingId;
    const speakerKey = req.body?.speakerKey || "me";
    const ts = Date.now();
    if (meetingId) {
      try {
        if (convexClient) {
          await convexAppendTurn({ meetingId, channel: "mic", speakerKey, text, ts, source: "human" });
        } else {
          store.appendTurn({ meetingId, channel: "mic", speakerKey, text, ts, source: "human" });
        }
      } catch (err) {
        console.error("STT ingest failed", err);
      }
    }

    res.json({ text, meetingId });
  } catch (err) {
    console.error("STT failed", err);
    res.status(500).json({ error: "STT failed" });
  }
});
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
// Chat: call Grok with meeting context (Convex preferred)
app.post("/chat", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  const message = req.body?.message || "";
  let ctx: any = null;
  try {
    if (convexClient) ctx = await convexGetContext(meetingId, 20);
  } catch (err) {
    console.error("Convex chat context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, 20);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });

  const system = `You are Kira, a meeting copilot. Use this meeting context only. Summary: ${ctx.summary}. Notes: ${ctx.notes.join(" | ")}. Recent turns: ${ctx.turns
    .map((t: any) => `${ctx.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)
    .join(" | ")}`;

  try {
    const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
      }),
    });
    if (!xaiRes.ok) {
      const txt = await xaiRes.text();
      console.error("Grok chat error", txt);
      return res.status(502).json({ error: "Grok chat failed", details: txt });
    }
    const data: any = await xaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (err) {
    console.error("Grok chat exception", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// Notes refresh: call Grok to produce notes/summary, write to Convex/store
app.post("/notes/refresh", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  let ctx: any = null;
  try {
    if (convexClient) ctx = await convexGetContext(meetingId, 40);
  } catch (err) {
    console.error("Convex notes context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, 40);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });

  const prompt = `Summarize this meeting. Provide concise notes (bullets) and a summary. Recent turns: ${ctx.turns
    .map((t: any) => `${ctx.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)
    .join(" | ")}. Existing notes: ${ctx.notes.join(" | ")}. Current summary: ${ctx.summary}`;

  try {
    const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: 'Return JSON: {"notes":[""],"summary":""}' },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!xaiRes.ok) {
      const txt = await xaiRes.text();
      console.error("Grok notes error", txt);
      return res.status(502).json({ error: "Grok notes failed", details: txt });
    }
    const data: any = await xaiRes.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let parsed = { notes: ctx.notes, summary: ctx.summary } as any;
    try {
      parsed = JSON.parse(content);
    } catch {}
    const notes = Array.isArray(parsed.notes) ? parsed.notes : ctx.notes;
    const summary = typeof parsed.summary === "string" ? parsed.summary : ctx.summary;
    if (convexClient) {
      await convexSetNotes(meetingId, notes, summary);
      return res.json({ summary, notes });
    }
    store.setNotesAndSummary(meetingId, notes, summary);
    res.json({ summary, notes, fallback: true });
  } catch (err) {
    console.error("Grok notes exception", err);
    res.status(500).json({ error: "Notes refresh failed" });
  }
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
