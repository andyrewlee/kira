import React from "react";
import { WebRTCDemo } from "../webrtc";
import { useAudioSessionState } from "./state";
import { BaselinePanel } from "./components/BaselinePanel";
import { ToastProvider, useToast } from "./toast/ToastContext";
import { briefMe, resetMeeting, seedDemo, chat, refreshNotes, buildAuthHeaders } from "./api";
import { sttBase64 } from "./api";
import { fetchMeetingContext as fetchMeetingContextFake } from "../context/fakeConvex";
import {
  fetchMeetingContext as fetchMeetingContextConvex,
  convexSeedDemo,
  convexResetMeeting,
  convexAppendTurn,
} from "../context/convexClient";
import { MeetingContextPayload, renderContextText } from "@shared";
import { playMp3Blob } from "./audio";
import { blobToBase64 } from "./utils";

const USE_WEBRTC_DESKTOP = import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";
const DEV_MODE = import.meta.env.VITE_DEV_MODE === "1";
const DEV_TOKEN = import.meta.env.VITE_DEMO_BEARER || "dev-token";

function MeetingAppInner() {
  const audioSession = useAudioSessionState();
  const { addToast } = useToast();
  const [context, setContext] = React.useState<MeetingContextPayload | null>(null);
  const [lastSTT, setLastSTT] = React.useState<string>("");
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const meetingId = "demo-meeting";

  // Ensure a token exists in dev to satisfy backend auth
  React.useEffect(() => {
    // Dev convenience only: set a bearer token if none exists and dev mode is on.
    if (DEV_MODE && typeof window !== "undefined" && !window.localStorage.getItem("authToken")) {
      window.localStorage.setItem("authToken", DEV_TOKEN);
    }

    const onWebRTCError = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      addToast(detail || "WebRTC error", "error");
      audioSession.send({ type: "CANCEL" });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("webrtc:error", onWebRTCError as any);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("webrtc:error", onWebRTCError as any);
      }
    };
  }, []);

  const handleSeed = async () => {
    if (USE_FAKE_CONTEXT) {
      await seedDemo();
    } else {
      try {
        await convexSeedDemo("demo-user");
      } catch {
        await seedDemo(); // backend fallback
      }
    }
    await loadContext();
    addToast("Demo seeded", "info");
  };
  const handleReset = async () => {
    if (USE_FAKE_CONTEXT) {
      await resetMeeting(meetingId);
    } else {
      try {
        await convexResetMeeting(meetingId);
      } catch {
        await resetMeeting(meetingId); // backend fallback
      }
    }
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
      const text = "New demo turn at " + new Date().toLocaleTimeString();
      if (USE_FAKE_CONTEXT) {
        const headers = await buildAuthHeaders();
        await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/meetings/${meetingId}/ingest`, {
          method: "POST",
          headers,
          body: JSON.stringify({ channel: "mic", speakerKey: "me", text, ts: Date.now(), source: "human" }),
        });
      } else {
        await convexAppendTurn({
          meetingId,
          channel: "mic",
          speakerKey: "me",
          text,
          ts: Date.now(),
          source: "human",
        });
      }
      await loadContext();
      addToast("Added demo turn", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to add turn", "error");
    }
  };

  const handleChat = async () => {
    try {
      const reply = await chat(meetingId, "What did we decide?");
      addToast(`Chat: ${reply.slice(0, 80)}...`, "info");
    } catch (err) {
      console.error(err);
      addToast("Chat failed", "error");
    }
  };

  const handleRefreshNotes = async () => {
    try {
      await refreshNotes(meetingId);
      await loadContext();
      addToast("Notes refreshed (stub)", "success");
    } catch (err) {
      console.error(err);
      addToast("Notes refresh failed", "error");
    }
  };

  const handleSTT = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      addToast("getUserMedia not supported", "error");
      return;
    }
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const b64 = await blobToBase64(blob);
        const { text } = await sttBase64(b64, "webm", meetingId, "me");
        setLastSTT(text);
        await loadContext();
        addToast("STT processed", "success");
        stream.getTracks().forEach((t) => t.stop());
        if (import.meta.env.VITE_AUDIO_RETENTION !== "keep_local_for_retry") {
          chunksRef.current = [];
        }
      };
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
      }, 4000); // 4s clip
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      addToast("STT failed", "error");
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
          onChat={handleChat}
          onRefreshNotes={handleRefreshNotes}
          onSTT={handleSTT}
          transcript={(context?.turns || []).map((t: any) => `${context?.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)}
          notes={context?.notes || []}
          summary={context?.summary || ""}
          lastSTT={lastSTT}
          isRecording={isRecording}
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
