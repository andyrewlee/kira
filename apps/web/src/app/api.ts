// Minimal API helpers; replace with real implementations when backend is ready.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_BEARER = import.meta.env.VITE_DEMO_BEARER || "dev-token";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";

export async function seedDemo(): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  // TODO: call Convex mutation seedDemoMeeting
  console.warn("seedDemo(): backend wiring not implemented");
}

export async function resetMeeting(meetingId: string): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  // TODO: call Convex mutation resetMeeting
  console.warn("resetMeeting(): backend wiring not implemented", meetingId);
}

export async function briefMe(): Promise<void> {
  // TODO: call /tts once implemented
  console.warn("briefMe(): TTS wiring not implemented");
}

export function getAuthHeader() {
  return { Authorization: `Bearer ${AUTH_BEARER}` };
}
