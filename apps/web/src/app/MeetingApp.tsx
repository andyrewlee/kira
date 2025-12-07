import React from "react";
import { WebRTCDemo } from "../webrtc";
import { useAudioSessionState } from "./state";

const USE_WEBRTC_DESKTOP = import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";

export function MeetingApp() {
  const audioSession = useAudioSessionState();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div style={{ padding: "1rem", background: "#0f172a", color: "#e2e8f0" }}>
        <h1 style={{ margin: 0, fontSize: "20px" }}>Kira Meeting</h1>
        <p style={{ color: "#94a3b8" }}>Baseline UI placeholder (transcript/notes/summary coming next).</p>
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#1e293b", borderRadius: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "16px" }}>Brief Me</h2>
          <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
            Baseline TTS pipeline goes here (call /tts, playback, tap-to-interrupt). To be implemented.
          </p>
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
