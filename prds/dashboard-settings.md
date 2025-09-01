
# Settings

- Status: Draft

## High-Level
- Primary purpose: connect your Square account and manage credentials/config shared across products.
- Stores `SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`, and optional per-location settings (e.g., hours overrides, reservation mappings).
- Provides a minimal admin UI to verify connection, test API calls, and surface basic org metadata.

## Repo Path Constraint
- Implement in existing Next files under `app/dashboard/*` only.
- Suggested paths: `app/dashboard/settings/page.tsx` and API handlers under `app/dashboard/settings/api/*.(ts)` if needed; keep all supporting code in `app/dashboard/settings/*`.
- Avoid changes outside `app/dashboard/` unless explicitly approved.

## What To Build
- Server-side OAuth (authorization code) flow for Square; secrets stay on the server.
- App Router API routes to start OAuth, handle callback, disconnect, and receive OAuth webhooks.
- Small React button that links users to start the flow.
- Server helpers to call Square using saved seller tokens, plus a refresh helper.

## Environment
- `SQUARE_ENV` (e.g., `sandbox` or `production`)
- `SQUARE_APP_ID`
- `SQUARE_APP_SECRET` (server-only)
- `SQUARE_REDIRECT_URL` (e.g., `https://your.app/api/square/oauth/callback`)
- `SQUARE_WEBHOOK_URL` (e.g., `https://your.app/api/square/webhooks`)
- `SQUARE_WEBHOOK_SIGNATURE_KEY`
- `SQUARE_API_VERSION=2025-08-20` (optional pin)
- `ENCRYPTION_KEY=32-byte-hex-or-base64` (for at-rest encryption; example only)

Notes
- Redirect URL must exactly match the Developer Console OAuth settings.
- Use HTTPS in production. Sandbox may allow localhost during development.
- Pin `Square-Version` or set a default version in Console.

## Folder Layout
- `app/api/square/oauth/start/route.ts`
- `app/api/square/oauth/callback/route.ts`
- `app/api/square/oauth/disconnect/route.ts`
- `app/api/square/webhooks/route.ts`
- `lib/squareConfig.ts`, `lib/tokens.ts`, `lib/crypto.ts`
- `components/ConnectSquareButton.tsx`

## Shared Helpers

`lib/squareConfig.ts`
```ts
export const SQUARE_ENV = process.env.SQUARE_ENV === 'production' ? 'production' : 'sandbox'
export const SQUARE_BASE = SQUARE_ENV === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
export const SQUARE_API_VERSION = process.env.SQUARE_API_VERSION || ''
export const SQUARE_APP_ID = process.env.SQUARE_APP_ID!
export const SQUARE_APP_SECRET = process.env.SQUARE_APP_SECRET!
export const SQUARE_REDIRECT_URL = process.env.SQUARE_REDIRECT_URL!
export const SQUARE_WEBHOOK_URL = process.env.SQUARE_WEBHOOK_URL!
export const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!
```

`lib/crypto.ts`
```ts
import { randomBytes, timingSafeEqual, createCipheriv, createDecipheriv } from 'crypto'

export function randomUrlSafeString(bytes = 32) { return randomBytes(bytes).toString('base64url') }
export function safeEqual(a: string, b: string) { const A=Buffer.from(a); const B=Buffer.from(b); return A.length===B.length && timingSafeEqual(A,B) }

const ENC_KEY = (() => { const raw = process.env.ENCRYPTION_KEY; if (!raw) return null; if (/^[A-Fa-f0-9]+$/.test(raw)) return Buffer.from(raw, 'hex'); return Buffer.from(raw, 'base64') })()

export function encrypt(text: string){ if (!ENC_KEY) return { iv:'', tag:'', data:text }; const iv=randomBytes(12); const cipher=createCipheriv('aes-256-gcm', ENC_KEY, iv); const data=Buffer.concat([cipher.update(text,'utf8'), cipher.final()]); const tag=cipher.getAuthTag(); return { iv:iv.toString('base64url'), tag:tag.toString('base64url'), data:data.toString('base64url') } }
export function decrypt(p:{iv:string;tag:string;data:string}){ if(!ENC_KEY) return p.data; const iv=Buffer.from(p.iv,'base64url'); const tag=Buffer.from(p.tag,'base64url'); const data=Buffer.from(p.data,'base64url'); const d=createDecipheriv('aes-256-gcm', ENC_KEY, iv); d.setAuthTag(tag); const out=Buffer.concat([d.update(data), d.final()]); return out.toString('utf8') }
```

`lib/tokens.ts`
```ts
type TokenRecord = {
  merchantId: string
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt?: string
  scope?: string
}

const memory = new Map<string, TokenRecord>() // key = yourUserId
export async function saveSquareTokens(userId: string, rec: TokenRecord){ memory.set(userId, rec) }
export async function readSquareTokens(userId: string){ return memory.get(userId) || null }
export async function deleteSquareTokens(userId: string){ memory.delete(userId) }
```

## Routes

`app/api/square/oauth/start/route.ts`
```ts
import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { SQUARE_APP_ID, SQUARE_BASE, SQUARE_REDIRECT_URL } from '@/lib/squareConfig'
import { randomUrlSafeString } from '@/lib/crypto'
export const runtime = 'nodejs'

const SCOPES = [ 'MERCHANT_PROFILE_READ', 'PAYMENTS_READ', 'PAYMENTS_WRITE' ].join(' ')

export async function GET(_: NextRequest) {
  const state = randomUrlSafeString(32)
  const jar = await cookies()
  jar.set('sq_state', state, { httpOnly:true, sameSite:'lax', secure: process.env.NODE_ENV==='production', path:'/', maxAge: 5*60 })
  const url = new URL('/oauth2/authorize', SQUARE_BASE)
  url.searchParams.set('client_id', SQUARE_APP_ID)
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('session', process.env.NODE_ENV==='production' ? 'false' : 'true')
  url.searchParams.set('state', state)
  url.searchParams.set('redirect_uri', SQUARE_REDIRECT_URL)
  return NextResponse.redirect(url.toString())
}
```

`app/api/square/oauth/callback/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SQUARE_APP_ID, SQUARE_APP_SECRET, SQUARE_BASE, SQUARE_API_VERSION } from '@/lib/squareConfig'
import { safeEqual } from '@/lib/crypto'
import { saveSquareTokens } from '@/lib/tokens'
export const runtime = 'nodejs'

function headers(){ const h:Record<string,string>={'Content-Type':'application/json'}; if (SQUARE_API_VERSION) h['Square-Version']=SQUARE_API_VERSION; return h }

export async function GET(req: NextRequest){
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  if (error) return NextResponse.redirect(`/integrations/square?error=${encodeURIComponent(error)}`)
  if (!code || !returnedState) return NextResponse.json({ error:'Missing code or state' }, { status:400 })
  const jar = await cookies(); const cookieState = jar.get('sq_state')?.value || ''
  if (!cookieState || !safeEqual(cookieState, returnedState)) return NextResponse.json({ error:'Invalid state' }, { status:400 })
  const resp = await fetch(`${SQUARE_BASE}/oauth2/token`, { method:'POST', headers: headers(), body: JSON.stringify({ client_id: SQUARE_APP_ID, client_secret: SQUARE_APP_SECRET, code, grant_type:'authorization_code' }) })
  if (!resp.ok){ const body = await resp.text(); return NextResponse.json({ error:'Token exchange failed', body }, { status:500 }) }
  const data = await resp.json()
  const { access_token, refresh_token, expires_at, merchant_id, refresh_token_expires_at } = data
  const userId = 'current-user-id' // replace with real user id
  await saveSquareTokens(userId, { merchantId: merchant_id, accessToken: access_token, refreshToken: refresh_token, accessTokenExpiresAt: expires_at, refreshTokenExpiresAt: refresh_token_expires_at })
  jar.set('sq_state', '', { maxAge: 0, path: '/' })
  return NextResponse.redirect('/integrations/square?connected=1')
}
```

`app/api/square/oauth/disconnect/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { SQUARE_APP_ID, SQUARE_APP_SECRET, SQUARE_BASE, SQUARE_API_VERSION } from '@/lib/squareConfig'
import { readSquareTokens, deleteSquareTokens } from '@/lib/tokens'
export const runtime = 'nodejs'

function headers(){ const h:Record<string,string>={ 'Content-Type':'application/json', 'Authorization': `Client ${SQUARE_APP_SECRET}` }; if (SQUARE_API_VERSION) h['Square-Version']=SQUARE_API_VERSION; return h }

export async function POST(_: NextRequest){
  const userId = 'current-user-id'
  const rec = await readSquareTokens(userId)
  if (!rec) return NextResponse.json({ ok:true })
  const resp = await fetch(`${SQUARE_BASE}/oauth2/revoke`, { method:'POST', headers: headers(), body: JSON.stringify({ client_id: SQUARE_APP_ID, access_token: rec.accessToken, revoke_only_access_token: false }) })
  await deleteSquareTokens(userId)
  if (!resp.ok){ const body = await resp.text(); return NextResponse.json({ ok:false, body }, { status:500 }) }
  return NextResponse.json({ ok:true })
}
```

`app/api/square/webhooks/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { WebhooksHelper } from 'square'
import { SQUARE_WEBHOOK_SIGNATURE_KEY, SQUARE_WEBHOOK_URL } from '@/lib/squareConfig'
import { deleteSquareTokens } from '@/lib/tokens'
export const runtime = 'nodejs'

export async function POST(req: NextRequest){
  const signature = req.headers.get('x-square-hmacsha256-signature') || ''
  const bodyText = await req.text()
  const ok = await WebhooksHelper.verifySignature({ requestBody: bodyText, signatureHeader: signature, signatureKey: SQUARE_WEBHOOK_SIGNATURE_KEY, notificationUrl: SQUARE_WEBHOOK_URL })
  if (!ok) return NextResponse.json({ error:'bad signature' }, { status:401 })
  const event = JSON.parse(bodyText)
  if (event?.type === 'oauth.authorization.revoked'){
    const userId = 'current-user-id-by-merchant' // look up via merchant_id mapping
    await deleteSquareTokens(userId)
  }
  return NextResponse.json({ ok:true })
}
```

## UI Component

`components/ConnectSquareButton.tsx`
```tsx
export function ConnectSquareButton(){
  return (
    <a href="/api/square/oauth/start" aria-label="Connect Square">
      <button type="button">Connect Square</button>
    </a>
  )
}
```

## Example Square API Call

`lib/squareClient.ts`
```ts
import { SquareClient, SquareEnvironment } from 'square'
import { readSquareTokens } from './tokens'
import { SQUARE_ENV } from './squareConfig'

export async function squareClientFor(userId: string){
  const rec = await readSquareTokens(userId)
  if (!rec) throw new Error('Not connected to Square')
  return new SquareClient({ token: rec.accessToken, environment: SQUARE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox })
}
```

Usage inside a route handler
```ts
import { NextResponse } from 'next/server'
import { squareClientFor } from '@/lib/squareClient'
export async function GET(){ const userId='current-user-id'; const client=await squareClientFor(userId); const res=await client.locations.list(); return NextResponse.json(res) }
```

## Refresh Helper (Optional)
```ts
// lib/refreshSquare.ts
import { SQUARE_APP_ID, SQUARE_APP_SECRET, SQUARE_BASE, SQUARE_API_VERSION } from '@/lib/squareConfig'
import { readSquareTokens, saveSquareTokens } from '@/lib/tokens'
function headers(){ const h:Record<string,string>={'Content-Type':'application/json'}; if (SQUARE_API_VERSION) h['Square-Version']=SQUARE_API_VERSION; return h }
export async function refreshSquareIfNeeded(userId: string){
  const rec = await readSquareTokens(userId); if (!rec) return
  const expires = new Date(rec.accessTokenExpiresAt).getTime(); const now = Date.now()
  const shouldRefresh = now > expires - 23*24*60*60*1000
  if (!shouldRefresh) return
  const resp = await fetch(`${SQUARE_BASE}/oauth2/token`, { method:'POST', headers: headers(), body: JSON.stringify({ client_id: SQUARE_APP_ID, client_secret: SQUARE_APP_SECRET, grant_type:'refresh_token', refresh_token: rec.refreshToken }) })
  if (!resp.ok) throw new Error('Square refresh failed')
  const data = await resp.json()
  await saveSquareTokens(userId, { ...rec, accessToken: data.access_token, accessTokenExpiresAt: data.expires_at, refreshToken: data.refresh_token || rec.refreshToken, refreshTokenExpiresAt: data.refresh_token_expires_at || rec.refreshTokenExpiresAt })
}
```

## Next.js Specifics
- Use Node runtime for these routes to access Node crypto and libraries.
- Use `cookies()` from `next/headers` to set an HttpOnly state cookie.
- Use `NextResponse.redirect` to send users to Square; ensure redirect URL matches Console.

## Test Plan
- In Sandbox, configure redirect URL and scopes in Console; use Sandbox host `connect.squareupsandbox.com`.
- Visit `/api/square/oauth/start`, sign in as a Sandbox seller, and confirm redirect back with `connected=1`.
- Call a simple Locations route to validate the token.
- Disconnect from seller dashboard or POST to our disconnect route; observe `oauth.authorization.revoked` webhook (if configured).

## Production Checklist
- Set `session=false` in start route for production to force account selection.
- Refresh tokens proactively (e.g., weekly) before the 30‑day access token expiry.
- Store tokens encrypted; never expose secrets or tokens in client code/logs.
- Pin Square API version for explicit change control.

## PKCE Variant (If Needed)
- For public clients, add `code_challenge` to authorize; send `code_verifier` during token exchange. PKCE refresh tokens are single-use and expire in ~90 days. Prefer code flow for server apps.

## Rationale
- Authorization code flow keeps secrets server-side and follows Square’s OAuth guidance for web apps.
- `session=false` prevents silent selection of the wrong seller account in production.
- Webhook verification uses official header and raw-body validation.
