# Clickable Prototype — Pickup Screen

- Goal: A no-backend demo that looks and feels like the real pickup board. Two columns (Preparing, Finished), live updates driven by on-page controls, optional voice cue, all in-memory.
- Constraints: No webhooks, no SSE, no OpenAI. No persistence.

## Tech (Prototype)
- Next.js App Router
- React state only (no localStorage)
- Optional: a tiny event bus with `setInterval` heartbeats for the feel of streaming
 - Optional: Web Speech API (`speechSynthesis`) for local announce voice

## Page
- `app/pickup/page.tsx`

## UI Scope
- Header with: privacy selector (Names / Order numbers / Masked), volume slider (0–1), offline banner placeholder
- Two columns: Preparing and Finished; cards show Display Name (masked per privacy) and line items summary
- Control tray (top-right or footer):
  - “Add Preparing” button (opens a small form: name, items)
  - “Finish Selected” button (moves a selected card to Finished)
  - “Clear Finished (TTL)” dropdown (e.g., 5/10/15 minutes) that auto-clears by timer
  - “Simulate Offline/Online” toggle to show the banner
- Optional: announce toggle — plays an embedded mp3 beep when an order moves to Finished
 - Theme toggle: Dark/Light to mimic kiosk themes
 - Fullscreen: button to enter/exit fullscreen (kiosk feel)
 - Clock: small realtime clock in header with timezone dropdown (visual only)

## State Model
- `orders: Array<{ id, locationId, displayName, lineItems: { name, quantity }[], status: 'Preparing'|'Finished', updatedAt }>`
- `privacy: 'name'|'order'|'masked'`
- `volume: number` (0–1)
- `ttlMinutes: number`
- `offline: boolean`
- `selectedOrderId?: string`
 - `simulateLatencyMs: number` (0–1500) to delay updates and show spinners

## Interactions
- Add Preparing → create order with uuid, push into state, sorted by updatedAt
- Select a card (click) → highlight; Finish Selected moves status and updates updatedAt
- TTL sweeper runs every 30s and removes Finished older than ttlMinutes
- Privacy changes update display text: order number = `id.slice(-6)`, masked = first letter + •••
- Volume controls HTML5 Audio for the announce beep
 - Optional “Simulate stream”: heartbeat tick updates an on-screen indicator every 15s
 - “Seed demo”: populate 6–10 orders across both columns for instant realism

## Acceptance (Prototype)
- Stakeholder can add/finish orders and observe real-time updates
- Privacy and TTL behaviors are visible
- Optional “announce” cue plays when finishing an order
- No external calls; refresh resets everything
 - Visual scale matches kiosk: default 1920×1080 layout with 5–7 items per column visible without scrolling

## Dev Notes
- Keep the order creation dialog minimal: (Name, Items CSV like `2x Latte, 1x Muffin` → parse to lineItems)
- All timers (`setInterval`) are cleared on unmount
 - For “announce” without network, use `speechSynthesis.speak(new SpeechSynthesisUtterance(text))` with the volume slider
