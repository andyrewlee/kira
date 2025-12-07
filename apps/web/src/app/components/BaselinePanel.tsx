import React from "react";

interface Props {
  onSeed?: () => void;
  onReset?: () => void;
  onBrief?: () => void;
  onAddTurn?: () => void;
  transcript?: string[];
  notes?: string[];
  summary?: string;
}

export const BaselinePanel: React.FC<Props> = ({ onSeed, onReset, onBrief, onAddTurn, transcript = [], notes = [], summary = "" }) => {
  return (
    <div style={{ padding: "1rem", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh" }}>
      <h1 style={{ margin: 0, fontSize: "20px" }}>Kira Meeting</h1>
      <p style={{ color: "#94a3b8", marginTop: "4px" }}>Transcript, notes, and briefing controls</p>

      <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0", flexWrap: "wrap" }}>
        <button onClick={onSeed} style={buttonStyle}>Seed Demo</button>
        <button onClick={onReset} style={buttonStyle}>Reset</button>
        <button onClick={onBrief} style={primaryButtonStyle}>Brief Me</button>
        <button onClick={onAddTurn} style={buttonStyle}>Add demo turn</button>
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
