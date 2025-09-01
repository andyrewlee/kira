# Clickable Prototype — Settings (Connect Square)

- Goal: Demonstrate the “Connect Square” experience without real OAuth. Show state transitions, success/error screens, and token status UI — all mocked in-memory.
- Constraints: No network, no cookies, no persistence.

## Repo Path Constraint
- Implement only in existing Next files under `app/dashboard/*`.
- Suggested paths: `app/dashboard/settings/page.tsx` and lightweight helpers in `app/dashboard/settings/*.(ts|tsx)`.
- Do not add files outside `app/dashboard/` or modify global config.

## Tech (Prototype)
- Next.js App Router
- React state only
 - Optional: small modal/stepper component for the connect flow

## Page
- `app/settings/page.tsx`

## UI Scope
- Status card: “Not Connected” | “Connected as Merchant XYZ” (mock)
- Primary button: “Connect Square” → simulates redirect + callback (animated stepper or staged panels)
- Secondary actions when “connected”: “Disconnect”, “Refresh Token” — both simulated
- Test call section: “List Locations” button renders a mocked JSON block to mimic a health check
 - Visual feedback: inline banners for success/error; spinner during “exchange” step
 - Token meter: progress bar/countdown until “expires at” (fake)

## State Model
- `connected: boolean`
- `merchant: { id: string, name: string } | null`
- `lastAction?: 'connect'|'disconnect'|'refresh'`
- `logs: Array<string>` (append short messages “Redirecting…”, “Received code…”, “Connected!”)
 - `expiresAt?: string` (fake ISO string ~7 days in future)
 - `error?: string`

## Interactions
- Connect → step through (1) Redirecting, (2) Returning with code, (3) Exchanging, (4) Connected — update state
- Disconnect → flips to Not Connected and appends a log
- Refresh Token → appends a log and updates a “token expires at” label (fake time +7 days)
- List Locations → shows static JSON (array of 3 fake locations)
 - “Simulate Error” toggle makes the next Connect attempt end with an error banner and logs message

## Acceptance (Prototype)
- Stakeholder can click Connect → sees staged flow → ends on Connected with merchant info
- Disconnect/Refresh update UI and logs accordingly
- No external calls; refresh resets the page
 - The staged flow mirrors production OAuth: state, redirect, callback, token exchange, connected

## Dev Notes
- Keep a single file page with small subcomponents for Status, Actions, Logs, and MockOutput
 - All timings can use setTimeout to feel realistic (e.g., 600–1200ms between steps)
