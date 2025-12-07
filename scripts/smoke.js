#!/usr/bin/env node
// Lightweight API smoke test (no shell script)
// Usage: API=http://localhost:4000 TOKEN=dev-token MEETING=demo-meeting npm run smoke

const API = process.env.API || "http://localhost:4000";
const TOKEN = process.env.TOKEN || "dev-token";
const MEETING = process.env.MEETING || "demo-meeting";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function step(name, fn) {
  process.stdout.write(`[smoke] ${name}\n`);
  return fn();
}

async function seedDemo() {
  const res = await fetch(`${API}/seedDemoMeeting`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: "smoke-user" }),
  });
  if (!res.ok) throw new Error(`seedDemo failed ${res.status}`);
  return res.json();
}

async function tts() {
  const res = await fetch(`${API}/tts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "Quick smoke briefing", voice: "una", speed: 1.0 }),
  });
  if (!res.ok) throw new Error(`tts failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`[smoke] tts mp3 bytes: ${buf.length}`);
}

async function ingestTurn() {
  const res = await fetch(`${API}/meetings/${MEETING}/ingest`, {
    method: "POST",
    headers,
    body: JSON.stringify({ channel: "mic", speakerKey: "me", text: "Smoke turn", ts: Date.now(), source: "human" }),
  });
  if (!res.ok) throw new Error(`ingest failed ${res.status}`);
}

async function refreshNotes() {
  const res = await fetch(`${API}/notes/refresh`, {
    method: "POST",
    headers,
    body: JSON.stringify({ meetingId: MEETING }),
  });
  if (!res.ok) throw new Error(`notes refresh failed ${res.status}`);
  const data = await res.json();
  console.log(`[smoke] notes count: ${data.notes?.length ?? 0}`);
}

async function context() {
  const res = await fetch(`${API}/meetings/${MEETING}/context`, { headers: { Authorization: headers.Authorization } });
  if (!res.ok) throw new Error(`context failed ${res.status}`);
  const data = await res.json();
  console.log(`[smoke] turns: ${data.turns?.length ?? 0}, summary len: ${data.summary?.length ?? 0}`);
}

(async () => {
  try {
    await step("Seed", seedDemo);
    await step("TTS", tts);
    await step("Ingest turn", ingestTurn);
    await step("Refresh notes", refreshNotes);
    await step("Context", context);
    console.log("[smoke] OK");
    process.exit(0);
  } catch (err) {
    console.error("[smoke] FAILED", err.message || err);
    process.exit(1);
  }
})();
