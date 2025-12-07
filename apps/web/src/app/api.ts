// Minimal API helpers; replace with real implementations when backend is ready.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_BEARER = import.meta.env.VITE_DEMO_BEARER || "dev-token";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";
const DEV_MODE = import.meta.env.VITE_DEV_MODE === "1";

export async function seedDemo(): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  const headers = await buildAuthHeaders();
  await fetch(`${API_BASE_URL}/seedDemoMeeting`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: "demo-user" }),
  }).then(assertOk);
}

export async function resetMeeting(meetingId: string): Promise<void> {
  if (USE_FAKE_CONTEXT) return;
  const headers = await buildAuthHeaders();
  await fetch(`${API_BASE_URL}/resetMeeting`, {
    method: "POST",
    headers,
    body: JSON.stringify({ meetingId }),
  }).then(assertOk);
}

export async function refreshNotes(meetingId: string): Promise<{ summary: string; notes: string[] }> {
  if (USE_FAKE_CONTEXT) return { summary: "Fake summary", notes: ["Fake note"] };
  const headers = await buildAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/notes/refresh`, {
    method: "POST",
    headers,
    body: JSON.stringify({ meetingId }),
  });
  if (!res.ok) throw new Error(`Notes refresh failed ${res.status}`);
  return (await res.json()) as { summary: string; notes: string[] };
}

export async function chat(meetingId: string, message: string): Promise<string> {
  if (USE_FAKE_CONTEXT) return "Stub chat (fake context).";
  const headers = await buildAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ meetingId, message }),
  });
  if (!res.ok) throw new Error(`Chat failed ${res.status}`);
  const data = await res.json();
  return data.reply || "";
}

export async function briefMe(text: string, voice: string = "una", speed: number = 1.0): Promise<Blob> {
  const headers = await buildAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/tts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text, voice, speed }),
  });
  if (!res.ok) throw new Error(`TTS failed (${res.status})`);
  return await res.blob();
}

export async function sttBase64(audioBase64: string, format: string = "mp3", meetingId?: string, speakerKey: string = "me") {
  const headers = await buildAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/stt`, {
    method: "POST",
    headers,
    body: JSON.stringify({ audio: audioBase64, format, meetingId, speakerKey }),
  });
  if (!res.ok) throw new Error(`STT failed ${res.status}`);
  return (await res.json()) as { text: string; meetingId?: string };
}

export async function getAuthToken(): Promise<string> {
  if (typeof window !== "undefined") {
    // Prefer Clerk if available
    const clerk: any = (window as any).Clerk;
    if (clerk?.session?.getToken) {
      try {
        const t = await clerk.session.getToken();
        if (t) return t;
      } catch {
        // fall through to dev token/local storage
      }
    }
    const stored = window.localStorage.getItem("authToken");
    if (stored) return stored;
  }
  return DEV_MODE ? AUTH_BEARER : "";
}

export async function buildAuthHeaders() {
  const token = await getAuthToken();
  if (!token) throw new Error("No auth token available");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  } as Record<string, string>;
}

// Synchronous helper for quick calls that only need a dev/local token fallback.
export function getAuthHeaderSync() {
  const token =
    (typeof window !== "undefined" && window.localStorage.getItem("authToken")) || (DEV_MODE ? AUTH_BEARER : "");
  if (!token) throw new Error("No auth token available");
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
}

function assertOk(res: Response) {
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res;
}
