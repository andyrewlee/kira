import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import ExpressWs from "express-ws";
import { requireAuth } from "./middleware/auth";
import { registerWebrtcRoutes } from "./webrtc/routes";
import { store } from "./store";
import {
  convexAvailable,
  convexSeedDemo,
  convexResetMeeting,
  convexGetContext,
  convexAppendTurn,
  convexSetNotes,
  convexRenameSpeaker,
} from "./convexClient";
import fetch, { Blob, FormData } from "node-fetch";

const { app } = ExpressWs(express() as any);

// Config
const DEBOUNCE_MS = Number(process.env.DEBOUNCE_MS || 3000);
const DEBOUNCE_TURNS = Number(process.env.DEBOUNCE_TURNS || 3);
const MAX_TURNS_CONTEXT = Number(process.env.MAX_TURNS_CONTEXT || 60);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 30);
const MOCK_XAI = process.env.MOCK_XAI === "1";
const AUDIO_RETENTION = process.env.AUDIO_RETENTION || "discard";

const getBearer = (req: Request): string | undefined => {
  const header = req.headers["authorization"];
  if (typeof header !== "string") return undefined;
  if (!header.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length);
};

const getAuthSubject = (req: Request): string | undefined => {
  const auth = (req as any).auth;
  return auth?.sub || auth?.user_id || auth?.uid;
};

function ensureStoreAccess(req: Request, meetingId: string) {
  const meeting = store.getMeeting(meetingId);
  const subject = getAuthSubject(req);
  if (meeting && subject && meeting.userId !== subject) {
    return { ok: false, meeting } as const;
  }
  return { ok: true, meeting } as const;
}

// Simple rate limiter per token+endpoint
const rateBuckets = new Map<string, number[]>();
function checkRateLimit(token: string | undefined, key: string) {
  if (!token) return false;
  const now = Date.now();
  const bucketKey = `${key}:${token}`;
  const arr = (rateBuckets.get(bucketKey) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (arr.length >= RATE_LIMIT_MAX) return true;
  arr.push(now);
  rateBuckets.set(bucketKey, arr);
  return false;
}

// Debug event buffer
type DebugEvent = { ts: string; type: string; meetingId?: string; details?: any };
const events: DebugEvent[] = [];
function pushEvent(evt: DebugEvent) {
  events.push(evt);
  if (events.length > 50) events.shift();
}

// Debounce refresh tracking
type TimeoutType = ReturnType<typeof setTimeout>;
type RefreshState = { count: number; timer: TimeoutType | null; token?: string; subject?: string };
const refreshTrack = new Map<string, RefreshState>();

async function refreshNotesInternal(meetingId: string, token?: string, subject?: string) {
  await handleNotesRefresh(meetingId, false, undefined, token, subject);
}

// CORS
const allowlistEnv =
  process.env.ALLOWED_ORIGINS || process.env.CORS_ALLOWLIST || "http://localhost:3000,http://localhost:5173,http://localhost:8080";
const allowlist = allowlistEnv.split(",").map((o) => o.trim()).filter(Boolean);
const ALLOW_FILE_ORIGIN = process.env.ALLOW_FILE_ORIGIN !== "0";
app.use(
  cors({
    origin: (origin, callback) => {
      // Electron/file:// requests have no origin header; allow when flag is on (default)
      if (!origin) {
        if (ALLOW_FILE_ORIGIN) return callback(null, true);
        return callback(null, false);
      }
      if (allowlist.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Phase 4 baseline endpoint shapes
app.post("/stt", requireAuth, async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.slice("Bearer ".length);
  if (checkRateLimit(token, "/stt")) return res.status(429).json({ error: "Rate limit" });
  try {
    const audio = req.body?.audio;
    const format = req.body?.format || "mp3";
    if (!audio) return res.status(400).json({ error: "Missing audio base64" });

    let text = "";
    if (MOCK_XAI) {
      text = "mock transcription";
    } else {
      const XAI_API_KEY = process.env.XAI_API_KEY;
      if (!XAI_API_KEY) return res.status(500).json({ error: "Missing XAI_API_KEY" });
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
      text = data.text || "";
    }

    // Optional ingest into Convex/store
    const meetingId = req.body?.meetingId;
    const speakerKey = req.body?.speakerKey || "me";
    const ts = Date.now();
    if (meetingId) {
      try {
        if (convexAvailable()) {
          await convexAppendTurn({ meetingId, channel: "mic", speakerKey, text, ts, source: "human" }, getBearer(req));
        } else {
          store.appendTurn({ meetingId, channel: "mic", speakerKey, text, ts, source: "human" });
        }
      } catch (err) {
        console.error("STT ingest failed", err);
      }
    }

    // Audio retention: never write audio to disk; note retention intent in event log
    pushEvent({
      ts: new Date().toISOString(),
      type: "stt",
      meetingId,
      details: { text, audio_retention: AUDIO_RETENTION },
    });
    res.json({ text, meetingId });
  } catch (err) {
    console.error("STT failed", err);
    res.status(500).json({ error: "STT failed" });
  }
});
app.post("/tts", requireAuth, async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.slice("Bearer ".length);
  if (checkRateLimit(token, "/tts")) return res.status(429).json({ error: "Rate limit" });
  try {
    const text = req.body?.text || "";
    const voice = req.body?.voice || process.env.VOICE || "una";
    const speed = req.body?.speed || 1.0;
    if (MOCK_XAI) {
      const buf = Buffer.from("mock-mp3");
      res.setHeader("Content-Type", "audio/mpeg");
      pushEvent({ ts: new Date().toISOString(), type: "tts", details: { bytes: buf.length, mock: true } });
      return res.send(buf);
    }

    const XAI_API_KEY = process.env.XAI_API_KEY;
    if (!XAI_API_KEY) return res.status(500).json({ error: "Missing XAI_API_KEY" });
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
    pushEvent({ ts: new Date().toISOString(), type: "tts", details: { bytes: buf.length } });
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
    if (convexAvailable()) ctx = await convexGetContext(meetingId, 20, getBearer(req));
  } catch (err) {
    console.error("Convex chat context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, 20);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });

  const system = `You are Kira, a meeting copilot. Use this meeting context only. Summary: ${ctx.summary}. Notes: ${ctx.notes.join(" | ")}. Recent turns: ${ctx.turns
    .map((t: any) => `${ctx.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)
    .join(" | ")}`;

  try {
    if (MOCK_XAI) {
      const reply = `mock reply to: ${message}`;
      pushEvent({ ts: new Date().toISOString(), type: "chat", meetingId, details: { reply, mock: true } });
      return res.json({ reply });
    }
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
    pushEvent({ ts: new Date().toISOString(), type: "chat", meetingId, details: { reply } });
    res.json({ reply });
  } catch (err) {
    console.error("Grok chat exception", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

async function handleNotesRefresh(
  meetingId: string,
  returnResponse: boolean = true,
  res?: express.Response,
  token?: string,
  subject?: string
) {
  let ctx: any = null;
  try {
    if (convexAvailable() && token) ctx = await convexGetContext(meetingId, MAX_TURNS_CONTEXT, token);
  } catch (err) {
    console.error("Convex notes context failed", err);
  }
  if (!ctx) ctx = store.getContext(meetingId, MAX_TURNS_CONTEXT);
  if (!ctx) {
    if (returnResponse && res) res.status(404).json({ error: "Meeting not found" });
    return;
  }
  if (subject) {
    const meeting = store.getMeeting(meetingId);
    if (meeting && meeting.userId !== subject) {
      if (returnResponse && res) res.status(403).json({ error: "Forbidden" });
      return;
    }
  }

  const prompt = `Summarize this meeting. Provide concise notes (bullets) and a summary. Recent turns: ${ctx.turns
    .map((t: any) => `${ctx.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)
    .join(" | ")}. Existing notes: ${ctx.notes.join(" | ")}. Current summary: ${ctx.summary}`;

  try {
    if (MOCK_XAI) {
      const notes = ctx.notes.length ? ctx.notes : ["mock note"];
      const summary = ctx.summary || "mock summary";
      if (convexAvailable() && token) await convexSetNotes(meetingId, notes, summary, token);
      else store.setNotesAndSummary(meetingId, notes, summary);
      pushEvent({ ts: new Date().toISOString(), type: "notes:set", meetingId, details: { summary, mock: true } });
      if (returnResponse && res) res.json({ summary, notes, mock: true });
      return;
    }

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
      if (returnResponse && res) return res.status(502).json({ error: "Grok notes failed", details: txt });
      return;
    }
    const data: any = await xaiRes.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let parsed = { notes: ctx.notes, summary: ctx.summary } as any;
    try {
      parsed = JSON.parse(content);
    } catch {}
    const notes = Array.isArray(parsed.notes) ? parsed.notes : ctx.notes;
    const summary = typeof parsed.summary === "string" ? parsed.summary : ctx.summary;
    const canUseConvex = convexAvailable() && Boolean(token);
    if (canUseConvex) {
      await convexSetNotes(meetingId, notes, summary, token);
    } else {
      store.setNotesAndSummary(meetingId, notes, summary);
    }
    pushEvent({ ts: new Date().toISOString(), type: "notes:set", meetingId, details: { summary } });
    if (returnResponse && res) res.json({ summary, notes, fallback: !canUseConvex });
  } catch (err) {
    console.error("Grok notes exception", err);
    if (returnResponse && res) res.status(500).json({ error: "Notes refresh failed" });
  }
}

// Notes refresh: call Grok to produce notes/summary, write to Convex/store
app.post("/notes/refresh", requireAuth, async (req, res) => {
  const meetingId = req.body?.meetingId || "demo-meeting";
  await handleNotesRefresh(meetingId, true, res, getBearer(req), getAuthSubject(req));
});

// Track desktop audio STT (optional)
app.post("/debug/logAudio", requireAuth, async (req, res) => {
  const { meetingId, path, sizeMb, duration, format, replay } = req.body || {};
  pushEvent({
    ts: new Date().toISOString(),
    type: replay ? "audio:stt_file_replay" : "audio:stt_file",
    meetingId,
    details: { path, sizeMb, duration, format, replay: Boolean(replay) },
  });
  res.json({ ok: true });
});

// Meeting handlers (Convex first, fallback to in-memory)
app.post("/seedDemoMeeting", requireAuth, async (req, res) => {
  const userId = getAuthSubject(req) || req.body?.userId || "demo-user";
  const token = getBearer(req);
  const subject = getAuthSubject(req);
  try {
    if (convexAvailable() && token) {
      const meetingId = await convexSeedDemo(userId, token);
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
  const token = getBearer(req);
  try {
    if (convexAvailable() && token) {
      await convexResetMeeting(meetingId, token);
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error("Convex resetMeeting failed", err);
  }
  const access = ensureStoreAccess(req, meetingId);
  if (!access.ok) return res.status(403).json({ error: "Forbidden" });
  store.resetMeeting(meetingId);
  res.json({ ok: true, fallback: true });
});

app.post("/meetings/:id/renameSpeaker", requireAuth, async (req, res) => {
  const meetingId = req.params.id;
  const { speakerKey, alias } = req.body || {};
  if (!speakerKey || !alias) return res.status(400).json({ error: "Missing speakerKey/alias" });
  const token = getBearer(req);
  try {
    if (convexAvailable() && token) {
      await convexRenameSpeaker(meetingId, speakerKey, alias, token);
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error("Convex renameSpeaker failed", err);
  }
  const access = ensureStoreAccess(req, meetingId);
  if (!access.ok) return res.status(403).json({ error: "Forbidden" });
  store.renameSpeaker(meetingId, speakerKey, alias);
  res.json({ ok: true, fallback: true });
});

app.get("/meetings/:id/context", requireAuth, async (req, res) => {
  const tail = Number(req.query.tail) || 60;
  const token = getBearer(req);
  try {
    if (convexAvailable() && token) {
      const ctx = await convexGetContext(req.params.id, tail, token);
      return res.json(ctx);
    }
  } catch (err) {
    console.error("Convex getContext failed", err);
  }
  const access = ensureStoreAccess(req, req.params.id);
  if (!access.ok) return res.status(403).json({ error: "Forbidden" });
  const ctx = store.getContext(req.params.id, tail);
  if (!ctx) return res.status(404).json({ error: "Meeting not found" });
  res.json(ctx);
});

app.post("/meetings/:id/ingest", requireAuth, async (req, res) => {
  const meetingId = req.params.id;
  const { channel = "mic", speakerKey = "me", text = "", ts = Date.now(), source = "human" } = req.body || {};
  const token = getBearer(req);
  const subject = getAuthSubject(req);
  try {
    if (convexAvailable() && token) {
      await convexAppendTurn({ meetingId, channel, speakerKey, text, ts, source }, token);
      return res.json({ ok: true });
    }
  } catch (err) {
    console.error("Convex ingest failed", err);
  }
  const access = ensureStoreAccess(req, meetingId);
  if (!access.ok) return res.status(403).json({ error: "Forbidden" });
  store.appendTurn({ meetingId, channel, speakerKey, text, ts, source });
  // Debounce notes refresh
  const entry = refreshTrack.get(meetingId) || { count: 0, timer: null, token, subject };
  entry.token = token;
  entry.subject = subject;
  entry.count += 1;
  if (entry.count >= DEBOUNCE_TURNS) {
    entry.count = 0;
    if (entry.timer) clearTimeout(entry.timer);
    refreshNotesInternal(meetingId, entry.token, entry.subject);
  } else {
    if (entry.timer) clearTimeout(entry.timer);
    entry.timer = setTimeout(() => {
      refreshNotesInternal(meetingId, entry.token, entry.subject);
      const current = refreshTrack.get(meetingId);
      if (current) current.count = 0;
    }, DEBOUNCE_MS);
  }
  refreshTrack.set(meetingId, entry);

  pushEvent({ ts: new Date().toISOString(), type: "ingest", meetingId, details: { channel, speakerKey } });
  res.json({ ok: true, fallback: true });
});

app.get("/debug/events", requireAuth, (_req, res) => {
  res.json(events);
});

// Phase 5 WebRTC relay (xAI example integration)
registerWebrtcRoutes({ app: app as any, requireAuth });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend stub listening on :${PORT}`);
});
