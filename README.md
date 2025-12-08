# Kira voice demo (web + backend + desktop)

## Quick start (dev)
1) Install deps  
```bash
npm install
```
2) Copy env + set keys  
- `cp .env.example .env`  
- set `XAI_API_KEY` for TTS/WebRTC  
- set Clerk: `VITE_CLERK_PUBLISHABLE_KEY` (web) and `CLERK_JWKS_URL` or `CLERK_JWT_PUBLIC_KEY` (backend/Convex)  
- optional: `VITE_API_BASE_URL` (default http://localhost:4000)

3) Run backend + web  
```bash
PORT=4000 DEV_MODE=1 DEV_BEARER=dev-token MOCK_XAI=1 npm run dev:backend
npm run dev:web   # Vite on 5173
```
Or both: `npm run dev`.

4) Desktop (dev):  
```bash
npm run dev:desktop   # waits for Vite; falls back to file:// build
```

## Production build
- Web: `npm run build -w @kira/web`
- Desktop bundle only: `npm run build -w @kira/desktop`
- Desktop installers (mac arm64 DMG unsigned): `npm run dist -w @kira/desktop` → `apps/desktop/dist_electron/Kira-0.0.1-arm64.dmg`

### Desktop signing (optional)
- Drop icons: `apps/desktop/build/icons/icon.icns` (mac), `icon.ico` (win), `256x256.png` (linux).
- Set signing envs when running `npm run dist -w @kira/desktop`:
  - mac: `CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `CSC_IDENTITY_AUTO_DISCOVERY=false`, `CSC_NAME="Developer ID Application: <Your Team>"`
  - win: `CSC_LINK` (pfx), `CSC_KEY_PASSWORD`
- Outputs remain under `apps/desktop/dist_electron/`.

## Tests
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Core unit tests: `npm run test:core`
- Integration (needs backend running as above):  
`RUN_INTEGRATION=1 TOKEN=dev-token API=http://localhost:4000 MOCK_XAI=1 npm run test -w @kira/tests`

## Features (current)
- Baseline panel: seed/reset demo, add demo turn, Brief Me (TTS mp3), tap interrupt, playback speed/skip, speaker rename, STT from loaded audio (desktop), debug events panel (auto-refresh on desktop).
- WebRTC panel: voice agent sample; sends meeting context; falls back to baseline TTS on failure; ICE/TURN configurable.
- Auth: Clerk tokens end-to-end; dev bearer allowed only when `DEV_MODE=1`/`VITE_DEV_MODE=1`.
- Desktop preload: `isDesktop`, `getVersion`, `openLogs`, `selectAudioFile`, `loadAudioFile`, `loadAudioByPath`, `checkFile`.

## Manual smoke
1) Seed demo → Brief Me → Record STT → Refresh notes → Ask “what did we decide?”  
2) Confirm transcript/notes/summary update.  
3) Desktop: load audio file, run STT, replay via “Re-run STT”; unplug file to see “missing” status.  
4) WebRTC panel: start; if it fails, baseline briefing auto-fallback and toast.
