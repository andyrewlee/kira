# kira (Granola‑style + WebRTC Voice Agent)
**Platforms:** Web (React) + Desktop (Electron) + Mobile (Expo)  
**Auth:** Clerk (Google + Calendar scopes)  
**DB/Realtime:** Convex  
**AI:** xAI (STT + TTS + Grok LLM)  
**Realtime voice Q&A:** **WebRTC voice agent example** (web/desktop first)

This plan keeps the **Granola parity** rules **and** adds a **WebRTC voice agent** so the user can *talk* to Kira about the meeting with low latency and interruptible audio.

---

## What you’re shipping (demo contract)
### Must-ship baseline (stable)
- Meeting transcript + rolling notes + summary
- **Brief Me (TTS mp3)** + **tap-to-interrupt** + voice answer (TTS)
- Desktop attribution: **Me/Them** via **dual-channel** capture (mic + system) *or* seed demo
- No audio stored (discard after STT)

### Realtime “wow” (timeboxed, kill-switch ready)
- **WebRTC voice agent** panel in Web/Electron:
  - user speaking → agent answers in voice
  - can be used for “talk to the meeting copilot” and optionally “interactive briefing”
- If WebRTC fails/slow: auto fallback to baseline TTS mode

---

## Phase 0 — Decisions + flags + repo skeleton (do first)
### 0.1 Transport and kill-switches (write these on the wall)
- Default briefing: `BRIEFING_MODE=tts`
- Default voice interrupt: `VOICE_INTERRUPT_MODE=tap`
- Enable WebRTC voice agent on desktop behind: `USE_WEBRTC_DESKTOP=1`
- **T‑1 Kill-switch rule:** If WebRTC isn’t stable, set:
  - `USE_WEBRTC_DESKTOP=0`
  - keep `BRIEFING_MODE=tts`
…and demo still ships.

### 0.2 Repo layout (single React UI reused by Electron)
```
/backend               # Node orchestrator + WebRTC relay routes + calendar proxy
/convex                # schema + functions
/apps/web              # single React UI (also Electron renderer)
/apps/desktop          # Electron main only
/apps/mobile           # Expo app
/packages/shared       # types + state machine + unit tests
```

### 0.3 Config flags (env-driven; tune without code edits)
**Backend**
- `USE_WEBRTC_DESKTOP=1|0`
- `BRIEFING_MODE=tts|webrtc` (default `tts`)
- `VOICE_INTERRUPT_MODE=tap|vad|webrtc` (default `tap`)
- `WEBRTC_CONNECT_TIMEOUT_MS=8000`
- `ICE_SERVERS=` JSON string (or use ENABLE_TURN below)
- `ENABLE_TURN=0|1` (default `0`)
- `DEBOUNCE_MS=3000`
- `DEBOUNCE_TURNS=3`
- `MAX_TURNS_CONTEXT=60`
- `VOICE=una`
- `AUDIO_RETENTION=discard|keep_local_for_retry` (default `discard`)
- `CAPTURE_SYSTEM_AUDIO=1|0` (desktop; default `1`)
- `ALLOW_WRITEBACK=0|1` (calendar)
- `ENABLE_DIARIZATION_MOBILE=0|1` (default `0`)
- `CORS_ALLOWLIST=...`

**Web/Mobile**
- API base, Convex URL, Clerk publishable key

### Done when
- You can flip all flags and the app still boots / demo mode works.

---

## Phase 1 — Shared types + audio session state machine (+ tests)
**Goal:** no regressions when wiring WebRTC vs TTS vs Expo.

### 1.1 Shared granola-style types
- `channel: "mic" | "system"`
- `speakerKey: "me" | "them" | "A" | "B" | ...`
- `speakerAliases` stored per meeting to rename (Them→Client)

### 1.2 Shared “audio session” state machine
States:
`idle → playingBriefing → interrupted → answering → resumePrompt → playingBriefing`

Events:
`PLAY_BRIEFING, STOP_PLAYBACK, INTERRUPT, QUESTION_READY, ANSWER_READY, RESUME, RESTART, CANCEL`

### 1.3 Write 2–3 unit tests now
This saves you later when Electron differs from Expo:
- `playingBriefing + INTERRUPT → interrupted`
- `interrupted + QUESTION_READY → answering`
- `answering + ANSWER_READY → resumePrompt`

---

## Phase 2 — Convex schema + seed demo meeting (your safety net)
**Goal:** deterministic demo even if audio breaks on stage.

**Status:** ✅ Schema + mutations/queries implemented (`convex/src`), including seed/reset and `getMeetingContext`.
**Current:** backend endpoints now call Convex first (seed/reset/context/ingest/notes/chat) with in-memory fallback.

### 2.1 Schema
**meetings**
- `userId, title, startedAt`
- `notes[]`, `summary`
- `speakerAliases` (default `{me:"Me", them:"Them"}`)
- `templateId` (“Recipe”), `privacy` (private by default)

**turns**
- `meetingId, channel, speakerKey, text, ts`
- `source: "human"|"system"|"llm"`

### 2.2 Must-have functions
- `createMeeting`
- `appendTurn`
- `renameSpeaker(meetingId, speakerKey, alias)`
- `setNotesAndSummary`
- `seedDemoMeeting()` (creates dual-channel turns + notes + summary)
- `resetMeeting(meetingId)` (one-click stage reset)

---

## Phase 3 — Auth + CORS + “no unauth path”
**Goal:** don’t leak xAI keys; don’t get surprised by 401s on stage.

**Status:** 🔸 Auth stub verifies JWT with `CLERK_JWT_PUBLIC_KEY` if set; CORS allowlist wired. Needs real Clerk validation + frontend bearer propagation.
**Current fallback:** dev bearer stored in `localStorage` when no public key; backend bypass allowed.

- Clerk JWT template `convex` + Convex auth config
- Backend: require Clerk bearer on **every** HTTP endpoint (`/stt`, `/tts`, `/chat`, `/ingest`, `/webrtc/*`, calendar)
- CORS allowlist early

**WebRTC signaling auth gotcha:** browsers can’t set WS headers.  
Do this:
- `POST /webrtc/sessions` (authed HTTP) returns `{ sessionId, wsUrl, wsToken }`
- Client connects to `wsUrl?token=wsToken`
- Server validates wsToken → allows signaling

This avoids putting the Clerk token in the WS URL.

---

## Phase 4 — Backend orchestration (LLM notes/chat + STT/TTS proxy + debounce)
**Goal:** stable meeting intelligence without calling LLM every turn.

### 4.1 Endpoints (baseline)
- `POST /meetings/:id/ingest` `{ channel, speakerKey, text, ts }`
  - append turn in Convex
  - schedule refresh (debounced)
- `POST /notes/refresh` `{ meetingId }`
  - read notes + tail turns (cap MAX_TURNS_CONTEXT)
  - call Grok LLM → strict JSON `{notes, summary}`
  - write to Convex
- `POST /chat` `{ meetingId, message }` → grounded answer
- `POST /stt` audio upload → transcribe → return text
- `POST /tts` `{text, voice, speed}` → return mp3

### 4.2 Debounce thresholds (config-driven)
- Refresh when:
  - `DEBOUNCE_TURNS` new turns OR `DEBOUNCE_MS` elapsed
- Context cap:
  - last `MAX_TURNS_CONTEXT` turns + existing notes + current summary

### 4.3 Audio retention policy (Granola-style)
- Server: never write audio to disk; discard in-memory buffers after STT completes
- Client: delete local audio chunk after STT success
- If STT fails:
  - keep local clip for retry only if `AUDIO_RETENTION=keep_local_for_retry`
  - log “audio kept” in debug panel and purge after success

### 4.4 Rate limits + logging
- Add simple rate limits for `/stt` and `/tts`
- Log per request: `meetingId`, `latency_ms`, ok/fail
- Keep last 50 events in memory: `/debug/events`

---

## Phase 5 — Web UI (+ WebRTC agent panel integration)
**Goal:** end-to-end demo without mic, then wire in the WebRTC voice panel once baseline UI is stable.

**Status:** WebRTC panel vendored, gated by `USE_WEBRTC_DESKTOP`, pushes meeting context via Convex client (fake fallback flag), basic fallback alert. Needs main meeting UI integration + toasts/state-machine hooks.
**Current fallback:** baseline panel uses in-memory backend if Convex fails; auto-seeds demo meeting on missing context. Next: document smoke checklist; disable dev bearer in prod env.
**TODO:** replace demo bearer with Clerk session token; swap in Convex client when deployment is set.

### 5.1 Baseline UI
- Meeting screen:
  - transcript grouped by `speakerAliases[speakerKey]`
  - rolling notes (Decisions/Actions/Open Questions)
  - summary
  - rename speaker affordance (Them→Client)
- Demo tools:
  - Seed / Reset / Brief Me
- **Baseline Brief Me:**
  - `/tts` mp3 + playback controls (0.5x–2x, skip ±10s)
  - tap interrupt + ask question (text) → `/chat` → `/tts` answer
- Debug: collapsible last-50-events panel

### 5.2 WebRTC Voice Agent (web/Electron) — xAI example integration
- [ ] Vendor `xai-voice-examples-main/examples/agent/webrtc/server` → `backend/webrtc` and prefix routes to `/webrtc/*`.
- [ ] Add auth + wsToken: `POST /webrtc/sessions` issues `{sessionId, wsUrl, wsToken}`; `WS /webrtc/signaling/:sessionId?token=...` validates token.
- [ ] Expose flags via env: `USE_WEBRTC_DESKTOP`, `BRIEFING_MODE`, `VOICE_INTERRUPT_MODE`, `WEBRTC_CONNECT_TIMEOUT_MS`, `ICE_SERVERS` JSON, `ENABLE_TURN`, `VOICE`, `INSTRUCTIONS`, `ALLOWED_ORIGINS`.
- [ ] Port client hook/UI from `examples/agent/webrtc/client` into `apps/web` behind flag; reuse Control/Stats/Debug, styled to match Kira.
- [ ] Inject meeting context over DataChannel on connect + debounced refresh (aliases, notes, summary, tail turns).
- [ ] Implement fallbacks: connect timeout/failed/disconnected → stop agent audio, toast, switch to baseline TTS.
- [ ] Smoke test: seed → brief → interrupt → ask → answer → resume (browser + Electron dev).

#### 5.2.1 Architecture (keep split!)
- **Meeting transcription & attribution:** dual-channel chunk → `/stt` → `/ingest` → Convex  
- **Voice agent conversation:** WebRTC client ↔ your WebRTC relay server ↔ xAI realtime WS  
WebRTC is **not** used for meeting attribution; it’s for **interactive Q&A + interruptible voice replies**.

#### 5.2.2 Backend: mount the example WebRTC relay under `/webrtc/*`
Reuse `examples/agent/webrtc/server` code, but:
- Prefix routes:
  - `POST /webrtc/sessions` (create session)
  - `WS /webrtc/signaling/:sessionId` (offer/answer/ICE)
  - `GET /webrtc/sessions/:id/stats` (optional)
- Add auth middleware on `POST /webrtc/sessions`
- Add `wsToken` for signaling auth (see Phase 3)
- Add ICE config:
  - `ICE_SERVERS` env or `ENABLE_TURN=0/1` (default STUN-only)
- Add connect timeout:
  - if not connected in `WEBRTC_CONNECT_TIMEOUT_MS` → fail + fallback

#### 5.2.3 Client: add “Voice Agent” panel in the Meeting screen (behind flag)
In `/apps/web`, embed the example client logic as a component:

**Buttons**
- Connect / Disconnect
- “Ask about this meeting” (voice)
- (Optional) “Read the briefing (interactive)” (voice)

**Connection flow**
1) `POST /webrtc/sessions` → get `{ sessionId, wsUrl, wsToken }`
2) Open signaling WS `wsUrl?token=wsToken`
3) Establish RTCPeerConnection + DataChannel
4) Start mic capture with:
   - `echoCancellation: true`
   - `noiseSuppression: true`
   - `autoGainControl: true`
5) When connected, show agent transcript + audio output

#### 5.2.4 Inject meeting context so the agent answers “about the meeting”
Do this on connect (and periodically, debounced):
- Pull from Convex:
  - `speakerAliases`
  - current `notes`
  - current `summary`
  - tail transcript (last 40–60 turns)
- Send to the agent as a **context message** over the DataChannel:
  - `conversation.item.create` with `role: "system"` (or `"user"` if system not supported)
  - content: “Meeting Context (use only this): …”
- Then allow the user to speak questions normally.

Keep context update throttled (e.g. every 10s or when summary changes) to avoid spam.

#### 5.2.5 “Brief Me” modes (TTS baseline + WebRTC optional)
- Always keep baseline: `/tts` mp3
- If `BRIEFING_MODE=webrtc` and WebRTC connected:
  - send message: “Read this meeting briefing out loud: <summary>”
  - let agent speak it
  - **interrupt** by user speech is naturally supported; on `speech_started` event:
    - stop playback immediately (clear audio queue)
    - switch state machine to `interrupted`

#### 5.2.6 Health/fallback rules (must implement)
Auto fallback to TTS if:
- WebRTC connect takes > `WEBRTC_CONNECT_TIMEOUT_MS`
- `connectionState` becomes `failed` or `disconnected` for > 2s
- relay reports repeated audio send/receive errors

When falling back:
- stop any agent audio
- show a toast: “Voice agent unavailable — using standard briefing”
- log to debug panel

#### 5.2.7 Debug + stats
Surface:
- WebRTC connection state
- bitrate/jitter/packet loss (from example stats)
- last 50 backend events (already in Phase 5)

---

## Phase 6 — Electron wrapper (no duplicated UI)
**Goal:** avoid “white screen” at the end.

- Dev: load web dev server URL
- Prod: load `file://.../dist/index.html` (test once early)
- Electron main is a loader + platform hooks only

---

## Phase 7 — Desktop meeting capture: dual-channel Me/Them (Granola parity)
**Goal:** match Granola: no diarization, just 2 channels.

### 8.1 Capture strategy (hackathon feasible)
- Mic: `getUserMedia({audio:true})` → chunks → `/stt` → ingest `channel:"mic", speakerKey:"me"`
- System: `getDisplayMedia({audio:true})` → chunks → `/stt` → ingest `channel:"system", speakerKey:"them"`

### 8.2 Permission UX
First-run modal:
- “We capture mic and optionally system audio. System capture is optional.”
Checkbox:
- “Disable system audio capture” → sets `CAPTURE_SYSTEM_AUDIO=0` in UI prefs

### 8.3 System capture fallback
Detect when `getDisplayMedia` returns no audio track:
- auto switch to mic-only
- keep UI consistent (still show Me/Them, but Them will be quiet)
- log event

---

## Phase 8 — Mobile (Expo): mic-only + Speaker A/B (Granola mobile parity)
- Mic chunks → `/stt` → `/ingest` with `channel:"mic"`, `speakerKey:"A"|"B"|...`
- Manual speaker toggle
- Brief Me: `/tts` playback + tap interrupt
- Optional diarization behind `ENABLE_DIARIZATION_MOBILE=1` (only if time)

---

## Phase 9 — Calendar + Recipes + cross‑meeting chat (only after core is stable)
- Calendar read: today’s events
- Optional writeback if `ALLOW_WRITEBACK=1`
- Recipes/templates in Convex; selected per meeting
- Cross‑meeting chat:
  - `scope=today` uses summaries + tail transcripts (cap aggressively)

---

## Smoke test (do this before packaging)
Script a deterministic test using seed data:
1) Seed meeting
2) Play briefing
3) Interrupt
4) Ask question
5) Answer spoken
6) Resume

Run it on:
- browser
- Electron (dev + prod build)
- phone (Expo dev build)

---

## If you’re starting right now (fastest “wow” order)
1) Phase 1–5 (shared state machine + Convex + backend + web UI + WebRTC panel + seed demo)  
2) Phase 6 (Electron wrapper prod path)  
3) Phase 7 (dual-channel capture)  
4) Phase 8 (mobile)  
5) Phase 9 (calendar/recipes, only if time)

Ship baseline first; WebRTC is additive and safely gated behind flags.
