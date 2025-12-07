export interface MeetingContextPayload {
  speakerAliases: Record<string, string>;
  summary: string;
  notes: string[];
  turns: { speakerKey: string; text: string }[];
}
