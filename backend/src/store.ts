import { randomUUID } from "crypto";

type Meeting = {
  id: string;
  userId: string;
  title: string;
  startedAt: number;
  notes: string[];
  summary: string;
  speakerAliases: Record<string, string>;
  templateId?: string;
  privacy?: "private" | "shared";
};

type Turn = {
  id: string;
  meetingId: string;
  channel: "mic" | "system";
  speakerKey: string;
  text: string;
  ts: number;
  source: "human" | "system" | "llm";
};

class InMemoryStore {
  meetings = new Map<string, Meeting>();
  turns = new Map<string, Turn[]>();

  seedDemo(userId: string = "demo-user"): string {
    const id = "demo-meeting";
    const meeting: Meeting = {
      id,
      userId,
      title: "Demo Meeting",
      startedAt: Date.now(),
      notes: ["Decisions: Proceed with POC", "Actions: Send follow-up deck"],
      summary: "We agreed to move forward with a small POC and follow up with a deck.",
      speakerAliases: { me: "Me", them: "Them" },
      templateId: undefined,
      privacy: "private",
    };
    const demoTurns: Turn[] = [
      { id: randomUUID(), meetingId: id, channel: "mic", speakerKey: "me", text: "Hey, can you brief me on the meeting?", ts: Date.now() - 60000, source: "human" },
      { id: randomUUID(), meetingId: id, channel: "system", speakerKey: "them", text: "We agreed to move forward with a small POC.", ts: Date.now() - 55000, source: "human" },
      { id: randomUUID(), meetingId: id, channel: "mic", speakerKey: "me", text: "Any follow ups?", ts: Date.now() - 50000, source: "human" },
      { id: randomUUID(), meetingId: id, channel: "system", speakerKey: "them", text: "Send the deck by tomorrow.", ts: Date.now() - 45000, source: "human" },
    ];
    this.meetings.set(id, meeting);
    this.turns.set(id, demoTurns);
    return id;
  }

  resetMeeting(id: string): void {
    const meeting = this.meetings.get(id);
    if (!meeting) return;
    meeting.notes = [];
    meeting.summary = "";
    this.turns.set(id, []);
  }

  setNotesAndSummary(id: string, notes: string[], summary: string) {
    const meeting = this.meetings.get(id);
    if (!meeting) return;
    meeting.notes = notes;
    meeting.summary = summary;
  }

  getMeeting(id: string) {
    return this.meetings.get(id) || null;
  }

  appendTurn(turn: Omit<Turn, "id">): string {
    const id = randomUUID();
    const existing = this.turns.get(turn.meetingId) || [];
    const newTurn: Turn = { ...turn, id };
    this.turns.set(turn.meetingId, [...existing, newTurn]);
    return id;
  }

  renameSpeaker(meetingId: string, speakerKey: string, alias: string) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) return;
    meeting.speakerAliases = { ...meeting.speakerAliases, [speakerKey]: alias };
  }

  getContext(meetingId: string, tail: number = 60) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) return null;
    const turns = (this.turns.get(meetingId) || []).slice(-tail);
    return {
      speakerAliases: meeting.speakerAliases,
      summary: meeting.summary,
      notes: meeting.notes,
      turns: turns.map((t) => ({ speakerKey: t.speakerKey, text: t.text })),
    };
  }
}

export const store = new InMemoryStore();
