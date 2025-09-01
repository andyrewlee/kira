# Custom Website (Square + v0 Platform API)

- Status: Draft
 
## High-Level
- Lovable/v0-style single-prompt app generator using the v0 Platform API.
- Tight Square Locations integration (server-side) for location pages (hours, address, phone, map-ready data).
- User can keep iterating by prompting to improve pages, content, and components.
- Owner: TBD
- Last Updated: 2025-09-01

## Overview
Generate a location-centric marketing site using the v0 Platform API from a single prompt, then wire it to Square’s Locations API for store data (hours, address, phone, services). Ship a lightweight Next.js app with SEO, a store locator, and easy content edits.

## Goals & Success Criteria
- Single prompt initializes a working Next.js site via v0 API.
- Pulls live Location data from Square; caches with ISR.
- Pages: Home, Locations index, Location detail, About/Contact.
- SEO: sitemaps, structured data for local business, clean URLs.
- Admin-friendly: environment variables for Square credentials; simple copy edits.

## v0 Platform API (Single Prompt)
- Prompt intent: bootstrap a Next.js site with SSR routes for Locations and a simple CMS-like JSON config for marketing copy.
- Core endpoints used:
  - `POST /chats/create` to create a chat from the prompt and config.
  - `POST /deployments/create` to deploy the generated site.
  - Optional: `GET /chats/get-by-id`, `GET /deployments/get-by-id` for status.
- Minimal prompt outline:
  - Describe pages, components, data fetching from Square, SEO, and env vars.
  - Ask for `.env` keys: `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`.
  - Require ISR and route handlers for API proxy to Square.

## Square Integration
- API version: send header `Square-Version: 2025-08-20` on all requests.
- Auth: `Authorization: Bearer ${SQUARE_ACCESS_TOKEN}` (server-only); `Content-Type: application/json`.
- Endpoints:
  - List Locations: `GET /v2/locations` → list all business locations (ACTIVE/inactive). Use for index page.
  - Retrieve Location: `GET /v2/locations/{location_id}` (or `main`) → details for location page.
- Fields of interest (map to UI):
  - `id`, `name`, `business_name`, `status`, `timezone`, `language_code`, `currency`.
  - Address: `address_line_1`, `locality`, `administrative_district_level_1`, `postal_code`, `country`.
  - `phone_number`, `coordinates.latitude/longitude` (if present).
  - Hours: if using an external source, derive; otherwise omit for v1 or compute open/closed via `timezone` + manual schedule config.
- Caching & quotas: server-side cache (ISR) with revalidate window; avoid client-side direct calls; exponential backoff on 429/5xx.
- Security: never leak access token; proxy via server routes only.

## Pages & Features
- Home: hero, highlights, CTA to Locations; marketing copy from JSON.
- Locations index: searchable/filterable list; map (optional later).
- Location detail: hours, address, phone, status (open/closed now), services; SEO schema.org LocalBusiness.
- Hours source: if Square doesn’t provide hours, store a simple JSON per-location schedule in repo or env-config and compute open/closed using `timezone`.
- Contact/About: static copy; social links; contact form stub.
- Sitemap/robots: auto generated.

## Data & Caching
- Fetch on server via route handlers: `GET /api/locations`, `GET /api/locations/[id]`.
- Caching: ISR revalidate every N minutes; manual invalidation endpoint (auth-protected).
- Fallback: graceful handling if Square down; cached render + banner.

### Internal Route Handler Sketch
- `GET /api/locations`
  - Add headers: `Square-Version`, `Authorization`, `Content-Type`.
  - Fetch `GET https://connect.squareup.com/v2/locations`.
  - Map to `{ id, name, address, timezone, status, phone_number, coordinates }`.
  - Cache: `revalidate: <N minutes>`.
- `GET /api/locations/[id]`
  - Fetch `GET https://connect.squareup.com/v2/locations/{id}`.
  - Normalize to detail DTO; compute `open_now` using timezone + schedule JSON.

## Config & Env
- Required env: `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`, `NEXT_PUBLIC_SITE_NAME`.
- Optional: analytics keys, map provider key (if map enabled).
 - Headers: `Square-Version` fixed to `2025-08-20`.

## API Shape (Internal)
- `GET /api/locations`: returns normalized list `{ id, name, address, coords, hours, phone }`.
- `GET /api/locations/[id]`: returns detail with weekly hours and timezone.

## Single Prompt Draft (v0)
Use this as the one-shot prompt for `POST /chats/create`:

"Build a Next.js app that renders a marketing site for a multi-location business. Pages: Home, Locations index at `/locations`, and Location detail at `/locations/[id]`, plus About and Contact. Create server route handlers `/api/locations` and `/api/locations/[id]` that call Square’s Locations API with headers `Square-Version: 2025-08-20`, `Authorization: Bearer ${SQUARE_ACCESS_TOKEN}`. Never expose the token to the client. Normalize fields to `{ id, name, address, timezone, status, phone_number, coordinates }`. Implement ISR with revalidate set via env `LOCATIONS_REVALIDATE_MINUTES`. On detail pages, compute `open_now` using a simple per-location schedule JSON in `config/locations-hours.json` and the location timezone. Add SEO (titles, meta, JSON-LD LocalBusiness), sitemap, and robots. Include a `.env.example` listing `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`, `LOCATIONS_REVALIDATE_MINUTES`, and `NEXT_PUBLIC_SITE_NAME`. Styling can be minimal but responsive. Provide a README with setup instructions and how to deploy via Vercel."

## Security
- Do not expose Square token to client; server-only fetch.
- Input validation and basic rate limits for internal APIs.

## Repo Path Constraint
- Implement in existing Next files under `app/dashboard/*` only.
- Suggested paths: `app/dashboard/custom-website/page.tsx`, `app/dashboard/locations/page.tsx`, `app/dashboard/locations/[id]/page.tsx`, and small helpers under `app/dashboard/**/*.(ts|tsx)`; any admin endpoints under `app/dashboard/locations/api/*.(ts)`.
- Avoid files outside `app/dashboard/` unless explicitly approved.

## TODOs

### Phase 0 — Discovery
- Confirm location fields to display; finalize copy sections.
- Define prompt text for v0 to generate the base Next.js app.
- Prepare `.env` key list and README instructions.

### Phase 1 — v0 Bootstrapping
- Call `POST /chats/create` with the single prompt and desired tech choices.
- Fetch the created chat/version and trigger `POST /deployments/create`.
- Verify deployment URL renders baseline site.

### Phase 2 — Square Wiring
- Add server route handlers to call Square Locations with bearer token.
- Normalize hours and timezone; build helper to compute open/closed now.
- Implement ISR/edge caching; set revalidate policy.

### Phase 3 — Pages & SEO
- Build Locations index/detail pages using normalized APIs.
- Add structured data (JSON-LD) and meta tags per page.
- Add sitemap and robots routes; verify indexing locally.

### Phase 4 — Admin & Content
- Create simple JSON/MD config for homepage and about content.
- Expose env-driven toggles (map on/off, revalidate interval).
- Add minimal contact form stub (no-op or email hook later).

### Phase 5 — QA & Launch
- Test with multiple locations/timezones; DST edge cases.
- Lighthouse/AXE audits; page speed checks.
- Write setup docs: envs, redeploy, cache invalidation.

## Acceptance Criteria (v1)
- v0 single prompt creates and deploys a Next.js site scaffold.
- Locations index and detail pages render from live Square data with caching.
- Hours display correctly with timezone and “open now” indicator.
- SEO basics present: titles, meta, JSON-LD, sitemap/robots.
- All Square credentials remain server-side; no client leaks.
- All Square requests include `Square-Version: 2025-08-20`.

## Optional: Stripe Variant (Landing Only)
- If Square isn’t available, a minimal landing can be generated using Stripe data (e.g., brand, products as highlights), but this is secondary. Confirm if needed and which Stripe objects to surface.

## Implementation Blueprint (Next.js 14)

Overview
- Drop‑in plan for a Next.js App Router project with Square Locations, caching with revalidate, admin revalidate endpoint, JSON‑LD LocalBusiness, and a tiny client search component. No external network needed beyond Square.

Setup
- Install: `npm i luxon`
- Env (`.env.local`):
  - `SQUARE_ACCESS_TOKEN=replace_me`
  - `SQUARE_ENV=sandbox`
  - `NEXT_PUBLIC_SITE_NAME=My Multi Location Brand`
  - `LOCATIONS_REVALIDATE_MINUTES=10`
  - `ADMIN_REVALIDATE_TOKEN=replace_me_admin_secret`

Project Layout
- `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/sitemap.ts`
- `app/api/locations/route.ts`, `app/api/locations/[id]/route.ts`, `app/api/admin/revalidate/route.ts`
- `app/locations/page.tsx`, `app/locations/[id]/page.tsx`
- `components/LocationsList.tsx`
- `config/marketing.json`, `config/locations-hours.json`
- `lib/square.ts`, `lib/hours.ts`
- `types/square.d.ts`
- `middleware.ts`

`lib/square.ts`
```ts
import 'server-only'
import { setTimeout as sleep } from 'timers/promises'
import type { SquareLocation } from '@/types/square'

const SQUARE_VERSION = '2025-08-20'
function baseUrl(){ const env=(process.env.SQUARE_ENV||'sandbox').toLowerCase(); return env==='production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com' }
function defaultHeaders(){ const t=process.env.SQUARE_ACCESS_TOKEN; if(!t) throw new Error('SQUARE_ACCESS_TOKEN not set'); return { 'Square-Version': SQUARE_VERSION, 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } }
function shouldRetry(s:number){ return s===429 || (s>=500 && s<600) }
async function fetchWithRetry(url:string, init: RequestInit & { retries?: number } = {}){ const {retries=2, ...rest}=init; let a=0; while(true){ const res=await fetch(url, rest); if(res.ok) return res; if(!shouldRetry(res.status)||a>=retries) return res; const d=Math.min(1000*Math.pow(2,a)+Math.random()*200,5000); await sleep(d); a++ } }
export async function listLocationsRaw(options?:{ next?: { revalidate?: number; tags?: string[] }, signal?: AbortSignal }){ const url=`${baseUrl()}/v2/locations`; const res=await fetchWithRetry(url,{ headers: defaultHeaders(), next: options?.next, signal: options?.signal }); if(!res.ok){ const text=await res.text(); throw new Error(`Square list locations failed ${res.status} ${text}`) } return res.json() as Promise<{ locations: SquareLocation[] }> }
export async function getLocationRaw(id:string, options?:{ next?: { revalidate?: number; tags?: string[] }, signal?: AbortSignal }){ const url=`${baseUrl()}/v2/locations/${encodeURIComponent(id)}`; const res=await fetchWithRetry(url,{ headers: defaultHeaders(), next: options?.next, signal: options?.signal }); if(!res.ok){ const text=await res.text(); throw new Error(`Square retrieve location failed ${res.status} ${text}`) } return res.json() as Promise<{ location: SquareLocation }> }
export function toSummary(loc: SquareLocation){ return { id: loc.id, name: loc.name ?? null, business_name: loc.business_name ?? null, status: loc.status ?? null, timezone: loc.timezone ?? null, language_code: loc.language_code ?? null, currency: loc.currency ?? null, phone_number: loc.phone_number ?? null, address: loc.address ?? null, coordinates: loc.coordinates? { latitude: loc.coordinates.latitude, longitude: loc.coordinates.longitude } : null, business_hours: loc.business_hours ?? null, website_url: loc.website_url ?? null, logo_url: loc.logo_url ?? null } }
```

`lib/hours.ts`
```ts
import 'server-only'
import { DateTime, Interval } from 'luxon'
import type { BusinessHours, DayCode } from '@/types/square'
export type WeeklySchedule = Partial<Record<DayCode, { start: string; end: string }[]>>
const DAY_NAME: Record<DayCode,string>={ MON:'Monday',TUE:'Tuesday',WED:'Wednesday',THU:'Thursday',FRI:'Friday',SAT:'Saturday',SUN:'Sunday' }
export function fromSquareBusinessHours(bh?: BusinessHours|null): WeeklySchedule|null{ const p=bh?.periods; if(!p||p.length===0) return null; const out:WeeklySchedule={}; for(const period of p){ const day=period.day_of_week as DayCode; const list=out[day]??[]; list.push({ start: period.start_local_time.slice(0,5), end: period.end_local_time.slice(0,5) }); out[day]=list } return out }
function buildIntervals(zone:string, date:DateTime, ranges:{start:string;end:string}[]){ return ranges.map(({start,end})=>{ const s=DateTime.fromISO(`${date.toISODate()}T${start}`,{zone}); let e=DateTime.fromISO(`${date.toISODate()}T${end}`,{zone}); if(e<=s) e=e.plus({days:1}); return Interval.fromDateTimes(s,e) }) }
export function computeOpenNow(zone:string, schedule:WeeklySchedule|null){ if(!zone||!schedule) return { open_now:false, next_change:null as string|null }; const now=DateTime.now().setZone(zone); const dayCodes:DayCode[]=['MON','TUE','WED','THU','FRI','SAT','SUN']; const todayCode=dayCodes[(now.weekday+6)%7]; const yesterday=now.minus({days:1}); const yesterdayCode=dayCodes[(yesterday.weekday+6)%7]; const todayRanges=schedule[todayCode]??[]; const yRanges=(schedule[yesterdayCode]??[]).filter(r=>r.end<r.start); const intervals=[...buildIntervals(zone,yesterday.startOf('day'),yRanges), ...buildIntervals(zone,now.startOf('day'),todayRanges)]; let open=false; let next:DateTime|null=null; for(const iv of intervals){ if(iv.contains(now)){ open=true; if(!next||iv.end<next) next=iv.end } else if(iv.start>now){ if(!next||iv.start<next) next=iv.start } } return { open_now: open, next_change: next? next.toISO(): null } }
export function toOpeningHoursSpecification(schedule:WeeklySchedule|null){ if(!schedule) return []; const out:any[]=[]; for (const day of Object.keys(schedule) as DayCode[]){ for(const r of schedule[day]!) out.push({ '@type':'OpeningHoursSpecification', dayOfWeek: DAY_NAME[day], opens: r.start+':00', closes: r.end+':00' }) } return out }
```

`types/square.d.ts`
```ts
export type DayCode = 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN'
export interface SquareAddress{ address_line_1?:string|null; address_line_2?:string|null; locality?:string|null; administrative_district_level_1?:string|null; postal_code?:string|null; country?:string|null }
export interface SquareCoordinates{ latitude:number; longitude:number }
export interface BusinessHoursPeriod{ day_of_week: DayCode; start_local_time: string; end_local_time: string }
export interface BusinessHours{ periods?: BusinessHoursPeriod[]|null }
export interface SquareLocation{ id:string; name?:string|null; business_name?:string|null; status?:string|null; timezone?:string|null; language_code?:string|null; currency?:string|null; phone_number?:string|null; address?: SquareAddress|null; coordinates?: SquareCoordinates|null; business_hours?: BusinessHours|null; website_url?:string|null; logo_url?:string|null }
```

`config/marketing.json`
```json
{ "hero": { "title": "Welcome to NEXT_PUBLIC_SITE_NAME", "subtitle": "Find a store near you and see live hours", "ctaLabel": "Browse locations", "ctaHref": "/locations" }, "about": { "title": "About us", "body": "Short brand story here." }, "contact": { "email": "hello@example.com", "twitter": "https://x.com/example", "instagram": "https://instagram.com/example" } }
```

`config/locations-hours.json`
```json
{ "main": { "MON": [{ "start": "09:00", "end": "17:00" }], "TUE": [{ "start": "09:00", "end": "17:00" }], "WED": [{ "start": "09:00", "end": "17:00" }], "THU": [{ "start": "09:00", "end": "17:00" }], "FRI": [{ "start": "09:00", "end": "17:00" }], "SAT": [], "SUN": [] } }
```

API Routes
- `app/api/locations/route.ts`
```ts
import { NextResponse } from 'next/server'
import { listLocationsRaw, toSummary } from '@/lib/square'
const REVALIDATE = Number(process.env.LOCATIONS_REVALIDATE_MINUTES ?? '10') * 60
export async function GET(){ try{ const data=await listLocationsRaw({ next:{ revalidate: REVALIDATE, tags:['locations'] } }); const items=(data.locations??[]).map(toSummary); return NextResponse.json({ locations: items },{ status:200 }) } catch(err:any){ return NextResponse.json({ error: err.message }, { status:500 }) } }
```
- `app/api/locations/[id]/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { getLocationRaw, toSummary } from '@/lib/square'
import { fromSquareBusinessHours, computeOpenNow, toOpeningHoursSpecification, type WeeklySchedule } from '@/lib/hours'
import fallback from '@/config/locations-hours.json'
const REVALIDATE = Number(process.env.LOCATIONS_REVALIDATE_MINUTES ?? '10') * 60
export async function GET(_req: NextRequest, ctx:{ params:{ id:string } }){ try{ const id=ctx.params.id; const data=await getLocationRaw(id,{ next:{ revalidate: REVALIDATE, tags:['locations'] } }); const loc=toSummary(data.location); const weeklyFromSquare=fromSquareBusinessHours(loc.business_hours); const weeklyFromConfig=(fallback as Record<string,WeeklySchedule|undefined>)[id] ?? (fallback as Record<string,WeeklySchedule|undefined>)['main'] ?? null; const weekly=weeklyFromSquare ?? weeklyFromConfig; const open=computeOpenNow(loc.timezone ?? 'UTC', weekly); const jsonLdHours=toOpeningHoursSpecification(weekly); return NextResponse.json({ location: loc, open, jsonLdHours }, { status:200 }) } catch(err:any){ return NextResponse.json({ error: err.message }, { status:500 }) } }
```
- `app/api/admin/revalidate/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
export async function POST(req: NextRequest){ const auth=req.headers.get('authorization')??''; const expected=`Bearer ${process.env.ADMIN_REVALIDATE_TOKEN}`; if(auth!==expected) return NextResponse.json({ error:'Unauthorized' }, { status:401 }); revalidateTag('locations'); return NextResponse.json({ revalidated:true }) }
```

Pages
- `app/layout.tsx`, `app/page.tsx` (marketing hero), `components/LocationsList.tsx` (client search), `app/locations/page.tsx`, `app/locations/[id]/page.tsx` with JSON‑LD embed and Google Maps link.

Robots & Sitemap
- `app/robots.ts`, `app/sitemap.ts` generating URLs for index and locations (use `NEXT_PUBLIC_SITE_URL` for absolute URLs).

Middleware (protect admin revalidate)
```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req: NextRequest){ const { pathname } = req.nextUrl; if(pathname === '/api/admin/revalidate'){ const auth=req.headers.get('authorization')??''; const expected=`Bearer ${process.env.ADMIN_REVALIDATE_TOKEN}`; if(auth!==expected) return NextResponse.json({ error:'Unauthorized' }, { status:401 }) } return NextResponse.next() }
export const config = { matcher: ['/api/admin/revalidate'] }
```

Run
- `npm run dev` then visit `/locations` and `/locations/[id]`.
- Trigger revalidate via `POST /api/admin/revalidate` with Authorization Bearer token.

Optional
- Use your internal API from pages (instead of calling libs) by fetching `/api/locations` with revalidate tag.
- Single‑prompt for v0: include the same structure and headers; add `.env.example` with `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`, `LOCATIONS_REVALIDATE_MINUTES`, `NEXT_PUBLIC_SITE_NAME`, `ADMIN_REVALIDATE_TOKEN`.

## Open Questions
- Map integration now or later? Which provider?
- Exact revalidation cadence and manual purge requirements.
- Any branding/theme requirements beyond basic styling?
