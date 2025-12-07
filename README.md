# Kira voice demo (web + backend)

## Quick start
1) Install deps
```bash
npm install
```
2) Set env
- copy `.env.example` to `.env`
- set `XAI_API_KEY` for TTS/WebRTC
- set `CLERK_JWT_PUBLIC_KEY` (or leave empty for dev bypass)
- optional: set `VITE_API_BASE_URL` (default http://localhost:4000)

3) Run backend + web
```bash
npm run dev:backend   # port 4000
npm run dev:web       # vite (5173, auto-shifts if busy)
```
Or run both: `npm run dev`.

## Features (current)
- Web baseline panel: seed/reset demo meeting, add demo turn, Brief Me (calls backend /tts), shows transcript/notes/summary from in-memory backend (auto-seeds if missing).
- WebRTC panel: xAI WebRTC example embedded, gated by `USE_WEBRTC_DESKTOP`; sends meeting context over DataChannel.
- Backend: in-memory meetings (seed/reset/ingest/context), TTS proxy to xAI, WebRTC relay mounted at `/webrtc/*`, auth stub with optional Clerk JWT verify.

## Pending
- Real Convex client (needs `npx convex dev` / CONVEX_DEPLOYMENT) and swap in for in-memory store.
- Real Clerk tokens from the web app (replace `VITE_DEMO_BEARER` / localStorage override).
- STT/Chat/Notes refresh endpoints to call Grok; state-machine/toast polish for WebRTC fallback.

## Manual smoke (no scripts)
1) Start backend (`npm run dev:backend`) and web (`npm run dev:web`).
2) In the web baseline panel: Seed demo → Brief Me → Record STT → Refresh notes → Ask “what did we decide?”.
3) Verify transcript/notes/summary update; WebRTC panel connects (if enabled) and shows context.
