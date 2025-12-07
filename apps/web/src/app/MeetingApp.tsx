import React from "react";
import { WebRTCDemo } from "../webrtc";
import { useAudioSessionState } from "./state";
import { BaselinePanel } from "./components/BaselinePanel";
import { ToastProvider, useToast } from "./toast/ToastContext";
import { briefMe, resetMeeting, seedDemo } from "./api";
import { fetchMeetingContext as fetchMeetingContextFake } from "../context/fakeConvex";
import { fetchMeetingContext as fetchMeetingContextConvex } from "../context/convexClient";
import { MeetingContextPayload, renderContextText } from "@shared";
import { playMp3Blob } from "./audio";
import { getAuthHeader } from "./api";

const USE_WEBRTC_DESKTOP = import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";
const DEV_TOKEN = import.meta.env.VITE_DEMO_BEARER || "dev-token";

function MeetingAppInner() {
  const audioSession = useAudioSessionState();
  const { addToast } = useToast();
  const [context, setContext] = React.useState<MeetingContextPayload | null>(null);
  const meetingId = "demo-meeting";

  // Ensure a token exists in dev to satisfy backend auth
  React.useEffect(() => {
    if (typeof window !== "undefined" && !window.localStorage.getItem("authToken")) {
      window.localStorage.setItem("authToken", DEV_TOKEN);
    }
  }, []);

  const handleSeed = async () => {
    await seedDemo();
    await loadContext();
    addToast("Demo seeded", "info");
  };
  const handleReset = async () => {
    await resetMeeting(meetingId);
    await loadContext();
    addToast("Meeting reset", "info");
  };
  const handleBrief = async () => {
    try {
      audioSession.send({ type: "PLAY_BRIEFING" });
      const blob = await briefMe(context?.summary || "Here is your briefing.", "una", 1.0);
      await playMp3Blob(blob);
      audioSession.send({ type: "STOP_PLAYBACK" });
      addToast("Playing briefing", "success");
    } catch (err) {
      console.error(err);
      addToast("Briefing failed", "error");
      audioSession.send({ type: "CANCEL" });
    }
  };

  const handleAddTurn = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/meetings/${meetingId}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ channel: "mic", speakerKey: "me", text: "New demo turn at " + new Date().toLocaleTimeString(), ts: Date.now(), source: "human" }),
      });
      await loadContext();
      addToast("Added demo turn", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to add turn", "error");
    }
  };

  const loadContext = React.useCallback(async () => {
    try {
      const ctx = USE_FAKE_CONTEXT
        ? await fetchMeetingContextFake(meetingId)
        : await fetchMeetingContextConvex(meetingId);
      setContext(ctx);
    } catch (err) {
      console.error(err);
      // Auto-seed if missing when not in fake mode
      const message = (err as Error)?.message || "";
      if (!USE_FAKE_CONTEXT && message.includes("404")) {
        await seedDemo();
        const ctx = await fetchMeetingContextConvex(meetingId);
        setContext(ctx);
        addToast("Demo meeting seeded automatically", "info");
        return;
      }
      addToast("Failed to load meeting context", "error");
    }
  }, []);

  React.useEffect(() => {
    void loadContext();
  }, [loadContext]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div>
        <BaselinePanel
          onSeed={handleSeed}
          onReset={handleReset}
          onBrief={handleBrief}
          onAddTurn={handleAddTurn}
          transcript={(context?.turns || []).map((t) => `${context?.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)}
          notes={context?.notes || []}
          summary={context?.summary || ""}
        />
        <div style={{ padding: "0.75rem 1rem", background: "#0f172a", color: "#94a3b8", borderTop: "1px solid #1f2937" }}>
          Audio session state: <span style={{ color: "#e2e8f0" }}>{audioSession.state}</span>
        </div>
      </div>
      <div style={{ borderLeft: "1px solid #1f2937" }}>
        {USE_WEBRTC_DESKTOP ? (
          <WebRTCDemo />
        ) : (
          <div style={{ padding: "2rem", color: "#fbbf24", background: "#111827", height: "100%" }}>
            WebRTC voice agent disabled (`USE_WEBRTC_DESKTOP=0`). Baseline briefing only.
          </div>
        )}
      </div>
    </div>
  );
}

export function MeetingApp() {
  return (
    <ToastProvider>
      <MeetingAppInner />
    </ToastProvider>
  );
}
