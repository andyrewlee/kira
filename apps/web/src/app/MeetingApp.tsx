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

const USE_WEBRTC_DESKTOP = import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";

function MeetingAppInner() {
  const audioSession = useAudioSessionState();
  const { addToast } = useToast();
  const [context, setContext] = React.useState<MeetingContextPayload | null>(null);
  const meetingId = "demo-meeting";

  const handleSeed = async () => {
    await seedDemo();
    await loadContext();
    addToast("Demo seeded", "info");
  };
  const handleReset = async () => {
    await resetMeeting("demo");
    await loadContext();
    addToast("Meeting reset", "info");
  };
  const handleBrief = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_DEMO_BEARER || "dev-token"}` },
        body: JSON.stringify({ text: context?.summary || "Here is your briefing.", voice: "una", speed: 1.0 }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      await playMp3Blob(blob);
      addToast("Playing briefing", "success");
    } catch (err) {
      console.error(err);
      addToast("Briefing failed", "error");
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
