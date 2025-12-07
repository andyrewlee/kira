// Placeholder Convex client wiring. Replace with real Convex-generated client.
import { MeetingContextPayload } from "@shared/context";
import { getMeetingContext } from "../../convex/_generated/api"; // adjust path when convex client is generated
import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const client = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;

export async function fetchMeetingContext(meetingId: string, tail: number = 60): Promise<MeetingContextPayload> {
  if (!client) throw new Error("CONVEX_URL not set");
  const result = await client.query(getMeetingContext, { meetingId, tail });
  return result as MeetingContextPayload;
}
