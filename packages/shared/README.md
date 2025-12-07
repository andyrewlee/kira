# @kira/shared

Shared types and the audio session state machine used by web, desktop, and mobile clients.

## State machine
States: `idle → playingBriefing → interrupted → answering → resumePrompt → playingBriefing`
Events: `PLAY_BRIEFING, STOP_PLAYBACK, INTERRUPT, QUESTION_READY, ANSWER_READY, RESUME, RESTART, CANCEL`

See `src/audioSessionMachine.ts` and `test/audioSessionMachine.test.ts`.
