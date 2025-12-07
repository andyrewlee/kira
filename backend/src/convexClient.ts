import { ConvexHttpClient } from "convex/browser";
import { appendTurn, seedDemoMeeting, resetMeeting, getMeetingContext, setNotesAndSummary } from "../convex/_generated/api";

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.warn("CONVEX_URL not set — backend will fall back to in-memory store.");
}

export const convexClient = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null;

export async function convexSeedDemo(userId: string) {
  if (!convexClient) throw new Error("Convex client not configured");
  return convexClient.mutation(seedDemoMeeting, { userId });
}

export async function convexResetMeeting(meetingId: any) {
  if (!convexClient) throw new Error("Convex client not configured");
  return convexClient.mutation(resetMeeting, { meetingId });
}

export async function convexAppendTurn(args: {
  meetingId: any;
  channel: "mic" | "system";
  speakerKey: string;
  text: string;
  ts: number;
  source: "human" | "system" | "llm";
}) {
  if (!convexClient) throw new Error("Convex client not configured");
  return convexClient.mutation(appendTurn, args);
}

export async function convexGetContext(meetingId: any, tail: number) {
  if (!convexClient) throw new Error("Convex client not configured");
  return convexClient.query(getMeetingContext, { meetingId, tail });
}

export async function convexSetNotes(meetingId: any, notes: string[], summary: string) {
  if (!convexClient) throw new Error("Convex client not configured");
  return convexClient.mutation(setNotesAndSummary, { meetingId, notes, summary });
}
