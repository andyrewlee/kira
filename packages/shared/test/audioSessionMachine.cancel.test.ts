import { strict as assert } from "assert";
import { transition } from "../src/audioSessionMachine";

test("playingBriefing + STOP_PLAYBACK -> idle", () => {
  const { state } = transition("playingBriefing", { type: "STOP_PLAYBACK" });
  assert.equal(state, "idle");
});

test("interrupted + CANCEL -> idle", () => {
  const { state } = transition("interrupted", { type: "CANCEL" });
  assert.equal(state, "idle");
});

test("answering + RESTART -> idle", () => {
  const { state } = transition("answering", { type: "RESTART" });
  assert.equal(state, "idle");
});
