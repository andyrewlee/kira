import React from "react";
import { WebRTCDemo } from "../webrtc";
import { useAudioSessionState } from "./state";
import { BaselinePanel } from "./components/BaselinePanel";
import { ToastProvider, useToast } from "./toast/ToastContext";
import { briefMe, resetMeeting, seedDemo, chat, refreshNotes, buildAuthHeaders, sttBase64 } from "./api";
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

const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
const IS_DESKTOP = (window as any)?.kiraDesktop?.isDesktop || searchParams?.get("desktop") === "1";

const USE_WEBRTC_DESKTOP = IS_DESKTOP ? true : import.meta.env.VITE_USE_WEBRTC_DESKTOP !== "0";
const USE_FAKE_CONTEXT = import.meta.env.VITE_USE_FAKE_CONTEXT === "1";
const AUDIO_RETENTION = import.meta.env.VITE_AUDIO_RETENTION || "discard";
const BRIEFING_MODE = import.meta.env.VITE_BRIEFING_MODE || "tts";
const VOICE_INTERRUPT_MODE = import.meta.env.VITE_VOICE_INTERRUPT_MODE || "tap";
const VOICE = import.meta.env.VITE_VOICE || "una";
const LAST_AUDIO_KEY = "kira:lastAudio";
const DEBUG_POLL_MS = Number(import.meta.env.VITE_DEBUG_POLL_MS || 10000);

async function postAudioLog(payload: {
  meetingId: string;
  path: string;
  sizeMb?: string | null;
  duration?: string | null;
  format: string;
  replay: boolean;
}) {
  try {
    const headers = await buildAuthHeaders();
    await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/debug/logAudio`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to log audio debug event", err);
  }
}

function MeetingAppInner() {
  const audioSession = useAudioSessionState();
  const { addToast } = useToast();
  const [context, setContext] = React.useState<MeetingContextPayload | null>(null);
  const [lastSTT, setLastSTT] = React.useState<string>("");
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [webrtcAvailable, setWebrtcAvailable] = React.useState<boolean>(USE_WEBRTC_DESKTOP);
  const [speakerMe, setSpeakerMe] = React.useState<string>("Me");
  const [speakerThem, setSpeakerThem] = React.useState<string>("Them");
  const [events, setEvents] = React.useState<any[]>([]);
  const [lastAudio, setLastAudio] = React.useState<HTMLAudioElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(1);
  const [desktopVersion, setDesktopVersion] = React.useState<string | undefined>(undefined);
  const [selectedAudioPath, setSelectedAudioPath] = React.useState<string | null>(null);
  const [selectedAudioSizeMb, setSelectedAudioSizeMb] = React.useState<string | null>(null);
  const [selectedAudioDuration, setSelectedAudioDuration] = React.useState<string | null>(null);
  const [audioStatus, setAudioStatus] = React.useState<"none" | "loaded" | "missing">("none");
  const eventsRef = React.useRef<number | null>(null);
  const [autoRefreshEvents, setAutoRefreshEvents] = React.useState<boolean>(IS_DESKTOP);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const meetingId = "demo-meeting";

  const playBaselineBriefing = React.useCallback(
    async (text?: string) => {
      const summary = text || context?.summary || "Here is your briefing.";
      const blob = await briefMe(summary, VOICE, playbackSpeed);
      const audioEl = await playMp3Blob(blob);
      audioEl.playbackRate = playbackSpeed;
      setLastAudio(audioEl);
      audioSession.send({ type: "STOP_PLAYBACK" });
      addToast("Playing briefing", "success");
    },
    [addToast, audioSession, context?.summary, playbackSpeed]
  );

  const handleWebRTCFallback = React.useCallback(
    async (_reason?: string) => {
      if (lastAudio) {
        lastAudio.pause();
        lastAudio.currentTime = 0;
      }
      audioSession.send({ type: "CANCEL" });
      setWebrtcAvailable(false);
      addToast("Voice agent unavailable — using standard briefing", "error");
      if (BRIEFING_MODE === "webrtc" && audioSession.state === "playingBriefing") {
        try {
          await playBaselineBriefing();
        } catch (err) {
          console.error("Baseline briefing fallback failed", err);
        }
      }
    },
    [addToast, audioSession, lastAudio, playBaselineBriefing]
  );

  // Listen for WebRTC errors/fallbacks and voice interrupts
  React.useEffect(() => {
    const onWebRTCError = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      console.warn("WebRTC error", detail);
      void handleWebRTCFallback(detail);
    };
    const onWebRTCFallback = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      console.warn("WebRTC fallback", detail);
      void handleWebRTCFallback(detail);
    };
    const onInterrupt = () => audioSession.send({ type: "INTERRUPT" });

    if (typeof window !== "undefined") {
      window.addEventListener("webrtc:error", onWebRTCError as any);
      window.addEventListener("webrtc:fallback", onWebRTCFallback as any);
      window.addEventListener("webrtc:interrupt", onInterrupt as any);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("webrtc:error", onWebRTCError as any);
        window.removeEventListener("webrtc:fallback", onWebRTCFallback as any);
        window.removeEventListener("webrtc:interrupt", onInterrupt as any);
      }
    };
  }, [audioSession, handleWebRTCFallback]);

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
      const summaryText = context?.summary || "Here is your briefing.";
      if (BRIEFING_MODE === "webrtc" && webrtcAvailable) {
        window.dispatchEvent(new CustomEvent("webrtc:brief", { detail: summaryText }));
        addToast("Sending briefing over WebRTC", "info");
      } else {
        await playBaselineBriefing(summaryText);
      }
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
      // Speak reply via TTS
      const blob = await briefMe(reply, VOICE, playbackSpeed);
      const audioEl = await playMp3Blob(blob);
      audioEl.playbackRate = playbackSpeed;
      setLastAudio(audioEl);
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
        if (AUDIO_RETENTION !== "keep_local_for_retry") {
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
      setSpeakerMe(ctx.speakerAliases?.me || "Me");
      setSpeakerThem(ctx.speakerAliases?.them || "Them");
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
  }, [addToast]);

  const handleReplaySTT = React.useCallback(async () => {
    if (!selectedAudioPath || !(window as any).kiraDesktop?.loadAudioByPath) {
      addToast("No audio file loaded", "error");
      return;
    }
    try {
      const result =
        (await (window as any).kiraDesktop?.loadAudioByPath?.(selectedAudioPath)) ||
        (await (window as any).kiraDesktop?.loadAudioFile?.());
      if (!result) {
        addToast("Saved audio missing or unreadable", "error");
        setSelectedAudioPath(null);
        setSelectedAudioSizeMb(null);
        setSelectedAudioDuration(null);
        setAudioStatus("missing");
        if (typeof window !== "undefined") window.localStorage.removeItem(LAST_AUDIO_KEY);
        return;
      }
      const rawExt = (result.ext || "mp3").toLowerCase();
      const format = rawExt === "wav" ? "wav" : "mp3";
      const { text } = await sttBase64(result.base64, format, meetingId, "me");
      setLastSTT(text);
      await loadContext();
      const sizeMb = result.size ? (result.size / 1024 / 1024).toFixed(2) : undefined;
      setSelectedAudioPath(result.path);
      setSelectedAudioSizeMb(sizeMb || null);
      setSelectedAudioDuration(result.durationSec ? `${result.durationSec.toFixed(1)}s` : null);
      setAudioStatus("loaded");
      const detail = [sizeMb ? `${sizeMb} MB` : null, result.durationSec ? `${result.durationSec.toFixed(1)}s` : null].filter(Boolean).join(", ");
      addToast(`Re-transcribed ${format.toUpperCase()}${detail ? ` (${detail})` : ""}`, "success");
      void postAudioLog({ meetingId, path: result.path, sizeMb, duration: result.durationSec ? `${result.durationSec.toFixed(1)}s` : null, format, replay: true });
    } catch (err) {
      console.error(err);
      addToast("Replay STT failed", "error");
    }
  }, [addToast, loadContext, meetingId, selectedAudioPath]);

  React.useEffect(() => {
    void loadContext();
  }, [loadContext]);

  // Fetch desktop version when available
  React.useEffect(() => {
    if (IS_DESKTOP && (window as any).kiraDesktop?.getVersion) {
      (window as any)
        .kiraDesktop.getVersion()
        .then((v: string) => setDesktopVersion(v))
        .catch(() => {});
    }
  }, []);

  // Clear persisted desktop audio info when not running desktop
  React.useEffect(() => {
    if (!IS_DESKTOP && typeof window !== "undefined") {
      window.localStorage.removeItem(LAST_AUDIO_KEY);
      setAudioStatus("none");
    }
  }, []);

  // Poll debug events every 10s when desktop to surface backend logs automatically
  React.useEffect(() => {
    if (!IS_DESKTOP || !autoRefreshEvents) return;
    let cancelled = false;
    let polling = false;
    const poll = async () => {
      if (polling) return;
      polling = true;
      try {
        const headers = await buildAuthHeaders();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/debug/events`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setEvents(data);
        }
      } catch (err) {
        console.error("Debug events poll failed", err);
      } finally {
        polling = false;
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (eventsRef.current) {
          window.clearInterval(eventsRef.current);
          eventsRef.current = null;
        }
      } else if (document.visibilityState === "visible") {
        if (!eventsRef.current) {
          eventsRef.current = window.setInterval(poll, DEBUG_POLL_MS);
        }
      }
    };
    poll();
    eventsRef.current = window.setInterval(poll, DEBUG_POLL_MS);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (eventsRef.current) window.clearInterval(eventsRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelled = true;
    };
  }, [autoRefreshEvents]);
  const handleClearSavedAudio = () => {
    setSelectedAudioPath(null);
    setSelectedAudioSizeMb(null);
    setSelectedAudioDuration(null);
    setAudioStatus("none");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LAST_AUDIO_KEY);
    }
    addToast("Cleared saved audio", "info");
  };

  // Restore last loaded audio info (desktop only)
  React.useEffect(() => {
    if (!IS_DESKTOP || typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(LAST_AUDIO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { path?: string; sizeMb?: string; dur?: string } | null;
        if (parsed?.path) {
          const hydrate = async () => {
            const exists = await (window as any).kiraDesktop?.checkFile?.(parsed.path);
            if (!exists) {
              setAudioStatus("missing");
              addToast("Saved audio missing on disk", "error");
              return;
            }
            setSelectedAudioPath(parsed.path || null);
            setSelectedAudioSizeMb(parsed.sizeMb || null);
            setSelectedAudioDuration(parsed.dur || null);
            setAudioStatus("loaded");
            addToast("Restored last loaded audio", "info");
          };
          void hydrate();
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [addToast]);

  React.useEffect(() => {
    if (!IS_DESKTOP && typeof window !== "undefined") {
      window.localStorage.removeItem(LAST_AUDIO_KEY);
      setAudioStatus("none");
    }
  }, []);

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
          onInterrupt={() => {
            if (lastAudio) {
              lastAudio.pause();
              lastAudio.currentTime = 0;
            }
            audioSession.send({ type: "INTERRUPT" });
          }}
          onSkipBack={() => {
            if (lastAudio) lastAudio.currentTime = Math.max(0, lastAudio.currentTime - 10);
          }}
          onSkipForward={() => {
            if (lastAudio) lastAudio.currentTime = Math.min((lastAudio.duration || 0), lastAudio.currentTime + 10);
          }}
          onSpeedChange={(s) => {
            setPlaybackSpeed(s);
            if (lastAudio) lastAudio.playbackRate = s;
          }}
          transcript={(context?.turns || []).map((t: any) => `${context?.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`)}
          notes={context?.notes || []}
          summary={context?.summary || ""}
          lastSTT={lastSTT}
          isRecording={isRecording}
          speakerMe={speakerMe}
          speakerThem={speakerThem}
          onRenameSpeaker={async (key, alias) => {
            try {
              const headers = await buildAuthHeaders();
              await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/meetings/${meetingId}/renameSpeaker`, {
                method: "POST",
                headers,
                body: JSON.stringify({ speakerKey: key, alias }),
              });
              await loadContext();
              addToast("Speaker renamed", "success");
            } catch (err) {
              console.error(err);
              addToast("Rename failed", "error");
            }
          }}
          events={events}
          onRefreshEvents={async () => {
            try {
              const headers = await buildAuthHeaders();
              const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/debug/events`, { headers });
              if (res.ok) {
                setEvents(await res.json());
              }
            } catch (err) {
              console.error(err);
            }
          }}
          voiceInterruptMode={VOICE_INTERRUPT_MODE}
          playbackSpeed={playbackSpeed}
          isDesktop={IS_DESKTOP}
          desktopVersion={desktopVersion}
          autoRefreshEvents={autoRefreshEvents}
          onToggleAutoRefresh={() => setAutoRefreshEvents((v) => !v)}
          onOpenLogs={
            IS_DESKTOP && (window as any).kiraDesktop?.openLogs
              ? () => (window as any).kiraDesktop?.openLogs?.()
              : undefined
          }
          onSelectAudio={
            IS_DESKTOP && (window as any).kiraDesktop?.loadAudioFile
              ? async () => {
                  try {
                    const result = await (window as any).kiraDesktop?.loadAudioFile?.();
                    if (!result) return;
                    setSelectedAudioPath(result.path);
                    const rawExt = (result.ext || "mp3").toLowerCase();
                    const format = rawExt === "wav" ? "wav" : "mp3"; // normalise to supported formats
                    const { text } = await sttBase64(result.base64, format, meetingId, "me");
                    setLastSTT(text);
                    await loadContext();
                    const sizeMb = result.size ? (result.size / 1024 / 1024).toFixed(2) : undefined;
                    setSelectedAudioSizeMb(sizeMb || null);
                    const dur = result.durationSec ? `${result.durationSec.toFixed(1)}s` : undefined;
                    setSelectedAudioDuration(dur || null);
                    try {
                      window.localStorage.setItem(LAST_AUDIO_KEY, JSON.stringify({ path: result.path, sizeMb: sizeMb || null, dur }));
                    } catch {
                      // ignore storage failures
                    }
                    setAudioStatus("loaded");
                    const detail = [sizeMb ? `${sizeMb} MB` : null, dur].filter(Boolean).join(", ");
                    addToast(`Transcribed ${format.toUpperCase()}${detail ? ` (${detail})` : ""}`, "success");

                    // Log into backend debug events panel for traceability
                    void postAudioLog({ meetingId, path: result.path, sizeMb, duration: dur || null, format, replay: false });
                  } catch (err) {
                    console.error(err);
                    addToast("Audio file load or STT failed", "error");
                  }
                }
              : undefined
          }
          onReplayAudio={IS_DESKTOP ? handleReplaySTT : undefined}
          onClearSavedAudio={IS_DESKTOP ? handleClearSavedAudio : undefined}
          selectedAudioPath={selectedAudioPath}
          selectedAudioSizeMb={selectedAudioSizeMb}
          selectedAudioDuration={selectedAudioDuration}
          audioStatus={audioStatus}
        />
        <div style={{ padding: "0.75rem 1rem", background: "#0f172a", color: "#94a3b8", borderTop: "1px solid #1f2937" }}>
          Audio session state: <span style={{ color: "#e2e8f0" }}>{audioSession.state}</span>
        </div>
      </div>
      <div style={{ borderLeft: "1px solid #1f2937" }}>
        {webrtcAvailable ? (
          <WebRTCDemo />
        ) : (
          <div style={{ padding: "2rem", color: "#fbbf24", background: "#111827", height: "100%" }}>
            Voice agent unavailable — falling back to baseline briefing.
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
