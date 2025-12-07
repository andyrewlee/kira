import { useState } from "react";
import { AudioSessionState, INITIAL_AUDIO_SESSION_STATE, transition } from "@kira/shared";

export function useAudioSessionState() {
  const [state, setState] = useState<AudioSessionState>(INITIAL_AUDIO_SESSION_STATE);
  function send(event: { type: any }) {
    const { state: next } = transition(state, event, { lastUpdated: Date.now() });
    setState(next);
  }
  return { state, send };
}
