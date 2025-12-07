import { strict as assert } from "assert";
import { test } from "vitest";
import { INITIAL_AUDIO_SESSION_STATE, transition } from "../src/audioSessionMachine";

test("playingBriefing + INTERRUPT -> interrupted", () => {
  const { state: s1 } = transition(INITIAL_AUDIO_SESSION_STATE, { type: "PLAY_BRIEFING" });
  const { state: s2 } = transition(s1, { type: "INTERRUPT" });
  assert.equal(s2, "interrupted");
});

test("interrupted + QUESTION_READY -> answering", () => {
  const { state: s1 } = transition("interrupted", { type: "QUESTION_READY" });
  assert.equal(s1, "answering");
});

test("answering + ANSWER_READY -> resumePrompt", () => {
  const { state: s1 } = transition("answering", { type: "ANSWER_READY" });
  assert.equal(s1, "resumePrompt");
});
