// Placeholder Convex client wiring. Replace with real Convex-generated client.
import { MeetingContextPayload } from "@shared/context";
// adjust the import path once convex codegen is added
// import { getMeetingContext } from "../../convex/_generated/api";
// import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_BEARER = import.meta.env.VITE_DEMO_BEARER || "dev-token";

// Lazy client (will stay null until convex codegen exists)
let convexClient: any = null;

export async function fetchMeetingContext(meetingId: string, tail: number = 60): Promise<MeetingContextPayload> {
  if (CONVEX_URL && convexClient && convexClient.query) {
    // TODO: enable once convex codegen is present
    // const result = await convexClient.query(getMeetingContext, { meetingId, tail });
    // return result as MeetingContextPayload;
  }

  // Fallback: hit backend in-memory endpoint
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/context?tail=${tail}`, {
    headers: {
      Authorization: `Bearer ${AUTH_BEARER}`,
    },
  });
  if (!res.ok) throw new Error(`Context fetch failed: ${res.status}`);
  return (await res.json()) as MeetingContextPayload;
}
