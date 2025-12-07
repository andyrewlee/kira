import fetch from "node-fetch";
import { describe, it, expect } from "vitest";

const API = process.env.API || "http://localhost:4000";
const TOKEN = process.env.TOKEN || "dev-token";
const MEETING = process.env.MEETING || "demo-meeting";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function seedDemo() {
  const res = await fetch(`${API}/seedDemoMeeting`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: "smoke-user" }),
  });
  expect(res.ok).toBe(true);
  return res.json();
}

async function tts() {
  const res = await fetch(`${API}/tts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "Quick smoke briefing", voice: "una", speed: 1.0 }),
  });
  expect(res.ok).toBe(true);
  const buf = Buffer.from(await res.arrayBuffer());
  expect(buf.length).toBeGreaterThan(1000);
}

async function ingestTurn() {
  const res = await fetch(`${API}/meetings/${MEETING}/ingest`, {
    method: "POST",
    headers,
    body: JSON.stringify({ channel: "mic", speakerKey: "me", text: "Smoke turn", ts: Date.now(), source: "human" }),
  });
  expect(res.ok).toBe(true);
}

async function refreshNotes() {
  const res = await fetch(`${API}/notes/refresh`, {
    method: "POST",
    headers,
    body: JSON.stringify({ meetingId: MEETING }),
  });
  expect(res.ok).toBe(true);
  const data = await res.json();
  expect(Array.isArray(data.notes)).toBe(true);
  expect(typeof data.summary).toBe("string");
}

async function context() {
  const res = await fetch(`${API}/meetings/${MEETING}/context`, { headers: { Authorization: headers.Authorization } });
  expect(res.ok).toBe(true);
  const data = await res.json();
  expect(Array.isArray(data.turns)).toBe(true);
}

const integration = Boolean(process.env.RUN_INTEGRATION === "1");

describe.skipIf(!integration)("API smoke flow (integration)", () => {
  it("seed -> tts -> ingest -> notes -> context", async () => {
    await seedDemo();
    await tts();
    await ingestTurn();
    await refreshNotes();
    await context();
  });
});
