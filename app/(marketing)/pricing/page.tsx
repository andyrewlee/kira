"use client";

import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 text-center">
          <h1 className="font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">One simple price. Month‑to‑month.</h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg">Pick the tools you need—or bundle everything. No long‑term contracts. Cancel anytime.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
            <Link href="/products" className="px-4 py-2 border-2 border-black bg-white text-black">See products</Link>
          </div>
        </section>

        <Perforation />

        {/* Bundle vs A‑la‑carte bands */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 border-2 border-black p-6 bg-white shadow-[8px_8px_0_0_#000]">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Kira Suite · per location</div>
            <div className="mt-2 flex items-end gap-2">
              <div className="font-mono text-5xl">$299</div>
              <div className="text-sm">/mo</div>
            </div>
            <ul className="mt-3 text-base leading-7 list-disc pl-5">
              <li>Printers: entire order + per‑item designer with templates and QR/barcodes</li>
              <li>Pickup Screen: live board with privacy modes and voice callouts</li>
              <li>Custom Website: fast, accurate pages grounded in Square</li>
              <li>Phone Agent: natural voice answers; telephony billed at provider cost</li>
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">A‑la‑carte · per location</div>
            <dl className="mt-3 divide-y-2 divide-dashed divide-black/50">
              {[
                { t: "Printers", p: "$69/mo", d: "Entire order + per‑item designer with templates and QR/barcodes" },
                { t: "Pickup Screen", p: "$49/mo", d: "Unlimited screens; privacy modes; voice callouts" },
                { t: "Custom Website", p: "$129/mo", d: "Generated pages (Home, Menu, Locations, FAQs) with structured data" },
                { t: "Phone Agent", p: "$199/mo", d: "Live answers; transcripts; telephony at cost" },
              ].map((x) => (
                <div key={x.t} className="grid grid-cols-12 gap-3 py-3">
                  <dt className="col-span-6 md:col-span-5 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                  <dd className="col-span-3 md:col-span-2 font-mono">{x.p}</dd>
                  <dd className="col-span-12 md:col-span-5 text-sm leading-6">{x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Hardware at cost strip */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Hardware (buy once at cost)</div>
              <p className="mt-2 text-sm">Buy direct or through us at cost. We’ll share a compatibility list and recommended paper/labels.</p>
            </div>
            <div className="border-2 border-black p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Label printer</div>
              <div className="mt-2 font-mono text-4xl">$600</div>
              <div className="text-xs">Epson TM‑L100</div>
            </div>
            <div className="border-2 border-black p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Receipt printer</div>
              <div className="mt-2 font-mono text-4xl">$400</div>
              <div className="text-xs">Epson TM‑m30III</div>
            </div>
          </div>
        </section>

        {/* ROI ideas (rule-only) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Why it pays for itself</div>
          <dl className="mt-3 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Fewer remakes", d: "Clear labels/tickets cut mistakes." },
              { t: "Faster pickups", d: "Guests see when to step up." },
              { t: "More direct sales", d: "Accurate site + phone answers bring customers to you." },
              { t: "Less distraction", d: "Staff spend more time serving guests." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Feature matrix (rules only) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">What’s included</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { h: "Printers", i: ["Entire order & per‑item", "Templates", "Images & QR/barcodes"] },
              { h: "Pickup Screen", i: ["Preparing/Finished", "Privacy modes", "Voice callouts"] },
              { h: "Custom Website", i: ["Home/Menu/Locations", "Structured data", "Fast pages"] },
              { h: "Phone Agent", i: ["Live answers", "Transcripts", "Handoffs"] },
            ].map((col) => (
              <div key={col.h}>
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{col.h}</div>
                <ul className="mt-2 text-sm leading-6">
                  {col.i.map((s) => (
                    <li key={s} className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Faq q="Contracts?" a="All plans are month‑to‑month; cancel anytime." />
            <Faq q="Printers?" a="Hardware is purchased once, at cost; software is monthly." />
            <Faq q="Locations?" a="Pricing is per location; discounts for 3+ locations." />
            <Faq q="Telephony?" a="Minutes and phone numbers are billed at provider cost; bring‑your‑own allowed." />
            <Faq q="Setup time?" a="Most customers launch in days—connect Square, pick templates, and go live." />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Bundle or start with one tool</div>
            </div>
            <div className="flex gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/products" className="px-4 py-2 border-2 border-black bg-white text-black">Explore products</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
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

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <div className="font-medium">{q}</div>
      <p className="mt-1 text-sm leading-6">{a}</p>
      <div className="mt-3 h-[2px] bg-black w-24" />
    </div>
  );
}
