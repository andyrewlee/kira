// Minimal API helpers; replace with real implementations when backend is ready.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_BEARER = import.meta.env.VITE_DEMO_BEARER || "dev-token";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";

export async function seedDemo(): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  await fetch(`${API_BASE_URL}/seedDemoMeeting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ userId: "demo-user" }),
  }).then(assertOk);
}

export async function resetMeeting(meetingId: string): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  await fetch(`${API_BASE_URL}/resetMeeting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ meetingId }),
  }).then(assertOk);
}

export async function briefMe(text: string, voice: string = "una", speed: number = 1.0): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ text, voice, speed }),
  });
  if (!res.ok) throw new Error(`TTS failed (${res.status})`);
  return await res.blob();
}

export function getAuthHeader() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
  return { Authorization: `Bearer ${token || AUTH_BEARER}` };
}

function assertOk(res: Response) {
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res;
}
