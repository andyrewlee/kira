import React from "react";
import { WebRTCDemo } from "../webrtc";
import { useAudioSessionState } from "./state";
import { BaselinePanel } from "./components/BaselinePanel";
import { ToastProvider, useToast } from "./toast/ToastContext";
import { briefMe, resetMeeting, seedDemo } from "./api";

const USE_WEBRTC_DESKTOP = import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";

function MeetingAppInner() {
  const audioSession = useAudioSessionState();
  const { addToast } = useToast();

  const handleSeed = async () => {
    await seedDemo();
    addToast("Demo seeded (stub)", "info");
  };
  const handleReset = async () => {
    await resetMeeting("demo");
    addToast("Meeting reset (stub)", "info");
  };
  const handleBrief = async () => {
    await briefMe();
    addToast("Brief Me triggered (stub)", "info");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div>
        <BaselinePanel onSeed={handleSeed} onReset={handleReset} onBrief={handleBrief} />
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
