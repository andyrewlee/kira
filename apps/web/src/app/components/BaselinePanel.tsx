import React from "react";

interface Props {
  onSeed?: () => void;
  onReset?: () => void;
  onBrief?: () => void;
  onAddTurn?: () => void;
  onChat?: () => void;
  onRefreshNotes?: () => void;
  onSTT?: () => void;
  onInterrupt?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  onSpeedChange?: (speed: number) => void;
  transcript?: string[];
  notes?: string[];
  summary?: string;
  lastSTT?: string;
  isRecording?: boolean;
  speakerMe?: string;
  speakerThem?: string;
  onRenameSpeaker?: (speakerKey: string, alias: string) => void;
  events?: any[];
  onRefreshEvents?: () => void;
  voiceInterruptMode?: string;
  playbackSpeed?: number;
}

export const BaselinePanel: React.FC<Props> = ({ onSeed, onReset, onBrief, onAddTurn, onChat, onRefreshNotes, onSTT, onInterrupt, onSkipBack, onSkipForward, onSpeedChange, transcript = [], notes = [], summary = "", lastSTT = "", isRecording = false, speakerMe = "Me", speakerThem = "Them", onRenameSpeaker, events = [], onRefreshEvents, voiceInterruptMode = "tap", playbackSpeed = 1 }) => {
  return (
    <div style={{ padding: "1rem", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh" }}>
      <h1 style={{ margin: 0, fontSize: "20px" }}>Kira Meeting</h1>
      <p style={{ color: "#94a3b8", marginTop: "4px" }}>Transcript, notes, and briefing controls</p>

      <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0", flexWrap: "wrap" }}>
        <button onClick={onSeed} style={buttonStyle}>Seed Demo</button>
        <button onClick={onReset} style={buttonStyle}>Reset</button>
        <button onClick={onBrief} style={primaryButtonStyle}>Brief Me</button>
        <button onClick={onAddTurn} style={buttonStyle}>Add demo turn</button>
        <button onClick={onChat} style={buttonStyle}>Ask: what did we decide?</button>
        <button onClick={onRefreshNotes} style={buttonStyle}>Refresh notes (stub)</button>
        <button onClick={onSTT} style={{ ...buttonStyle, background: isRecording ? "#b91c1c" : buttonStyle.background }}>{isRecording ? "Recording..." : "Record STT"}</button>
        {voiceInterruptMode === "tap" && <button onClick={onInterrupt} style={buttonStyle}>Tap to interrupt</button>}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>Playback</span>
          <button onClick={onSkipBack} style={smallButtonStyle}>«10s</button>
          <button onClick={onSkipForward} style={smallButtonStyle}>+10s»</button>
          <select value={playbackSpeed} onChange={(e) => onSpeedChange?.(Number(e.target.value))} style={{ ...smallButtonStyle, background: "#111827" }}>
            {[0.75, 1, 1.25, 1.5, 2].map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitle}>Speakers</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <label style={labelStyle}>Me: <input value={speakerMe} onChange={(e) => onRenameSpeaker?.("me", e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Them: <input value={speakerThem} onChange={(e) => onRenameSpeaker?.("them", e.target.value)} style={inputStyle} /></label>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitle}>Transcript</h2>
        <div style={{ maxHeight: 240, overflowY: "auto", color: "#cbd5e1", fontSize: "14px" }}>
          {transcript.length === 0 ? <p style={{ color: "#64748b" }}>No transcript yet.</p> : transcript.map((line, i) => <p key={i} style={{ margin: "4px 0" }}>{line}</p>)}
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitle}>Notes</h2>
        <ul style={{ color: "#cbd5e1", fontSize: "14px", paddingLeft: "1.2rem", margin: 0 }}>
          {notes.length === 0 ? <li style={{ color: "#64748b" }}>No notes yet.</li> : notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitle}>Summary</h2>
        <p style={{ color: "#cbd5e1", fontSize: "14px" }}>{summary || "No summary yet."}</p>
      </div>

      {lastSTT ? (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Last STT</h2>
          <p style={{ color: "#cbd5e1", fontSize: "14px" }}>{lastSTT}</p>
        </div>
      ) : null}

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={sectionTitle}>Debug events (last 50)</h2>
          <button onClick={onRefreshEvents} style={smallButtonStyle}>Refresh</button>
        </div>
        <div style={{ maxHeight: 180, overflowY: "auto", fontSize: "12px", color: "#cbd5e1" }}>
          {events.length === 0 ? <p style={{ color: "#64748b" }}>No events yet.</p> :
            events.slice().reverse().map((e, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ color: "#94a3b8" }}>{e.ts}</div>
                <div><strong>{e.type}</strong> {e.meetingId ? `(${e.meetingId})` : ""}</div>
                {e.details ? <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(e.details)}</pre> : null}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: "#1e293b",
  borderRadius: "12px",
  padding: "12px 14px",
  marginBottom: "12px",
  border: "1px solid #0f172a",
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  marginBottom: 6,
  fontSize: "15px",
};

const labelStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "13px",
  display: "flex",
  gap: "6px",
  alignItems: "center",
};

const inputStyle: React.CSSProperties = {
  background: "#0b1220",
  color: "#e2e8f0",
  border: "1px solid #1f2937",
  borderRadius: "6px",
  padding: "6px 8px",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #1f2937",
  background: "#1f2937",
  color: "#e2e8f0",
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#2563eb",
  border: "1px solid #2563eb",
};

const smallButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: "6px 8px",
  fontSize: "12px",
};
