# Clickable Prototype — Custom Website

- Goal: A browsable, no-backend demo of the multi‑location marketing site: Home, Locations list with client search, Location detail with JSON‑LD embed, About, Contact — all backed by local fixtures. No Square.
- Constraints: Static data modules only, React state for search, no persistence.

## Tech (Prototype)
- Next.js App Router
- Static TS/JSON fixtures for locations and hours
 - Minimal CSS: system fonts, light/dark theme toggle

## Pages & Files
- `app/layout.tsx` — minimal shell, title from `NEXT_PUBLIC_SITE_NAME` or fallback
- `app/page.tsx` — hero with CTA to `/locations`
- `app/locations/page.tsx` — lists locations from a local fixture; includes client search input
- `app/locations/[id]/page.tsx` — detail view using local fixture; renders JSON‑LD LocalBusiness via `<script type="application/ld+json">`
- `app/(marketing)/about/page.tsx`, `app/(marketing)/contact/page.tsx` — static
- `components/LocationsList.tsx` — client component for filtering
- `fixtures/locations.ts` — array of 3–5 mock locations (id, name, address, phone, coords, hours, timezone)
- `fixtures/hours.ts` — per‑location weekly schedules
 - `fixtures/marketing.ts` — hero strings and links; brand color

## UI Scope
- Home: title/subtitle/CTA (strings in a local `fixtures/marketing.ts`)
- Locations: search by name/city/region; each item links to detail
- Detail: show address, phone, Google Maps link if coords present; “Open now” computed with timezone + weekly hours
- SEO: inject JSON‑LD (LocalBusiness) using fixture fields
 - Header/footer: simple nav (Home, Locations, About, Contact); sticky header
 - Card visuals: small logo/photo placeholder per location; status chip (Open/Closed) with color
 - Map placeholder: small static map tile image or empty bordered box with “Map coming soon”
 - Skeletons: fake loading skeletons on initial navigation (setTimeout) to mimic SSR/ISR delay

## State Model
- `query: string` for search
- Everything else is derived from static fixtures by route segment

## Acceptance (Prototype)
- Stakeholder can navigate Home → Locations → Location and see realistic content
- Search filters client‑side only
- JSON‑LD script is visible in page source (devtools) with correct fields
- No network; refresh preserves only what the router re-renders from fixtures
 - Visual styling feels close to production: consistent spacing, readable typography, responsive layout

## Dev Notes
- Keep styles minimal (system fonts); focus on flow, not polish
- Provide 3 sample locations with different timezones to demonstrate “Open now” logic
 - Use a small function to format addresses consistently across list/detail
