// Placeholder Convex client wiring. Replace with real Convex-generated client.
import type { MeetingContextPayload } from "@shared/context";
import * as convexApi from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { getAuthToken } from "../app/api";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const convexClient = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;
let convexAuthSet = false;
async function ensureConvexAuth() {
  if (!convexClient) return;
  if (convexAuthSet) return;
  try {
    const token = await getAuthToken();
    if (token) {
      convexClient.setAuth(token);
      convexAuthSet = true;
    }
  } catch {
    // ignore
  }
}

export async function fetchMeetingContext(meetingId: string, tail: number = 60): Promise<MeetingContextPayload> {
  if (convexClient) {
    await ensureConvexAuth();
    const result = await convexClient.query(convexApi.api.src.functions.meetings.getMeetingContext, { meetingId, tail });
    return result as MeetingContextPayload;
  }
  // Fallback: hit backend in-memory endpoint
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/context?tail=${tail}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Context fetch failed: ${res.status}`);
  return (await res.json()) as MeetingContextPayload;
}

export async function convexSeedDemo(userId: string = "demo-user"): Promise<string> {
  if (!convexClient) throw new Error("Convex client not configured");
  await ensureConvexAuth();
  const id = await convexClient.mutation(convexApi.api.src.functions.meetings.seedDemoMeeting, { userId });
  return id as string;
}

export async function convexResetMeeting(meetingId: string): Promise<void> {
  if (!convexClient) throw new Error("Convex client not configured");
  await ensureConvexAuth();
  await convexClient.mutation(convexApi.api.src.functions.meetings.resetMeeting, { meetingId });
}

export async function convexAppendTurn(args: { meetingId: string; channel: "mic" | "system"; speakerKey: string; text: string; ts: number; source: "human" | "system" | "llm"; }) {
  if (!convexClient) throw new Error("Convex client not configured");
  await ensureConvexAuth();
  await convexClient.mutation(convexApi.api.src.functions.meetings.appendTurn, args);
}
