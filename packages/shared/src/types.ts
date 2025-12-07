export type Channel = "mic" | "system";
export type SpeakerKey = "me" | "them" | "A" | "B" | string;

export interface SpeakerAliases {
  [speakerKey: string]: string;
}

export type AudioSessionState =
  | "idle"
  | "playingBriefing"
  | "interrupted"
  | "answering"
  | "resumePrompt";

export type AudioSessionEventType =
  | "PLAY_BRIEFING"
  | "STOP_PLAYBACK"
  | "INTERRUPT"
  | "QUESTION_READY"
  | "ANSWER_READY"
  | "RESUME"
  | "RESTART"
  | "CANCEL";

export interface AudioSessionEvent {
  type: AudioSessionEventType;
}

export interface AudioSessionContext {
  lastUpdated: number;
}
