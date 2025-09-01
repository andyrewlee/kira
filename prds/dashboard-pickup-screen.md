# Pickup Screen (Square + v0 Platform API)

- Status: Draft
 
## High-Level
- Lovable/v0-style single-prompt app generator using the v0 Platform API.
- Listens to Square `order.fulfillment.updated` webhooks; shows only Preparing and Finished columns.
- Users can keep refining the board by prompting; server securely enriches with order details.
- Owner: TBD
- Last Updated: 2025-09-01

## Overview
Generate a real-time pickup board using the v0 Platform API from a single prompt, then connect to Square order fulfillment webhooks to reflect status changes. Runs in kiosk mode with large, legible UI and resilient updates.

## Goals & Success Criteria
- Single prompt initializes a working Next.js app via v0 API.
- Receives Square webhook events for order fulfillment updates.
- Low-latency updates to the UI via SSE/WebSocket; offline-safe.
- Configurable privacy (names vs order numbers) and optional location scoping.
- Optional voice announcements when orders move to Finished.

## v0 Platform API (Single Prompt)
- Prompt intent: bootstrap a Next.js app with a real-time board, server endpoints for Square webhook intake, an in-memory store (or Redis later), and a kiosk-ready UI.
- Core endpoints used:
  - `POST /chats/create` to create the project from the prompt.
  - `POST /deployments/create` to deploy the app.
  - Optional: `GET /deployments/find-logs` for debugging.

## Square Integration
- Webhook event: `order.fulfillment.updated` (beta). Published when an `OrderFulfillment` is created or updated via UpdateOrder.
- Mapping to board states:
  - Preparing: `new_state` in {`PROPOSED`, `RESERVED`, `PREPARED`}.
  - Finished: `new_state` in {`COMPLETED`}.
- Env vars: `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV` (sandbox/production).
- Signature verification: verify `x-square-signature` per Square docs.
- Fetch order details: after webhook, call Orders API (`GET /v2/orders/{order_id}`) to retrieve display info (e.g., customer name/label, line items).
- Location scoping: use `data.object.order_fulfillment_updated.location_id` or the fetched order's `location_id`.

## Data Flow
- Ingest: `POST /api/square/webhook` receives events, verifies signature, extracts `{ order_id, location_id, fulfillment_update[] }`.
- Enrich: fetch order details for display name/number and items; normalize to `{ id, location_id, display_name, pickup_code?, status: Preparing|Finished, updated_at, line_items }`.
- Store: keep recent orders in memory (per optional location); TTL Finished orders after a configurable duration.
- Broadcast: push updates to clients via `GET /api/stream` (SSE) or WebSocket.
- Announce: on transition to Finished, enqueue a voice announcement.
- Display: client renders two buckets: Preparing and Finished.

## Kiosk & UX
- Full-screen layout; auto-reconnect; error/offline banners.
- Privacy: configurable display field (name, number, masked phone).
- Filters: optional per-location view.
- Audio: client plays queued voice announcements with adjustable volume.

## API Shape (Internal)
- `POST /api/square/webhook`: intake + verify + enrich + broadcast.
- `GET /api/orders?location=...`: seed the initial state on page load.
- `GET /api/stream`: SSE stream of order and announcement events.
- `GET /api/announce/:id`: streams synthesized TTS audio (server-side) for a specific announcement.

## Security
- Verify Square webhook signatures and limit IPs if feasible.
- Keep secrets server-side; add basic auth secret for webhook endpoint if desired.
- Do not expose OpenAI API key to the client; all TTS occurs server-side.

## TODOs

### Phase 0 — Discovery
- Confirm `order.fulfillment.updated` payload and states mapping.
- Define how to derive display name (customer profile, pickup name, or order number fallback).
- Decide TTL for Finished orders and whether to allow manual clear.
- Draft the single prompt for v0 describing pages and APIs to scaffold.

### Phase 1 — v0 Bootstrapping
- Call `POST /chats/create` with the prompt; retrieve version.
- Trigger `POST /deployments/create`; verify deployment URL.

### Phase 2 — Webhook Intake
- Implement `/api/square/webhook` with signature verification.
- On event, fetch order by `order_id`, normalize display fields, and compute new status.
- Add store (in-memory) and TTL eviction; error handling and idempotency.

### Phase 3 — Realtime Channel
- Implement SSE route (`/api/stream`) and client subscription.
- Broadcast on webhook ingest; add heartbeat and reconnect logic.
 - Include announcement events with `{ announceId, text }` when status becomes Finished.

### Phase 4 — UI & Kiosk
- Build large, legible board with two columns: Preparing and Finished.
- Add optional location selector and privacy mode toggle.
- Offline/empty/error states with clear messaging.
- Client listens for announcement events; fetches `/api/announce/:id` audio and plays.

### Phase 5 — QA & Ops
- Test webhook flow end-to-end with Square sandbox.
- Load test SSE stream; soak test 24–72h.
- Write setup docs: envs, webhook subscription, kiosk instructions.

## Acceptance Criteria (v1)
- v0 single prompt creates and deploys a Next.js pickup board scaffold.
- Square `order.fulfillment.updated` events update the UI in near real-time; SSE connection is resilient.
- Correct mapping into exactly two buckets: Preparing and Finished.
- Display name is populated from fetched order; fallback to order ID if missing.
- Privacy setting respected; optional location filtering works.
- On transition to Finished, a voice announcement plays the name once.
- All secrets remain server-side; webhook verifies Square signature.

## Voice Announcements (OpenAI TTS)
- Server uses OpenAI TTS (e.g., `tts-1`) to synthesize "Order for {name} is ready" with configurable voice.
- Env vars: `OPENAI_API_KEY`, `ANNOUNCE_VOICE` (default: `alloy`).
- Flow: webhook determines Finished transition → enqueue `{ text, voice }` → SSE emits `announceId` → client GETs `/api/announce/:id` to stream audio → play.

## Implementation Blueprint (Next.js 14)

What You’re Building
- Verifies Square webhooks using `x-square-hmacsha256-signature` over `notification_url + raw_body` with HMAC SHA‑256.
- Enriches via `GET /v2/orders/{order_id}` and maps fulfillment states → Preparing/Finished.
- Streams updates to browsers over Server‑Sent Events (SSE) with heartbeats.
- Switches Square Sandbox/Production base URLs via env (`SQUARE_ENV`).
- Optional v0 Platform API tie‑in to generate/deploy from a single prompt.

Folder Layout
- `app/api/square/webhook/route.ts` — webhook intake + signature validation + enrichment + broadcast
- `app/api/orders/route.ts` — seed board state
- `app/api/stream/route.ts` — SSE endpoint with heartbeats
- `app/api/announce/[id]/route.ts` — TTS audio stream for announcements
- `app/page.tsx` — kiosk UI
- `lib/types.ts`, `lib/signature.ts`, `lib/square.ts`, `lib/store.ts`, `lib/broadcast.ts`

Environment (.env.local)
- `SQUARE_ACCESS_TOKEN`, `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_ENV` (sandbox|production)
- `SQUARE_WEBHOOK_URL` (exact public webhook URL), `SQUARE_VERSION` (e.g., `2025-07-17`)
- `OPENAI_API_KEY`, `ANNOUNCE_VOICE` (e.g., `alloy`), `BASIC_AUTH_SECRET` (optional)

Types (lib/types.ts)
```ts
export type BoardStatus = "Preparing" | "Finished"
export interface LineItem { name: string; quantity: string }
export interface BoardOrder { id: string; locationId: string; displayName: string; pickupCode?: string; status: BoardStatus; updatedAt: string; lineItems: LineItem[] }
export type OrderUpdateEvent = { type: "orderUpdate"; data: BoardOrder }
export type AnnounceEvent = { type: "announce"; data: { announceId: string; text: string; voice: string } }
export type ServerEvent = OrderUpdateEvent | AnnounceEvent
```

Signature Utils (lib/signature.ts)
```ts
import { createHmac, timingSafeEqual } from "node:crypto"
export function computeSquareSignature(url: string, raw: string, key: string){return createHmac("sha256", key).update(url+raw).digest("base64")}
export function safeEqual(a: string, b: string){const A=Buffer.from(a,"utf8"),B=Buffer.from(b,"utf8"); if(A.length!==B.length) return false; return timingSafeEqual(A,B)}
```

Square REST Helpers (lib/square.ts)
```ts
const BASES={sandbox:"https://connect.squareupsandbox.com",production:"https://connect.squareup.com"} as const
const base=()=>process.env.SQUARE_ENV==="production"?BASES.production:BASES.sandbox
export async function retrieveOrder(orderId:string){
  const res=await fetch(`${base()}/v2/orders/${orderId}`,{headers:{Authorization:`Bearer ${process.env.SQUARE_ACCESS_TOKEN!}`,"Square-Version":process.env.SQUARE_VERSION||"2025-07-17","Content-Type":"application/json"},cache:"no-store"});
  if(!res.ok) throw new Error(`Square retrieve order failed ${res.status}`); return await res.json() as any
}
export function deriveDisplayName(order:any){const f=order?.order?.fulfillments?.[0]; const g=f?.pickup_details?.recipient?.given_name; const d=f?.pickup_details?.recipient?.display_name; if(g) return g; if(d) return d; const id=order?.order?.id??""; return id? id.slice(-6):"ORDER"}
```

Store & Broadcaster (lib/store.ts, lib/broadcast.ts)
```ts
// store.ts
import { BoardOrder } from "./types"
type Listener=(e:any)=>void
class Broadcaster{private ls=new Set<Listener>(); add(f:Listener){this.ls.add(f)} remove(f:Listener){this.ls.delete(f)} emit(e:any){for(const f of this.ls) try{f(e)}catch{}}}
class OrderStore{private byLoc=new Map<string,Map<string,BoardOrder>>(); private seen=new Map<string,number>(); private ttlMs=12*60*1000; public bus=new Broadcaster();
 setTTL(m:number){this.ttlMs=m*60*1000}
 upsert(loc:string,o:BoardOrder){if(!this.byLoc.has(loc)) this.byLoc.set(loc,new Map()); this.byLoc.get(loc)!.set(o.id,o); this.bus.emit({type:"orderUpdate",data:o})}
 list(loc?:string){const all:BoardOrder[]=[]; if(loc){const m=this.byLoc.get(loc); if(!m) return[]; for(const v of m.values()) all.push(v)} else {for(const m of this.byLoc.values()) for(const v of m.values()) all.push(v)} return all.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))}
 markSeen(k:string){this.seen.set(k,Date.now())} isSeen(k:string){return this.seen.has(k)}
 sweep(){const now=Date.now(); for(const [loc,m] of this.byLoc){for(const [id,o] of m){if(o.status==="Finished"&& now- Date.parse(o.updatedAt)>this.ttlMs) m.delete(id)}} for(const [k,t] of this.seen) if(now-t>86_400_000) this.seen.delete(k)} }
export const store=new OrderStore(); setInterval(()=>store.sweep(),30_000).unref()
// broadcast.ts
type Send=(s:string)=>void; class Clients{private s=new Set<Send>(); add(f:Send){this.s.add(f)} remove(f:Send){this.s.delete(f)} send(l:string){for(const f of this.s) f(l)}}
export const clients=new Clients(); export const sseFormat=(evt:string,data:unknown)=>`event: ${evt}\ndata: ${JSON.stringify(data)}\n\n`
```

Webhook Intake (app/api/square/webhook/route.ts)
```ts
import { NextResponse } from "next/server"; import { computeSquareSignature, safeEqual } from "@/lib/signature"; import { retrieveOrder, deriveDisplayName } from "@/lib/square"; import { store } from "@/lib/store";
export const runtime="nodejs"; export const dynamic="force-dynamic";
const mapStatus=(s:string)=> s==="COMPLETED"?"Finished": (s==="PROPOSED"||s==="RESERVED"||s==="PREPARED"?"Preparing":null)
export async function POST(req:Request){
  const basic=process.env.BASIC_AUTH_SECRET; if(basic){const hdr=req.headers.get("authorization")||""; const ok=hdr===`Basic ${Buffer.from(`x:${basic}`).toString("base64")}`; if(!ok) return new NextResponse("unauthorized",{status:401})}
  const raw=await req.text(); const header=req.headers.get("x-square-hmacsha256-signature")||""; const expect=computeSquareSignature(process.env.SQUARE_WEBHOOK_URL!,raw,process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!); if(!safeEqual(header,expect)) return new NextResponse("invalid signature",{status:401});
  const p=JSON.parse(raw); const eid:string=p.event_id; if(store.isSeen(eid)) return NextResponse.json({ok:true,duplicate:true}); store.markSeen(eid);
  const obj=p?.data?.object||{}; const orderId:string|undefined=obj?.order_fulfillment_updated?.order_id || p?.data?.order_id; if(!orderId) return NextResponse.json({ok:true,ignored:"no order id"});
  const order=await retrieveOrder(orderId); const f=order?.order?.fulfillments?.[0]; const mapped=mapStatus(f?.state||"PROPOSED"); if(!mapped) return NextResponse.json({ok:true,ignored:"unsupported state"});
  const locationId=order?.order?.location_id || obj?.order_fulfillment_updated?.location_id || "UNKNOWN"; const displayName=deriveDisplayName(order); const updatedAt=order?.order?.updated_at || new Date().toISOString();
  const normalized={ id:orderId, locationId, displayName, pickupCode:f?.pickup_details?.pickup_at || undefined, status:mapped, updatedAt, lineItems:(order?.order?.line_items||[]).map((li:any)=>({name:li.name,quantity:li.quantity})) };
  const prev=store.list(locationId).find(o=>o.id===orderId); const becameFinished=mapped==="Finished" && (!prev || prev.status!=="Finished"); store.upsert(locationId,normalized);
  const { clients, sseFormat } = await import("@/lib/broadcast"); clients.send(sseFormat("orderUpdate",normalized));
  if(becameFinished){ const voice=process.env.ANNOUNCE_VOICE||"alloy"; const announceId=`${orderId}-${Date.now()}`; (globalThis as any).__announceQueue??=new Map<string,{text:string;voice:string}>(); (globalThis as any).__announceQueue.set(announceId,{text:`Order for ${displayName} is ready`,voice}); clients.send(sseFormat("announce",{announceId,text:`Order for ${displayName} is ready`,voice})) }
  return NextResponse.json({ok:true})
}
```

Seed & SSE Routes
```ts
// app/api/orders/route.ts
import { NextResponse } from "next/server"; import { store } from "@/lib/store"; export const runtime="nodejs"; export const dynamic="force-dynamic"; export async function GET(req:Request){ const {searchParams}=new URL(req.url); const loc=searchParams.get("location")||undefined; return NextResponse.json(store.list(loc)) }
// app/api/stream/route.ts
import { clients, sseFormat } from "@/lib/broadcast"; export const runtime="nodejs"; export const dynamic="force-dynamic"; export const maxDuration=60; export async function GET(){ const enc=new TextEncoder(); const stream=new ReadableStream({ start(controller){ const send=(l:string)=>controller.enqueue(enc.encode(l)); clients.add(send); send(sseFormat("hello",{ts:Date.now()})); const hb=setInterval(()=>send(`event: ping\ndata: ${Date.now()}\n\n`),15000); const close=()=>{clearInterval(hb); clients.remove(send); controller.close()}; (controller as any)._close=close }, cancel(){ const close=(this as any)._close; if(close) close() } }); return new Response(stream,{ headers:{"Content-Type":"text/event-stream","Cache-Control":"no-store","Connection":"keep-alive"} }) }
```

TTS Announcements (OpenAI)
```ts
// app/api/announce/[id]/route.ts
import { NextResponse } from "next/server"; import OpenAI from "openai"; export const runtime="nodejs"; export async function GET(_:Request,{params}:{params:{id:string}}){ const q=((globalThis as any).__announceQueue as Map<string,{text:string;voice:string}>)||new Map(); const e=q.get(params.id); if(!e) return new NextResponse("not found",{status:404}); q.delete(params.id); const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY!}); const resp=await openai.audio.speech.create({model:"tts-1",voice:e.voice,input:e.text,format:"mp3"}); const buf=Buffer.from(await resp.arrayBuffer()); return new NextResponse(buf,{headers:{"Content-Type":"audio/mpeg"}}) }
```

Kiosk UI (app/page.tsx)
```tsx
"use client"; import { useEffect, useMemo, useState } from "react"; import type { BoardOrder } from "@/lib/types"
export default function Page(){ const [orders,setOrders]=useState<BoardOrder[]>([]); const [privacy,setPrivacy]=useState<"name"|"order"|"masked">("name"); const [offline,setOffline]=useState(false); const [volume,setVolume]=useState(1.0);
useEffect(()=>{ fetch("/api/orders",{cache:"no-store"}).then(r=>r.json()).then(setOrders).catch(()=>{}) },[])
useEffect(()=>{ let retry=1000; let es:EventSource|null=null; const connect=()=>{ es=new EventSource("/api/stream"); es.addEventListener("hello",()=>setOffline(false)); es.addEventListener("ping",()=>setOffline(false)); es.addEventListener("orderUpdate",(ev)=>{ const ord=JSON.parse((ev as MessageEvent).data) as BoardOrder; setOrders(curr=>curr.filter(o=>!(o.id===ord.id&&o.locationId===ord.locationId)).concat(ord)) }); es.addEventListener("announce", async (ev)=>{ const {announceId}=JSON.parse((ev as MessageEvent).data); const audio=new Audio(`/api/announce/${announceId}`); audio.volume=volume; await audio.play().catch(()=>{}) }); es.onerror=()=>{ setOffline(true); es?.close(); setTimeout(connect,retry); retry=Math.min(retry*2,15000) } }; connect(); return ()=>es?.close() },[volume])
const byBucket=useMemo(()=>{ const prep:BoardOrder[]=[]; const fin:BoardOrder[]=[]; for(const o of orders) (o.status==="Preparing"?prep:fin).push(o); return { prep: prep.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)), fin: fin.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)) } },[orders])
const mask=(o:BoardOrder)=> privacy==="order"? o.id.slice(-6): privacy==="masked"? o.displayName?.slice(0,1)+"•••" : o.displayName
return (<main className="min-h-screen bg-black text-white p-6"> {offline&&<div className="mb-4 rounded bg-red-600 px-4 py-2">Offline reconnecting…</div>} <header className="flex items-center justify-between mb-6"><h1 className="text-4xl font-bold">Pickup</h1><div className="flex gap-4 items-center"><label className="text-sm">Privacy</label><select className="bg-gray-800 p-2 rounded" value={privacy} onChange={e=>setPrivacy(e.target.value as any)}><option value="name">Names</option><option value="order">Order numbers</option><option value="masked">Masked</option></select><label className="text-sm">Volume</label><input type="range" min={0} max={1} step={0.1} value={volume} onChange={e=>setVolume(Number(e.target.value))} /></div></header><section className="grid grid-cols-1 md:grid-cols-2 gap-6"><Column title="Preparing" items={byBucket.prep} mask={mask} /><Column title="Finished" items={byBucket.fin} mask={mask} /></section></main>) }
function Column({ title, items, mask }:{ title:string; items:BoardOrder[]; mask:(o:BoardOrder)=>string }){ return (<div><h2 className="text-2xl font-semibold mb-3">{title}</h2><div className="grid gap-3">{items.map(o=>(<div key={`${o.locationId}-${o.id}`} className="rounded bg-gray-900 p-4"><div className="text-2xl font-bold">{mask(o)}</div><div className="text-sm text-gray-400">{o.lineItems.map(li=>`${li.quantity}× ${li.name}`).join(", ")}</div></div>))}{items.length===0&&<div className="text-gray-500">No items</div>}</div></div>) }
```

Local Quickstart
- Create Next app, add env, run dev; set Square Sandbox webhook for `order.fulfillment.updated` to your public `/api/square/webhook` URL and copy the signature key.
- Manual signature test:
```bash
BODY='{"merchant_id":"M","type":"order.fulfillment.updated","event_id":"evt_1","created_at":"2025-09-01T00:00:00Z","data":{"object":{"order_fulfillment_updated":{"order_id":"ORDER_ID_123","location_id":"LOC_1"}}}}'
SIG=$(node -e "const c=require('crypto');console.log(c.createHmac('sha256', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY).update(process.env.SQUARE_WEBHOOK_URL + process.argv[1]).digest('base64'))" "$BODY")
curl -s -X POST http://localhost:3000/api/square/webhook -H "x-square-hmacsha256-signature: $SIG" -H "content-type: application/json" --data-raw "$BODY"
```

v0 Platform API Tie‑In (Optional)
- Add an API route that forwards a single prompt to v0 to create a chat and deployment (mirror the v0 demo repo patterns).

Production Notes (Vercel/Next)
- Keep webhook and SSE on Node runtime; set SSE `maxDuration`; send `text/event-stream` with heartbeats. Next Route Handlers support streaming responses.

## Open Questions
- Which Stripe event types carry fulfillment change? Confirm payload shape.
- How long to display Finished orders (TTL)? Default suggestion: 10–15 minutes.
- SSE vs WebSocket for hosting environment; any preference?
- Any audio/visual cues for “Finished” events?
