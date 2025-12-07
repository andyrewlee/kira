export interface MeetingContextPayload {
  speakerAliases: Record<string, string>;
  summary: string;
  notes: string[];
  turns: { speakerKey: string; text: string }[];
}

export function renderContextText(ctx: MeetingContextPayload): string {
  const turnsText = ctx.turns.map((t) => `${ctx.speakerAliases[t.speakerKey] || t.speakerKey}: ${t.text}`).join("\n");
  const notesText = ctx.notes.join("\n");
  return `Meeting Context\nAliases: ${JSON.stringify(ctx.speakerAliases)}\nSummary: ${ctx.summary}\nNotes:\n${notesText}\nRecent turns:\n${turnsText}`;
}
