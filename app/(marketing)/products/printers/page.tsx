"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function PrintersPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero split with receipt collage */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Printers</div>
            <h1 className="mt-2 font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">Design receipts and labels customers remember</h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg">Turn every print into a branded, useful touchpoint. Print the entire order on one slip or one label per item—add images and QR/barcodes powered by live Square data.</p>
            <div className="mt-8 flex gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            <ReceiptCafe />
            <ReceiptBoutique />
          </div>
        </section>

        <Perforation />

        {/* Entire order vs Per item (rule-only) */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Entire order</div>
            <p className="mt-2 text-base leading-7">Print the whole order on one slip—attach to bags or hand to customers. Customize items, modifiers, notes, fulfillment details, logos, dotted rules, and big order numbers.</p>
            <div className="mt-3 h-[2px] bg-black w-24" />
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Per item</div>
            <p className="mt-2 text-base leading-7">One label per item; surface modifiers clearly. Ideal for cafes, boba, retail, and fulfillment. Add QR/barcodes for scanners and automations.</p>
            <div className="mt-3 h-[2px] bg-black w-24" />
          </div>
        </section>

        {/* Label gallery */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <LabelShipping />
          <LabelPriceTag />
          <LabelShelf />
          <LabelCoffeeBag />
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Connect", d: "Approve Orders, Catalog, Webhooks." },
            { n: "02", t: "Choose scope", d: "Entire order (receipt) or per item (label)." },
            { n: "03", t: "Design", d: "Drag Text/Image/QR; bind to order fields." },
            { n: "04", t: "Print", d: "Test, then go live—devices pull the latest design." },
          ].map((s) => (
            <div key={s.n} className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-3xl">{s.n}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em]">{s.t}</div>
              <p className="mt-2 text-sm leading-6">{s.d}</p>
            </div>
          ))}
        </section>

        {/* QR ideas */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">QR / barcode ideas</div>
          <dl className="mt-4 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Loyalty", d: "Send customers to join in seconds." },
              { t: "Menus & reorders", d: "Seasonal menus or reorder links for packaged goods." },
              { t: "Order status", d: "Link to live order tracking or pickup instructions." },
              { t: "Automations", d: "Barcodes/QR for machines and scanners to route items." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Presets & templates chips */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Presets & templates</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["TM‑m30 58mm","TM‑m30 80mm","TM‑L100 40mm","TM‑L100 58mm","TM‑L100 80mm","Big order number","Cafe label","Price tag","Shipping 4×6"].map((c) => (
              <span key={c} className="inline-flex items-center border-2 border-black px-2 py-1 bg-white">{c}</span>
            ))}
          </div>
        </section>

        {/* Full‑bleed callout */}
        <section className="mt-14 bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 py-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">On‑brand prints</div>
            <h3 className="mt-2 font-mono text-3xl sm:text-4xl leading-[0.95] tracking-tight">Receipts and labels your customers actually remember</h3>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">Type, spacing, rules, images, and QR/barcodes—updated instantly across devices.</p>
          </div>
        </section>

        {/* FAQ + CTA */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
            <div className="mt-3 grid grid-cols-1 gap-6">
              <Faq q="Which printers are supported?" a="Common thermal receipt and label printers used with Square. Tell us your model if unsure." />
              <Faq q="Can I include QR/barcodes?" a="Yes—QR for menus/loyalty/status; barcodes for scanners and automations." />
              <Faq q="How long does setup take?" a="Usually minutes—connect Square, pick a template, print a test, and go live." />
            </div>
          </div>
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Design your templates and print a test</div>
            </div>
            <div className="flex gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="border-2 border-black bg-white p-4">
      <div className="font-mono text-xs uppercase tracking-[0.25em] mb-3">{title}</div>
      <div className="mx-auto w-full max-w-sm bg-white border-2 border-black rounded-sm shadow-[8px_8px_0_0_#000] p-6 font-mono">
        {children}
      </div>
    </div>
  );
}

function ReceiptCafe() {
  return (
    <Card title="Cafe receipt">
      <div className="text-center text-sm tracking-widest uppercase">KIRA COFFEE</div>
      <div className="mt-1 text-center text-[10px] tracking-widest">123 MAIN ST · NYC</div>
      <div className="mt-4 border-t border-dashed border-black" />
      <div className="mt-4 flex justify-between text-sm"><span>Americano</span><span>$3.50</span></div>
      <div className="mt-1 flex justify-between text-sm"><span>Croissant</span><span>$3.25</span></div>
      <div className="mt-4 border-t border-dashed border-black" />
      <div className="mt-3 flex justify-between text-sm font-bold"><span>Total</span><span>$6.75</span></div>
      <div className="mt-6 grid grid-cols-3 gap-3 items-center">
        <div className="col-span-2 text-[10px] leading-4">Scan for rewards + menu</div>
        <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
      </div>
      <div className="mt-6 border-t border-dashed border-black" />
      <div className="mt-3 text-center text-[10px] tracking-widest">THANK YOU</div>
    </Card>
  );
}

function ReceiptBoutique() {
  return (
    <Card title="Boutique receipt">
      <div className="text-center text-base tracking-[0.35em] uppercase">KIRA BOUTIQUE</div>
      <div className="mt-3 text-[10px]">Order #004291 — 2025-08-30</div>
      <div className="mt-2 border-t border-dashed border-black" />
      <div className="mt-3 text-[10px]">1 × Linen Shirt — M</div>
      <div className="text-[10px]">1 × Wide-Leg Pant — 30</div>
      <div className="mt-2 border-t border-dashed border-black" />
      <div className="mt-2 flex justify-between text-sm font-bold"><span>Subtotal</span><span>$148.00</span></div>
      <div className="flex justify-between text-sm"><span>Tax</span><span>$13.32</span></div>
      <div className="flex justify-between text-sm font-bold"><span>Total</span><span>$161.32</span></div>
      <div className="mt-4 h-10 bg-[repeating-linear-gradient(90deg,_#000,_#000_8px,_transparent_8px,_transparent_16px)]" />
      <div className="mt-2 text-center text-[10px] tracking-widest">EXCHANGE WITHIN 30 DAYS</div>
    </Card>
  );
}

function LabelShipping() {
  return (
    <Card title="4×6 shipping label">
      <div className="grid grid-cols-3 gap-2 text-[10px] leading-4">
        <div className="col-span-2">
          <div className="font-bold">From</div>
          <div>Kira Fulfillment</div>
          <div>100 Print Way</div>
          <div>New York, NY 10001</div>
        </div>
        <div>
          <div className="font-bold">To</div>
          <div>Alex Lee</div>
          <div>42 Orchard St</div>
          <div>San Francisco, CA 94110</div>
        </div>
      </div>
      <div className="mt-3 h-14 bg-[repeating-linear-gradient(90deg,_#000,_#000_2px,_transparent_2px,_transparent_6px)]" />
      <div className="mt-2 text-center text-[10px]">TRACKING: 1Z 999 999 99 9999</div>
    </Card>
  );
}

function LabelPriceTag() {
  return (
    <Card title="Price tag label">
      <div className="text-center">
        <div className="font-mono tracking-widest text-xs">KIRA STUDIO</div>
        <div className="mt-1 text-3xl font-mono">$48</div>
        <div className="mt-1 text-[10px]">Linen Hand Towel · Sand</div>
      </div>
      <div className="mt-3 h-9 bg-[repeating-linear-gradient(90deg,_#000,_#000_6px,_transparent_6px,_transparent_12px)]" />
    </Card>
  );
}

function LabelShelf() {
  return (
    <Card title="Shelf label">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-sm">Blueberries 6oz</div>
        <div className="font-mono text-2xl">$3.99</div>
      </div>
      <div className="mt-2 text-[10px]">Origin: Maine · Organic</div>
      <div className="mt-3 grid grid-cols-3 gap-3 items-center">
        <div className="col-span-2 text-[10px] leading-4">Scan for recipe ideas</div>
        <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
      </div>
    </Card>
  );
}

function LabelCoffeeBag() {
  return (
    <Card title="Coffee bag label">
      <div className="text-center">
        <div className="tracking-[0.4em] uppercase text-xs">Kira Coffee</div>
        <div className="mt-1 font-mono text-xl">Ethiopia Yirgacheffe</div>
        <div className="mt-1 text-[10px]">Notes: Bergamot · Peach · Floral</div>
      </div>
      <div className="mt-3 border-t border-dashed border-black" />
      <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
        <div>
          <div className="font-bold">Process</div>
          <div>Washed</div>
        </div>
        <div>
          <div className="font-bold">Roast</div>
          <div>Light</div>
        </div>
        <div>
          <div className="font-bold">Weight</div>
          <div>12 oz</div>
        </div>
      </div>
    </Card>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <div className="font-medium">{q}</div>
      <p className="mt-1 text-sm leading-6">{a}</p>
      <div className="mt-3 h-[2px] bg-black w-24" />
    </div>
  );
}

function Perforation() {
  return (
    <div
      className="mx-auto max-w-6xl mt-14 h-[10px] w-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] [background-size:8px_8px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-50"
      aria-hidden="true"
    />
  );
}
