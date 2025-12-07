import type { AudioSessionState, AudioSessionEvent, AudioSessionContext } from "./types";

export const INITIAL_AUDIO_SESSION_STATE: AudioSessionState = "idle";

// Transition table encoded in code for clarity
export function transition(
  state: AudioSessionState,
  event: AudioSessionEvent,
  ctx: AudioSessionContext = { lastUpdated: Date.now() }
): { state: AudioSessionState; context: AudioSessionContext } {
  const nextState = computeNextState(state, event.type);
  return { state: nextState, context: { ...ctx, lastUpdated: Date.now() } };
}

function computeNextState(state: AudioSessionState, eventType: AudioSessionEvent["type"]): AudioSessionState {
  switch (state) {
    case "idle": {
      if (eventType === "PLAY_BRIEFING") return "playingBriefing";
      if (eventType === "RESTART") return "idle";
      return state;
    }
    case "playingBriefing": {
      if (eventType === "INTERRUPT") return "interrupted";
      if (eventType === "STOP_PLAYBACK" || eventType === "CANCEL") return "idle";
      if (eventType === "RESTART") return "idle";
      return state;
    }
    case "interrupted": {
      if (eventType === "QUESTION_READY") return "answering";
      if (eventType === "STOP_PLAYBACK" || eventType === "CANCEL") return "idle";
      if (eventType === "RESTART") return "idle";
      return state;
    }
    case "answering": {
      if (eventType === "ANSWER_READY") return "resumePrompt";
      if (eventType === "INTERRUPT") return "interrupted";
      if (eventType === "CANCEL" || eventType === "STOP_PLAYBACK") return "idle";
      if (eventType === "RESTART") return "idle";
      return state;
    }
    case "resumePrompt": {
      if (eventType === "RESUME") return "playingBriefing";
      if (eventType === "RESTART") return "idle";
      if (eventType === "STOP_PLAYBACK" || eventType === "CANCEL") return "idle";
      return state;
    }
    default:
      return state;
  }
}

export function describeState(state: AudioSessionState): string {
  switch (state) {
    case "idle":
      return "Idle";
    case "playingBriefing":
      return "Playing briefing";
    case "interrupted":
      return "Interrupted (user speaking)";
    case "answering":
      return "Answering";
    case "resumePrompt":
      return "Waiting to resume briefing";
    default:
      return state;
  }
}
