// Placeholder Convex client wiring. Replace with real Convex-generated client.
import { MeetingContextPayload } from "@shared/context";
import { getMeetingContext, seedDemoMeeting, resetMeeting, appendTurn } from "../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_BEARER = import.meta.env.VITE_DEMO_BEARER || "dev-token";

const convexClient = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;

export async function fetchMeetingContext(meetingId: string, tail: number = 60): Promise<MeetingContextPayload> {
  if (convexClient) {
    const result = await convexClient.query(getMeetingContext, { meetingId, tail });
    return result as MeetingContextPayload;
  }
  // Fallback: hit backend in-memory endpoint
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/context?tail=${tail}`, {
    headers: { Authorization: `Bearer ${AUTH_BEARER}` },
  });
  if (!res.ok) throw new Error(`Context fetch failed: ${res.status}`);
  return (await res.json()) as MeetingContextPayload;
}

export async function convexSeedDemo(userId: string = "demo-user"): Promise<string> {
  if (!convexClient) throw new Error("Convex client not configured");
  const id = await convexClient.mutation(seedDemoMeeting, { userId });
  return id as string;
}

export async function convexResetMeeting(meetingId: string): Promise<void> {
  if (!convexClient) throw new Error("Convex client not configured");
  await convexClient.mutation(resetMeeting, { meetingId });
}

export async function convexAppendTurn(args: { meetingId: string; channel: "mic" | "system"; speakerKey: string; text: string; ts: number; source: "human" | "system" | "llm"; }) {
  if (!convexClient) throw new Error("Convex client not configured");
  await convexClient.mutation(appendTurn, args);
}
