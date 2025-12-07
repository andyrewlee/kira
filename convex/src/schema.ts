// Convex schema placeholder (Phase 2)
// Define meetings and turns; real Convex schema should replace this stub.

export type Meeting = {
  id: string;
  userId: string;
  title: string;
  startedAt: string;
  notes: string[];
  summary: string;
  speakerAliases: Record<string, string>; // e.g., { me: "Me", them: "Them" }
  templateId?: string;
  privacy?: "private" | "shared";
};

export type TurnSource = "human" | "system" | "llm";

export type Turn = {
  id: string;
  meetingId: string;
  channel: "mic" | "system";
  speakerKey: string;
  text: string;
  ts: number;
  source: TurnSource;
};

// TODO: replace with Convex schema builder when wiring Convex.
