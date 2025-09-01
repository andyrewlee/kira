# Phone Agent (Vapi AI + Square)

- Status: Draft
 
## High-Level
- Vapi AI phone assistant (inbound/outbound) with tools that call our server to query Square for locations, menus, and reservations.
- Single integration: Vapi SDK + our tool endpoints; no v0 usage here.
- Owner: TBD
- Last updated: 2025-09-01

## Overview
Voice agent built on Vapi AI for inbound/outbound calls. Answers questions about store hours and menus, checks location details, and (optionally) places reservations using Square APIs. Uses tool calls from the agent to our server, which securely proxies to Square.

## Goals & Success Criteria
- Caller can ask for hours, address/directions, phone, and today’s menu by location.
- Agent can create/modify a reservation (if Square Bookings is enabled) or hand off to staff when not available.
- Latency: sub‑second perceived turn latency; barge‑in enabled.
- Logging: transcripts, tool calls, and outcomes recorded for QA.

## Vapi AI Integration
- SDK: `@vapi-ai/server-sdk` (TypeScript) or `vapi_server_sdk` (Python).
- Assistant creation: OpenAI LLM (e.g., `gpt-4o`) and a natural voice (11labs or Vapi voice). Configurable via env.
- Phone numbers: provision via Vapi (`POST https://api.vapi.ai/phone-number`) and attach assistant.
- Tools: define HTTP tool endpoints on our server (see Tools section). Vapi calls these when the model decides to take actions.

## Square Integrations (Tools)
- Locations (required):
  - List Locations: `GET /v2/locations` with `Square-Version: 2025-08-20`.
  - Retrieve Location: `GET /v2/locations/{location_id}`.
  - Use to answer hours (from our config if Square lacks hours), address, phone, timezone, open/closed.
- Catalog (menu):
  - `POST /v2/catalog/search-catalog-items` or `GET /v2/catalog/list`/`/objects` to fetch items by category or all visible items.
  - Normalize into categories → items with prices/variations.
- Bookings (reservations) (optional, if enabled for the merchant):
  - Check availability: `POST /v2/bookings/availability/search`.
  - Create booking: `POST /v2/bookings`.
  - Requires location, team member, service variation IDs (we may store mappings in settings).

## Tool Endpoints (Server)
- `POST /tools/locations.search` → input: `{ query?: string }` → output: list with `{ id, name, address, phone, timezone, open_now }`.
- `POST /tools/locations.get` → input: `{ id?: string, name?: string }` → output: normalized location detail.
- `POST /tools/menu.get` → input: `{ locationId?: string, category?: string }` → output: `{ categories: [{ name, items: [{ name, price, options? }] }] }`.
- `POST /tools/reservations.create` → input: `{ locationId, name, partySize, whenISO }` → output: `{ bookingId, status }`.
- All tools require server‑side Square token; never invoke Square from the client.

## Prompts & Guardrails
- System prompt (sketch):
  "You are a helpful voice assistant for our stores. Answer questions about hours, addresses, phone numbers, and menu items using the provided tools. If asked to make a reservation, use the reservations tool. Confirm back details and ask clarifying questions when needed. If a tool is unavailable or fails, apologize briefly and offer to send details via SMS or transfer. Keep answers brief and spoken naturally."
- First message: friendly greeting + ask how to help.
- Guardrails: never invent data; prefer tool results; keep PII minimal; read back only necessary details.

## Env & Config
- `VAPI_API_KEY` (required)
- `OPENAI_API_KEY` (if using OpenAI LLM via Vapi)
- `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`
- `SQUARE_VERSION=2025-08-20`
- Optional: mappings for location hours if Square lacks them (`config/location-hours.json`).

## Security & Compliance
- All Square calls from server; token stored server‑side only.
- Verify and rate‑limit tool endpoints; input validation and timeouts.
- Redact card data; never collect PCI over voice.
- Consent and recording disclosure per locale; store transcripts securely.

## Call Flows (Examples)
- Hours: user asks “When are you open at Midtown?” → tool `locations.get(name:"Midtown")` → compute `open_now` and today’s hours → speak concise answer.
- Menu: “What pastries do you have?” → `menu.get(category:"Pastries")` → summarize top items and offer SMS menu link.
- Reservation: “Table for 4 at 7pm” → confirm location/date/party size → `reservations.create` → read back confirmation #.

## Observability
- Store call logs: caller, start/end, tool calls, errors, disposition.
- Metrics: containment, transfers, average handle time, tool success rate.

## Repo Path Constraint
- Implement in existing Next files under `app/dashboard/*` only.
- Suggested paths: `app/dashboard/phone-agent/page.tsx` and the webhook route under `app/dashboard/phone-agent/api/vapi/webhook/route.ts`; keep helpers in `app/dashboard/phone-agent/*.(ts|tsx)`.
- Avoid files outside `app/dashboard/` unless explicitly approved.

## TODOs

### Phase 0 — Discovery
- Confirm locations list and naming; identify which locations accept reservations.
- Decide menu source (Catalog search vs curated categories) and any exclusions.
- Define SMS fallback (optional) for sending links to maps/menu.

### Phase 1 — Vapi Setup
- Create assistant via SDK with system prompt, first message, model, and voice.
- Provision a phone number and attach the assistant.
- Enable barge‑in and tune latency parameters as available.

### Phase 2 — Tools API
- Implement server endpoints for locations, menu, and reservations with Square headers/auth.
- Normalize responses; compute `open_now` using timezone and configured hours JSON if needed.
- Add strict input validation, timeouts, retries, and caching.

### Phase 3 — Wiring Tools to Vapi
- Register tool schemas with Vapi so the model can call them.
- Handle tool webhooks/callbacks and return normalized JSON for the assistant to speak.

### Phase 4 — QA & Policies
- Test accents/locales; ambiguous location names; reservation edge cases.
- Add privacy/consent script; verify no sensitive data in logs.
- Add monitoring dashboards for error rates and tool latency.

### Phase 5 — Rollout
- Limited pilot on one location; measure containment and CSAT.
- Iterate prompts and tool outputs; add new intents as needed.

## Acceptance Criteria (v1)
- Inbound call answers with configured greeting and natural voice.
- Agent accurately reports hours/address/phone for any location via tools.
- Agent reads menu categories/items on request from Square Catalog.
- If reservations enabled, agent books a slot and confirms details, or gracefully declines if unavailable.
- All Square access is server‑side; no tokens exposed; logs show tool calls and results.

## Open Questions
- Which voice/provider do you prefer in Vapi (11labs, vapi, or other)?
- Do you want SMS fallbacks (send menu/map links) and via which provider?
- What reservation policy should the agent follow (max party size, cutoff times, deposit)?

## Implementation Blueprint (Next.js 14)

What You Are Building
- Calls arrive on a Vapi number; Vapi handles ASR/LLM/TTS.
- When the model decides to act, Vapi POSTs tool calls to your Next.js route; your server talks to Square and replies with `{"results":[{"toolCallId","result"}]}`.
- The assistant never accesses the internet directly; only your server makes network calls.
- You can provision numbers and place outbound calls via Vapi’s API.

Prereqs
- Next.js 14 App Router using Route Handlers for webhooks and JSON responses.
- Node runtime for webhook routes: `export const runtime = 'nodejs'`.
- Square developer account with token and pinned `Square-Version`.
- Vapi account and API key; optional free US test number.

Install Dependencies
- `npm i luxon zod`
- `npm i -D tsx`

Environment (.env.local)
- `VAPI_API_KEY=YOUR_VAPI_KEY`
- `VAPI_WEBHOOK_SECRET=super_secret` (verifies `X-Vapi-Signature`)
- `SQUARE_ACCESS_TOKEN=YOUR_SQUARE_TOKEN`
- `SQUARE_ENV=sandbox` (or `production`)
- `SQUARE_VERSION=2025-08-20`
- `SQUARE_DEFAULT_TEAM_MEMBER_ID=TM123`
- `SQUARE_DEFAULT_SERVICE_VARIATION_ID=SV123`
- `SQUARE_DEFAULT_SERVICE_VARIATION_VERSION=1`
- `SQUARE_DEFAULT_DURATION_MINUTES=60`

File Layout
- `app/api/vapi/webhook/route.ts`
- `lib/square.ts`
- `scripts/createAssistant.ts`
- `scripts/createNumber.ts`
- `scripts/makeCall.ts`

Square Client (`lib/square.ts`)
```ts
import { DateTime } from "luxon"

const BASE = process.env.SQUARE_ENV === "production"
  ? "https://connect.squareup.com"
  : "https://connect.squareupsandbox.com"

const COMMON = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  "Square-Version": process.env.SQUARE_VERSION || "2025-08-20",
} as const

async function sq(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...COMMON, ...(init?.headers || {}) },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Square ${path} ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function listLocations() { const j = await sq(`/v2/locations`); return j.locations || [] }
export async function getLocation(id: string) { const j = await sq(`/v2/locations/${id}`); return j.location }

export async function searchCatalogItems(params: { textFilter?: string; categoryIds?: string[]; enabledLocationIds?: string[] }) {
  const body = { text_filter: params.textFilter, category_ids: params.categoryIds, enabled_location_ids: params.enabledLocationIds }
  const j = await sq(`/v2/catalog/search-catalog-items`, { method: "POST", body: JSON.stringify(body) })
  return j.items ?? []
}

export async function findCategoryIdsByName(name: string) {
  const words = name.split(/\s+/).filter(Boolean)
  const body = { object_types: ["CATEGORY"], query: { text_query: { keywords: words } }, limit: 10 }
  const j = await sq(`/v2/catalog/search`, { method: "POST", body: JSON.stringify(body) })
  const objs = j.objects || []
  return objs.filter((o: any) => o.type === "CATEGORY").map((o: any) => o.id as string)
}

export async function createBooking(booking: any) {
  const idempotency_key = crypto.randomUUID()
  const body = { idempotency_key, booking }
  return sq(`/v2/bookings`, { method: "POST", body: JSON.stringify(body) })
}

export function normalizeLocation(loc: any) {
  if (!loc) return null
  const tz = loc.timezone as string | undefined
  const now = tz ? DateTime.now().setZone(tz) : DateTime.now()
  const { open, todayHours } = isOpenNow(loc.business_hours, now)
  return { id: loc.id, name: loc.name, address: formatAddress(loc.address), phone: loc.phone_number || null, timezone: tz || null, open_now: open, today_hours: todayHours }
}

function formatAddress(a: any){ if (!a) return null; return [a.address_line_1, a.locality, a.administrative_district_level_1, a.postal_code].filter(Boolean).join(", ") || null }
function isOpenNow(bh: any, now: DateTime){ if (!bh?.periods?.length) return { open: null, todayHours: null }; const code=["MON","TUE","WED","THU","FRI","SAT","SUN"][now.weekday-1]; const todays=(bh.periods as any[]).filter(p=>String(p.day_of_week||"").toUpperCase()===code); const readable=todays.map(p=>`${pretty(p.start_local_time)}–${pretty(p.end_local_time)}`).join("; "); const todayHours=readable||"Closed"; const open=todays.some(p=>{ const s=parse(p.start_local_time,now); const e=parse(p.end_local_time,now); return now>=s && now<=e}); return { open, todayHours } }
function pretty(hhmm:string){ const [h,m]=hhmm.split(":").map(Number); return DateTime.fromObject({hour:h,minute:m}).toFormat("h:mm a") }
function parse(hhmm:string, ref: DateTime){ const [h,m]=hhmm.split(":").map(Number); return ref.set({hour:h,minute:m,second:0,millisecond:0}) }
```

Vapi Webhook (`app/api/vapi/webhook/route.ts`)
```ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { listLocations, getLocation, searchCatalogItems, findCategoryIdsByName, createBooking, normalizeLocation } from "@/lib/square"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const secret = process.env.VAPI_WEBHOOK_SECRET
  const sig = req.headers.get("x-vapi-signature") || req.headers.get("x-vapi-secret")
  if (secret && sig !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: "invalid json" }, { status: 400 }) }
  const msg = body?.message
  const type = msg?.type

  if (type === "tool-calls") {
    try { const results = await handleToolCalls(msg); return NextResponse.json({ results }) }
    catch { const list = msg?.toolCallList || []; return NextResponse.json({ results: list.map((tc: any) => ({ toolCallId: tc.id, result: { error: "Sorry, my tools ran into a problem." } })) }) }
  }
  return NextResponse.json({})
}

async function handleToolCalls(message: any) {
  const list = message?.toolCallList || []
  const results: any[] = []
  for (const tc of list) {
    const name = tc.name || tc.function?.name
    const args = tc.arguments || tc.function?.parameters || {}
    switch (name) {
      case "locations.search": {
        const schema = z.object({ query: z.string().optional() })
        const { query } = schema.parse(args)
        const locs = await listLocations()
        const filtered = query ? locs.filter((l: any) => (l.name || "").toLowerCase().includes(query.toLowerCase())) : locs
        results.push({ toolCallId: tc.id, result: filtered.map(normalizeLocation) })
        break
      }
      case "locations.get": {
        const schema = z.object({ id: z.string().optional(), name: z.string().optional() })
        const { id, name } = schema.parse(args)
        let loc: any | null = null
        if (id) loc = await getLocation(id)
        else if (name) { const locs = await listLocations(); const m = locs.find((l: any) => (l.name || "").toLowerCase() === name.toLowerCase()); loc = m?.id ? await getLocation(m.id) : null }
        results.push({ toolCallId: tc.id, result: loc ? normalizeLocation(loc) : null })
        break
      }
      case "menu.get": {
        const schema = z.object({ locationId: z.string().optional(), category: z.string().optional() })
        const { locationId, category } = schema.parse(args)
        let categoryIds: string[] | undefined
        if (category) { const found = await findCategoryIdsByName(category); categoryIds = found.length ? found : undefined }
        const items = await searchCatalogItems({ textFilter: category, categoryIds, enabledLocationIds: locationId ? [locationId] : undefined })
        const byCat: Record<string, any[]> = {}
        for (const it of items) { const data = it.item_data || {}; const key = data.category_id || "uncategorized"; const variations = (it.item_data?.variations || []).map((v: any) => { const money = v.item_variation_data?.price_money; return { name: v.item_variation_data?.name || v.name, price: money?.amount ?? null, currency: money?.currency ?? null } }); byCat[key] ||= []; byCat[key].push({ name: data.name || it.name, variations }) }
        const categories = Object.entries(byCat).map(([id, items]) => ({ id, items }))
        results.push({ toolCallId: tc.id, result: { categories } })
        break
      }
      case "reservations.create": {
        const schema = z.object({ locationId: z.string(), name: z.string(), partySize: z.number().int().positive(), whenISO: z.string() })
        const { locationId, name, partySize, whenISO } = schema.parse(args)
        const booking = { location_id: locationId, start_at: whenISO, customer_note: `Voice agent reservation for ${name} party ${partySize}`, appointment_segments: [{ team_member_id: process.env.SQUARE_DEFAULT_TEAM_MEMBER_ID, service_variation_id: process.env.SQUARE_DEFAULT_SERVICE_VARIATION_ID, service_variation_version: Number(process.env.SQUARE_DEFAULT_SERVICE_VARIATION_VERSION || "1"), duration_minutes: Number(process.env.SQUARE_DEFAULT_DURATION_MINUTES || "60"), any_team_member: false }] }
        const created = await createBooking(booking)
        results.push({ toolCallId: tc.id, result: { bookingId: created.booking?.id || null, status: created.booking?.status || null } })
        break
      }
      default:
        results.push({ toolCallId: tc.id, result: { error: `Unknown tool ${name}` } })
    }
  }
  return results
}
```

Assistant Creation (`scripts/createAssistant.ts`)
```ts
import "dotenv/config"

async function main() {
  const assistant = {
    name: "Store Receptionist",
    firstMessage: "Hi, thanks for calling. Which location can I help you with today?",
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a helpful store assistant. Use tools for hours, address, phone, menus, and reservations. Confirm details before booking. Keep responses short." }],
      functions: [
        { name: "locations.search", description: "Search locations by optional name fragment", parameters: { type: "object", properties: { query: { type: "string" } } } },
        { name: "locations.get", description: "Get a location by id or name", parameters: { type: "object", properties: { id: { type: "string" }, name: { type: "string" } } } },
        { name: "menu.get", description: "Get menu categories and items for a location", parameters: { type: "object", properties: { locationId: { type: "string" }, category: { type: "string" } } } },
        { name: "reservations.create", description: "Create a reservation at a location", parameters: { type: "object", properties: { locationId: { type: "string" }, name: { type: "string" }, partySize: { type: "number" }, whenISO: { type: "string" } }, required: ["locationId", "name", "partySize", "whenISO"] } },
      ],
    },
    voice: { provider: "11labs", voiceId: "cgSgspJ2msm6clMCkdW9" },
    transcriber: { provider: "deepgram", model: "nova-3", language: "en-US" },
    server: { url: "https://YOUR_DOMAIN/api/vapi/webhook", secret: process.env.VAPI_WEBHOOK_SECRET },
  }

  const res = await fetch("https://api.vapi.ai/assistant", { method: "POST", headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(assistant) })
  if (!res.ok) throw new Error(await res.text())
  const json = await res.json()
  console.log("assistantId", json.id)
}
main().catch(e => { console.error(e); process.exit(1) })
```

Provision Number (`scripts/createNumber.ts`)
```ts
import "dotenv/config"

async function main() {
  if (!process.env.VAPI_ASSISTANT_ID) throw new Error("Set VAPI_ASSISTANT_ID in env")
  const res = await fetch("https://api.vapi.ai/phone-number", { method: "POST", headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ provider: "vapi", assistantId: process.env.VAPI_ASSISTANT_ID, numberDesiredAreaCode: "415" }) })
  if (!res.ok) throw new Error(await res.text())
  const json = await res.json()
  console.log("phoneNumberId", json.id, "number", json.number)
}
main().catch(e => { console.error(e); process.exit(1) })
```

Outbound Call (`scripts/makeCall.ts`)
```ts
import "dotenv/config"

async function main() {
  if (!process.env.VAPI_ASSISTANT_ID || !process.env.VAPI_PHONE_NUMBER_ID) throw new Error("Set VAPI_ASSISTANT_ID and VAPI_PHONE_NUMBER_ID")
  const res = await fetch("https://api.vapi.ai/call", { method: "POST", headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ assistant: { assistantId: process.env.VAPI_ASSISTANT_ID }, phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, customer: { number: "+1YOURCELLPHONE" } }) })
  const json = await res.json(); console.log(json)
}
main().catch(e => { console.error(e); process.exit(1) })
```

package.json Script Additions
```json
{
  "scripts": {
    "dev": "next dev",
    "create:assistant": "tsx scripts/createAssistant.ts",
    "create:number": "tsx scripts/createNumber.ts",
    "call:outbound": "tsx scripts/makeCall.ts"
  }
}
```

System Prompt (Paste Into Assistant)
- You are a helpful store assistant. Use tools for hours, address and directions, phone, menus, and reservations. Always prefer tool results. Never guess. Before creating a reservation, confirm location, calendar date, time, and party size. If a tool fails once, give a short apology and offer to send a text link or transfer to staff. Keep replies brief and natural for phone.

Local Testing
- Run `next dev`. Expose `http://localhost:3000/api/vapi/webhook` via a tunnel and set that URL (with `VAPI_WEBHOOK_SECRET`) in the assistant server config.
- When Vapi posts tool calls, your route returns the required `results` array keyed by `toolCallId`.

Production Notes
- Pin `Square-Version` on every request. Keep webhook route on Node runtime. Route Handlers use `request.json()` and `NextResponse.json()` to handle bodies/responses. Free Vapi numbers are US only; import a number for international or higher scale.

Acceptance Checks (After Deploy)
- Hours: Agent calls `locations.get`, computes open‑now and today hours, and answers concisely.
- Menu: Agent finds category IDs (SearchCatalogObjects) and items (SearchCatalogItems), summarizes a couple of items, and can offer a text link later via an SMS tool.
- Reservation: Agent confirms details, calls Bookings create with idempotency, and reads back a confirmation.

Quick Checklist
- Assistant configured with server URL + secret; custom tools defined; number created and attached.
- Webhook live at `/api/vapi/webhook` (Node runtime). Square calls are server‑side only; version pinned. Tool replies always follow `toolCallId` + `result` array format.
