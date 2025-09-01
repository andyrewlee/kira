# Printers — Receipts + Labels (Entire Order & Per Item)

## Hero
- Headline: Design receipts and labels customers remember
- Subhead: Turn every print into a branded, useful touchpoint. Print the entire order on one slip or one label per item—add logos, images, and QR/barcodes powered by live Square data.
- Primary CTA: Get a free demo → `/demo`
- Secondary CTA: See pricing → `/pricing`

## Visuals (above the fold)
- Receipt strip: Boutique/cafe styled receipt with logo, totals, dotted rules, QR “Scan for rewards”.
- Label grid: 3 item labels (drink, food, retail) with clear modifiers and optional barcode/QR.
- Quick note row: “Works with your Square data · No POS swap · Minutes to set up”.

## Design Direction
- Layout: plenty of white space; alternate wide text blocks with dense visual grids.
- Typography: big `Geist Mono` headlines and section labels; `Geist` for body; playful uppercase micro‑labels.
- Shapes: bordered cards with black 2px outlines and chunky offset shadows (`shadow-[8px_8px_0_0_#000]`).
- Motifs: receipt perforation strips, dashed rules, QR placeholders, ticket corners.
- Rhythm: Section spacing 64–96px; inside cards 16–24px; consistent 4/8px increments.
- Interaction: subtle hover lift and underline reveals; keep motion minimal and snappy.

## Outcomes (value pillars)
- Less chaos: Clear tickets reduce remake errors and speed up lines.
- On-brand: Type, spacing, images, and rules that look like you.
- Drive actions: QR to loyalty, menus, order status, reviews, or automations.
- Instant updates: Push new designs in seconds—no downtime.

## Use Cases
- Cafes & boba: Per-item labels that surface modifiers; entire-order stickers for bags.
- Quick-serve kitchen: Prep-station filters by category or item; big order numbers.
- Retail & packaging: Price/sku labels, shipping labels, shelf tags, care instructions.
- Events & pop-ups: Seasonal designs, sponsor logos, and one-tap follow links.
- Fulfillment & lockers: Barcodes/QR for scanners or auto machines pairing.

## Features
- Unified designer: One canvas for both scopes—Entire Order (receipt-size) and Per Item (label-size).
- Drag & drop elements: Text, Image, QR/barcode; rotate, size, align, snap, undo/redo.
- Live data bindings: Handlebars over Square Order JSON with helpers (currency, date, upper, lower, default).
- Smart rules: Include/exclude by products or categories for per-station prints.
- Printer presets: Epson TM‑m30 58/80mm and TM‑L100 40/58/80mm at 203 dpi; custom sizes supported.
- Branded look: Fonts, spacing, dotted rules, lockups, and seasonal variants.
- Templates: Start fast with “Big Order Number”, “Cafe Label”, “Price Tag”, “Shipping 4×6”.
- Deterministic output: Pixel-perfect SVG→PNG render, crisp text and QR at the right DPI.

## QR / Barcode Ideas
- Loyalty: Send customers to “Join in 10 seconds”.
- Menus & reorders: Seasonal menus; reorder links for packaged goods.
- Order status: Link to live order tracking or pickup instructions.
- Automations: Barcodes/QR for scanners and auto machines to route items.

## How It Works
- Connect Square and approve Orders, Webhooks, and Catalog.
- Pick a scope (Entire Order or Per Item) and a starter template.
- Bind fields from the sample order (total, line items, pickup notes, etc.).
- Print a test; push live—printers auto‑pull the latest design.



## FAQs
- Which printers are supported? Epson TM‑m30 for receipts and TM‑L100 for labels; others coming. Ask about your model.
- Can I use a label printer for receipts (and vice‑versa)? Yes—choose Entire Order or Per Item and set the size you need.
- Do I need to switch POS? No—Kira reads your Square orders and formats the print.
- How long does setup take? Minutes. Connect, choose a template, print a test.

## Technical Notes (footnote style)
- 203 dpi presets with mm→px conversion; variable height for receipts.
- PNG output for both printer paths; QR generated as clean vector before rasterization.

## CTA (bottom)
- Primary: Get a free demo → `/demo`
- Secondary: See pricing → `/pricing`

## SEO
- Title: Printers for Square — Custom Receipts and Labels with QR/Barcodes
- Meta: Design receipts and per‑item labels that match your brand. Powered by live Square data, with QR/barcodes for loyalty, menus, status, and automations.
