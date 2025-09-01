# Printers (Receipts + Labels)

- Status: Draft
- Owner: TBD
- Last Updated: 2025-09-01
- Models: Epson TM-m30 family (receipts) and Epson TM-L100 (labels)

## Overview
A simple designer that lets a user drag and drop elements onto a paper or label canvas, bind fields from a Square Order payload using Handlebars templates, and render the final layout and data into a deterministic PNG. A single designer and renderer supports both receipts and labels. Users select the printer (TM‑m30 family or TM‑L100) and the intended use (receipt or label).

## Tech Stack (open source)
- Editor canvas: Fabric.js in a client‑only Next.js route for selection, transform, and object management.
- State and schema: Zustand or Redux (optional) and Zod for schema validation (optional).
- Collaboration (optional): Yjs or Automerge for multi‑user editing.
- Templating: Handlebars with helpers (currency, date, upper, lower, default).
- QR: `qrcode-svg` or `qrcode` for crisp vector output.
- Final render: Build a pure SVG scene graph from the layout and data, then rasterize to PNG with `@resvg/resvg-js` for deterministic, font‑correct output (browser or server).

## Goals & Success Criteria
- Designer lets users place Text, Image, and QR elements; rotate and size them.
- Handlebars templating binds to Square Order JSON with live preview.
- Rules allow filtering specific items (prep stations) via accepted products, categories, or exclusion.
- Renderer produces a PNG image at selected DPI with correct wrapping, alignment, and sizing.
- Paper size controls: fixed height (labels) or variable height (receipts); width by printer preset or custom.

## Scope (v1)
- Components: Text, Image (upload or AI‑generate), QR.
- Data: Square Order payload as `order` root; Handlebars expressions (simple helpers allowed).
- Rules: Item filtering via accepted products, accepted categories, and exclusions.
- Canvas: Drag, resize, rotate; grid and snapping; configurable width and height; fixed or variable height.
- Output: Deterministic PNG suitable for TM‑m30 and TM‑L100.
- Preview: Live render using a sample Square Order payload.

## Non-Goals (v1)
- Rich tables beyond a simple repeater for `order.line_items`.
- Advanced layout (auto-flow, pagination), arbitrary ESC/POS/ZPL command generation.
- Complex conditionals/expressions beyond simple Handlebars + helpers.

## Printer Presets
- TM‑m30 (receipts): width presets 58 mm and 80 mm at ~203 dpi; variable height enabled by default. Pixel width = `width_mm * dpi / 25.4`.
- TM‑L100 (labels): common media widths 40 mm, 58 mm, 80 mm at 203 dpi; fixed height by default, orientation configurable. Same mm→px formula; allow custom size.

## Data & Templating
- Context: Root object is `order` (Square Order schema). Example fields: `order.id`, `order.line_items`, `order.total_money.amount`.
- Handlebars: `{{order.id}}`, `{{currency order.total_money}}`, `{{#each order.line_items}} … {{/each}}`.
- Helpers (v1): `currency`, `date`, `upper`, `lower`, `default`.
- Missing fields: render as empty strings and surface a non‑blocking warning.

## Rules (Prep Stations)
- Keep it simple: three optional lists evaluated against each `line_item`:
  - `accepted_products`: array of product names or IDs to include.
  - `accepted_categories`: array of category names/IDs to include.
  - `exclude`: array of product names/IDs to always exclude.
- Evaluation order: exclude → accepted_products → accepted_categories. If both accepted lists empty, include all except excluded. If any accepted list is non-empty, include only matches not excluded.
- Rules apply to repeaters and can also toggle visibility of an element group.

## Designer Canvas UI (Fabric.js)
- Canvas: Pan/zoom; grid and snapping; optional rulers; units in pixels derived from DPI; optional millimeter readout.
- Elements: Text, Image, QR; resize; rotate 0–360°; align; z‑order; lock/hide; copy/paste; undo/redo.
- Properties panel:
  - Position/size (x, y, w, h) and rotation.
  - Text: font family/size/weight, line height, alignment, wrapping, letter spacing.
  - Image: fit (contain/cover), opacity, optional 1‑bit dither for thermal.
  - QR: data binding, ECC level (M/Q/H), size, quiet zone (SVG paths).
  - Binding: Handlebars editor with validation and inline preview.
  - Rules: optional prep‑station rule set for repeaters/groups.
- Page setup: select printer (TM‑m30 / TM‑L100), DPI, width_mm/height_mm or presets, variable height toggle, orientation (0/90/180/270).
- Preview: load a sample Square payload; live render; show warnings for missing bindings and overflow.

## Rendering Engine
- Input: `{ layout, data: { order }, options: { dpi, color_mode, variable_height } }`.
- Pipeline:
  1) Parse layout JSON
  2) Resolve Handlebars bindings and helpers
  3) Build a pure SVG scene in absolute pixel units at the chosen DPI
  4) Rasterize to PNG with `resvg-js` in the browser (or on the server for batch)
- Text: emit SVG text with embedded font faces; wrap via `<tspan>` and `textLength`, with safe fallbacks.
- Images: reference uploaded assets by `href`; optional one‑bit ordered dither for thermal receipts.
- QR: generate SVG paths using `qrcode-svg`/`qrcode`; keep modules crisp at size; configurable ECC and quiet zones.
- Variable height (receipts): compute natural SVG height before rasterization and clamp between min/max bounds.
- Determinism: lock font files and feature flags; seed dithering; maintain golden‑image tests.

## Printing Integration (minimal v1)
- Output a PNG for both printers.
- Printing path remains out‑of‑process (browser print, QZ Tray, WebUSB/WebHID, or a small local agent).
- Ensure correct DPI and margins.
- Future: auto‑cut and drawer kick for TM‑m30; label calibration for TM‑L100.

## AI Image Generation (optional)
- Provider: FAL “nano banana”. UI accepts prompt, seed, size. Generate, store asset, and reference in layout.
- Guardrails: prompt length limits, rate limiting, content policy hooks.

## Storage & Versioning
- Templates: JSON schema with version, name, printer_preset, last_modified, created_by.
- Assets: image uploads and AI outputs saved via signed URLs; cache headers; dedupe by hash.
- Versioning: draft/publish, rollback; audit log (who/when/what changed).

## API
- `POST /render`: `{ layout, data: { order }, options }` → `{ png: <bytes>, width_px, height_px, dpi, warnings }`.
- `GET /templates/:id` and `PUT /templates/:id` for CRUD; asset upload endpoints with signed URL handshake.

## Sample Handlebars Snippets
- Order ID: `{{order.id}}`
- Total (currency): `{{currency order.total_money}}`
- Line items (simple repeater):
  - Template: `{{#each order.line_items}} {{quantity}}× {{name}} — {{currency total_money}} {{/each}}`
- QR data (embed order ID): `{{order.id}}`

## Sample Preview Payload (Square Order)
- Use a small, representative JSON object for on-canvas preview; store multiple fixtures (small, many items, discounts).

## TODOs

### Phase 0 — Discovery & Presets
- Confirm exact Square Order fields used; lock preview fixtures (small/heavy/discounts).
- Ship presets for TM‑m30 (58 mm, 80 mm @203 dpi) and TM‑L100 (40/58/80 mm @203 dpi) with pixel widths `mm * dpi / 25.4`.
- Decide Handlebars helper set and formatting rules (currency/date/upper/lower/default).

### Phase 1 — Layout Schema & Rules
- Define `Layout` JSON: page settings, element list (type, frame, rotation, props, binding), optional groups, and simple repeater for `order.line_items`.
- Implement rules model: `accepted_products`, `accepted_categories`, `exclude` with clear evaluation order.
- Write schema validation and migration (versioned templates).

### Phase 2 — Designer UI (MVP)
- Build the editor with Fabric.js in a client‑only Next.js route.
- Implement grid, snap, optional rulers, alignment guides, selection, and transform handles.
- Properties panel for Text, Image, and QR with a Handlebars binding editor and live validation.
- Page setup for printer select, DPI, size presets, variable height, and orientation.
- Repeater configuration for `order.line_items` with rule filters.
- Live preview using sample payloads and a warnings panel.

### Phase 3 — Renderer
- Build SVG generator and PNG raster path with `resvg-js`.
- Add QR as SVG paths, image caching, optional 1-bit dither.
- Auto-size receipts (variable height) and clamp.
- Golden-image tests for fixtures (SVG→PNG).

### Phase 4 — Assets & AI (Optional)
- Upload flow with signed URLs; asset manager in designer.
- Optional AI image generation later (not required for v1).

### Phase 5 — Print Path & Calibration
- Provide download/print flows; QZ Tray/WebUSB integration stubs.
- Add calibration test prints for width, margins, density.

### Phase 6 — QA & Docs
- Test many items, long names, discounts, missing fields.
- Cross-DPI checks (203, future 300) and both printer presets & orientations.
- Author setup and troubleshooting docs; template examples.

## Acceptance Criteria (v1)
- Designer supports Text, Image, and QR with rotation and resize; page size can be variable or fixed.
- Handlebars bindings resolve against the Square Order payload with non‑blocking warnings on missing fields.
- Repeater renders `order.line_items` and applies accepted products/categories and exclusions correctly.
- Preview matches exported PNG within 1px/1% tolerance; PNG dimensions match DPI and page settings.
- Selecting TM‑m30 or TM‑L100 applies correct presets and renders without clipping.

## Open Questions
- Handlebars helper set finalization and i18n for currency/date.

## High-Level summary
- Drag‑and‑drop designer powered by Handlebars over Square Order JSON.
- Unified for receipts and labels with Epson TM‑m30 and TM‑L100 presets.
- Core focus: reliable, deterministic PNG output for printing.

If you want, I can also add a Fabric.js ↔ Layout JSON mapping table (Text, Image, QR) to make wiring the editor to the renderer straightforward.
