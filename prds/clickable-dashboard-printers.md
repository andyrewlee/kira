# Clickable Prototype — Printers (Receipts + Labels)

- Goal: A fully clickable in-browser prototype that demonstrates the designer UX with real drag-and-drop using Fabric.js, Handlebars-style bindings against a local sample Order JSON, and PNG export — all in ephemeral state. No persistence, no Square calls.
- Constraints: Client-only, no localStorage, no backend. Everything resets on refresh.

## Repo Path Constraint
- Implement only in existing Next files under `app/dashboard/*`.
- Suggested paths: `app/dashboard/printers/page.tsx` and small helpers in `app/dashboard/printers/*.(ts|tsx)`.
- Do not add files outside `app/dashboard/` or modify global config.

## Tech (Prototype)
- Next.js App Router, client-only route for the editor
- Fabric.js for canvas + transforms (resize, rotate, move)
- Handlebars (runtime) for bindings (evaluate only in-memory)
- qrcode-svg (generate SVG path, then draw into Fabric via image/object)
- resvg-js (optional) or Fabric canvas.toDataURL for PNG export (OK for prototype)

## Visual Fidelity & Polish
- Paper frame: render a white paper with subtle drop shadow, showing printable width; annotate width in mm and px.
- Grid + rulers: toggle 8px grid; top/left rulers with px ticks and optional mm overlay; snapping to grid and edges.
- Smart guides: show alignment lines (center/edge) when moving/aligning elements; distance hints between objects.
- Keyboard: arrows to nudge 1px (Shift+arrows = 10px); Delete to remove; Cmd/Ctrl+C/V to duplicate; Cmd/Ctrl+G to group (visual only).
- Theme: dark UI chrome, light canvas; zoom controls (25%–200%) with pan by space+drag.
- Thermal preview: toggle “Monochrome” with threshold slider to simulate thermal receipts; preview dither (ordered) on images.
- Cut/peel marks (visual only): optional dashed line at the bottom for receipts; safe area outline for labels.

## Pages & Routes
- `app/printers/page.tsx` — editor shell

## UI Scope (Clickable)
- Paper presets dropdown: TM‑m30 58mm/80mm @203dpi, TM‑L100 40/58/80mm @203dpi, and Custom (width/height px fields)
- Toggle: Variable height (receipts) vs fixed (labels) — for prototype, just affects canvas height
- Elements toolbar: “+ Text”, “+ Image (URL)”, “+ QR”
- Properties panel (for selected element):
  - Position/size (x, y, w, h), rotation
  - Text: font family, size, weight, line-height, align, wrap on/off
  - Image: src URL (data URL okay), fit contain/cover, opacity
  - QR: data binding string, ECC level (M/Q/H), size
  - Binding: Handlebars expression editor (string), live preview beneath
- Data panel: textarea preloaded with local sample Square Order JSON (read-only example toggle available)
- Export: “Export PNG” button — uses `canvas.toDataURL('image/png')` and downloads

### Example Presets (203 dpi)
- TM‑m30 58mm → width ≈ 464px; 80mm → ≈ 640px; start with height 1200px and allow variable height toggle.
- TM‑L100 40mm → ≈ 320px; 58mm → ≈ 464px; 80mm → ≈ 640px; fixed height 320–1218px depending on demo.

## State Model (No Persistence)
- `paper: { presetId, widthPx, heightPx, variableHeight }`
- `elements: Array<{ id, type: 'text'|'image'|'qr', frame: {x,y,w,h,angle}, props: {...}, binding?: string }>`
- `data: { order: ... }` (from local sample)
- `selectionId?: string`

## Interactions
- Drag from toolbar to canvas creates an element centered in view
- Select element → resize/rotate/move via Fabric controls; arrow keys nudge
- Properties editing updates Fabric object live
- Binding preview: evaluate Handlebars with `data` and show rendered text under the input; for QR, bind data string and regenerate code
- Paper preset change → recalc canvas size; keep elements absolute positions
- Export PNG → uses Fabric `canvas.toDataURL` and downloads; no metadata

### Alignment & Snapping Details
- Snap to: grid (8px), paper edges, element centers/edges; show guides when snapping; snapping radius 6–8px.
- Distribute: quick buttons to distribute selected elements horizontally/vertically (visual only; no persistence needed).

## Sample Data (Inline)
- Bundle the small Square Order sample as a TS object and show it in the textarea; allow “Reset sample” to restore

## Handlebars (Prototype)
- Support simple paths like `{{order.id}}` and block `{{#each order.line_items}} ... {{/each}}` only for preview text; for prototype you can render first N items concatenated with newlines
- Helpers (string-only): `currency`, `upper`, `lower`

### Binding Examples
- Text element: `Order # {{order.id}}` → renders last 6 chars of the id for demo readability.
- Repeater (simple): first 5 items `{{#each order.line_items}} {{quantity}}× {{name}} — {{currency total_money}}\n{{/each}}`

## QR (Prototype)
- Use `qrcode-svg` to produce an SVG string for bound data (fallback to element text if binding empty); render as a Fabric image object via data URL

## Acceptance (Prototype)
- User can place/edit Text/Image/QR and see immediate visual updates
- Handlebars binding preview updates as data or binding changes
- Paper presets resize the canvas correctly (mm→px = `mm * 203 / 25.4`)
- Export PNG downloads an image matching the current canvas
- No network or persistence; refresh resets the prototype

## Dev Notes
- Keep everything in a single client component for speed
- Fabric object custom properties can hold `{ binding, kind, props }`
- Skip complex wrapping; basic word-wrap is enough for demo
 - If resvg-js isn’t available, PNG export via Fabric is fine for the demo.
