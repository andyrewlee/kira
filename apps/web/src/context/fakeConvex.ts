// Temporary stub to provide meeting context until Convex wiring is done.
// Replace with real Convex queries/mutations.

export interface MeetingContext {
  speakerAliases: Record<string, string>;
  notes: string[];
  summary: string;
  turns: { speakerKey: string; text: string }[];
}

export async function fetchMeetingContext(meetingId: string): Promise<MeetingContext> {
  // TODO: replace with Convex call
  return {
    speakerAliases: { me: "Me", them: "Them" },
    notes: ["Decisions: Proceed with POC", "Actions: Send follow-up deck"],
    summary: "Quick demo summary placeholder.",
    turns: [
      { speakerKey: "me", text: "Hey, can you brief me on the meeting?" },
      { speakerKey: "them", text: "We agreed to move forward with a small POC." },
    ],
  };
}
