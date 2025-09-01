# Clickable Prototype — Phone Agent

- Goal: Simulate the voice agent flow in a browser-only UI with no telephony: transcripts, tool-call panels with mocked results, and simple branching. No Vapi, no Square, no network.
- Constraints: All state in React; resets on refresh.

## Tech (Prototype)
- Next.js App Router
- React components only; no backend
 - Optional: Web Speech API for TTS playback of Assistant messages; a mic button can be visual-only

## Page
- `app/phone-agent/page.tsx`

## UI Scope
- Call control header: “Start Call” / “End Call”, elapsed timer
- Transcript pane: alternating bubbles (Caller vs Assistant)
- Tool panel (mocked): buttons → `locations.search`, `locations.get`, `menu.get`, `reservations.create`
  - Each opens a small form for inputs (e.g., location name, category, party size/time)
  - Submitting appends an Assistant message with a canned summary and shows a JSON panel with the “tool result”
- Suggested replies: a few chips like “What are your hours?”, “Any pastries?”, “Book for 4 at 7pm” that add Caller messages
 - Latency simulator: random 400–1200ms delay with spinner before tool results/assistant reply
 - Tool-call history panel: list of tool name, args, and mock result size; clear button

## State Model
- `callActive: boolean`, `startedAt: number`
- `messages: Array<{ role: 'caller'|'assistant'|'tool', text: string, data?: any }>`
- `lastTool?: { name: string, args: any, result: any }`
 - `latencyMs: number` (range slider) to adjust simulated delay
 - `voiceEnabled: boolean` for Web Speech TTS of assistant replies

## Interactions
- Start Call → clears state and begins timer
- Clicking a suggested reply adds a Caller message and enables relevant tool buttons
- Submitting a tool form:
  - Adds a Tool message with fake JSON result
  - Adds an Assistant message summarizing (e.g., “We’re open 9–5 today at Midtown.”)
- End Call → freezes timer and disables inputs
 - If voice is enabled, assistant replies are spoken using `speechSynthesis`

## Mock Data
- Locations: two or three objects with name, phone, timezone, hours
- Menu: categories array with a few items and prices
- Reservation result: fake confirmation id
 - Transfer flow (visual-only): a “Transfer to human” button adds an assistant message and disables tool buttons

## Acceptance (Prototype)
- PM can click through Start → ask hours → see tool “result” JSON → get short Assistant reply
- Menu and Reservation flows work with visible inputs and fake outputs
- No network or persistence; refresh resets the prototype
 - The tool panel and history make it obvious what the agent “would have done” on the server

## Dev Notes
- Keep message rendering simple; one component with role-based styles
- Time formatting via `Intl.DateTimeFormat` is enough
