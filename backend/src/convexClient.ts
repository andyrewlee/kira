import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.warn("CONVEX_URL not set — backend will fall back to in-memory store.");
}

function buildClient(token?: string) {
  if (!CONVEX_URL) return null;
  const client = new ConvexHttpClient(CONVEX_URL);
  if (token) client.setAuth(token);
  return client;
}

export async function convexSeedDemo(userId: string, token?: string) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.mutation(api.src.functions.meetings.seedDemoMeeting, { userId });
}

export async function convexResetMeeting(meetingId: any, token?: string) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.mutation(api.src.functions.meetings.resetMeeting, { meetingId });
}

export async function convexAppendTurn(
  args: {
    meetingId: any;
    channel: "mic" | "system";
    speakerKey: string;
    text: string;
    ts: number;
    source: "human" | "system" | "llm";
  },
  token?: string
) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.mutation(api.src.functions.meetings.appendTurn, args);
}

export async function convexGetContext(meetingId: any, tail: number, token?: string) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.query(api.src.functions.meetings.getMeetingContext, { meetingId, tail });
}

export async function convexSetNotes(meetingId: any, notes: string[], summary: string, token?: string) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.mutation(api.src.functions.meetings.setNotesAndSummary, { meetingId, notes, summary });
}

export async function convexRenameSpeaker(meetingId: any, speakerKey: string, alias: string, token?: string) {
  const client = buildClient(token);
  if (!client) throw new Error("Convex client not configured");
  return client.mutation(api.src.functions.meetings.renameSpeaker, { meetingId, speakerKey, alias });
}

export function convexAvailable() {
  return Boolean(CONVEX_URL);
}
