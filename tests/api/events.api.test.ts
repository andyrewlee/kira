import fetch from "node-fetch";
import { describe, it, expect, beforeAll } from "vitest";

const API = process.env.API || "http://localhost:4000";
const TOKEN = process.env.TOKEN || "dev-token";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};
const integration = Boolean(process.env.RUN_INTEGRATION === "1");
const meetingId = "demo-meeting";

describe.skipIf(!integration)("events buffer", () => {
  beforeAll(async () => {
    await fetch(`${API}/seedDemoMeeting`, { method: "POST", headers, body: JSON.stringify({ userId: "events" }) });
    await fetch(`${API}/meetings/${meetingId}/ingest`, {
      method: "POST",
      headers,
      body: JSON.stringify({ channel: "mic", speakerKey: "me", text: "Hello", ts: Date.now(), source: "human" }),
    });
  });

  it("collects recent events", async () => {
    const res = await fetch(`${API}/debug/events`, { headers });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
