# Desktop (Electron)

Electron wrapper that reuses the web UI. In dev it opens the Vite dev server; in prod it loads the built `apps/web/dist/index.html`.

## Commands
- `npm run build -w @kira/desktop` – bundle `src/main.ts` to `dist/main.js`
- `npm run dev:desktop` – build once then launch Electron pointed at the Vite dev server (`http://localhost:5173` by default)
- `npm run dev:desktop:full` – run Vite web dev + Electron together
- `npm run desktop:prod` – build web + desktop, then launch Electron against the local file build
- `npm run desktop:build` – build web + desktop artifacts only (no launch)
- `npm run start -w @kira/desktop` – launch Electron loading the local web build (`file://.../apps/web/dist/index.html`); run `npm run build -w @kira/web` first.
- `npm run pack -w @kira/desktop` – electron-builder (unpacked dir)
- `npm run dist -w @kira/desktop` – electron-builder installers (dmg/nsis/AppImage)

Environment knobs:
- `ELECTRON_DEV_URL` (or `VITE_DEV_SERVER_URL`) to override the dev server URL
- `NODE_ENV=production` forces file:// load even if a dev URL is set
- Renderer receives `desktop=1` query param so the web app can enable desktop-only behavior (e.g., `USE_WEBRTC_DESKTOP` defaults).
- Single-instance lock is enabled; second launches focus the existing window.
- External navigations/windows are blocked unless from the dev server origin; other links open in the system browser.
- Menu adds Reload (`Cmd/Ctrl+R`), Force Reload, and Toggle DevTools (`Cmd/Ctrl+Shift+I`), plus Quit.
- Preload exposes `window.kiraDesktop.isDesktop`, `getVersion()`, and `openLogs()` (opens Electron userData dir).
- Desktop helpers exposed to the web app:
  - `selectAudioFile()` → path
  - `loadAudioFile()` → `{ path, base64, ext, size, durationSec }`
  - `loadAudioByPath(path)` → same shape, without re-opening a picker
  - `checkFile(path)` → boolean (used to detect missing saved audio)
