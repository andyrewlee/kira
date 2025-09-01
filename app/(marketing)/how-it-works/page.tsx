"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    { n: "01", title: "Connect Square", body: "Authorize Kira for Orders, Catalog, Locations, and Webhooks." },
    { n: "02", title: "Pick your tools", body: "Printers, Pickup Screen, Custom Website, and Phone Agent—choose any or all." },
    { n: "03", title: "Configure in minutes", body: "Use templates, tweak copy, and preview with real data." },
    { n: "04", title: "Publish (no downtime)", body: "Updates go live instantly; we keep everything fresh automatically." },
    { n: "05", title: "Measure & iterate", body: "Faster pickups, fewer remakes, more visits, answered calls." },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero: split + collage */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h1 className="font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">How it works</h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg">Connect, choose your tools, and go live—no POS swap. Update designs and pages in seconds.</p>
            <div className="mt-8 flex gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="border-2 border-black p-3 font-mono text-xs shadow-[8px_8px_0_0_#000]">Receipt strip</div>
            <div className="border-2 border-black p-3">Label ticket</div>
            <div className="col-span-2 border-2 border-black p-3">Pickup board mock</div>
          </div>
        </section>

        <Perforation />

        {/* Timeline with dashed spine + notes */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ol className="relative border-l-2 border-dashed border-black/60 pl-6">
              {steps.map((s) => (
                <li key={s.n} className="mb-10 last:mb-0">
                  <span className="absolute -left-[11px] mt-1 inline-flex h-4 w-4 items-center justify-center border-2 border-black bg-white" />
                  <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/80">{s.n} · {s.title}</div>
                  <div className="mt-2 text-base leading-7">{s.body}</div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Notes</div>
            <ul className="mt-3 text-sm space-y-2">
              <li>Works with your Square data. No POS swap.</li>
              <li>2px borders, offset shadows, and perforation motifs keep it visual.</li>
              <li>Minimal motion for a calm, premium feel.</li>
            </ul>
          </aside>
        </section>

        {/* Tools grid */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Pick your tools</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Printers", d: "Entire order & per‑item printing with images and QR/barcodes." },
              { t: "Pickup Screen", d: "Preparing/Finished boards with privacy modes and voice callouts." },
              { t: "Custom Website", d: "Fast, accurate pages grounded in Square." },
              { t: "Phone Agent", d: "Friendly voice answers hours/menu/location questions live." },
            ].map((x) => (
              <div key={x.t} className="border-2 border-black p-6 bg-white">
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{x.t}</div>
                <p className="mt-2 text-sm leading-6">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full‑bleed publish band */}
        <section className="mt-14 bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 py-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Go live</div>
            <h3 className="mt-2 font-mono text-3xl sm:text-4xl leading-[0.95] tracking-tight">Publish with zero downtime</h3>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">Printers and boards auto‑update; your website and phone agent stay fresh via Square webhooks.</p>
          </div>
        </section>

        {/* KPI row (rule‑only) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">What improves</div>
          <dl className="mt-3 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Fewer remakes", d: "Clear labels/tickets reduce mistakes." },
              { t: "Faster pickups", d: "Guests know when to step up." },
              { t: "More visits", d: "Accurate pages help searchers choose you." },
              { t: "Answered calls", d: "After‑hours questions handled." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FAQ + CTA */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
            <div className="mt-3 grid grid-cols-1 gap-6">
              <Faq q="Do I need to switch POS?" a="No. Kira is built on your existing Square setup." />
              <Faq q="How long does setup take?" a="Most teams preview prints/boards day one; sites and agents within a week." />
              <Faq q="Can I start small?" a="Yes—begin with one tool; add more later or bundle." />
            </div>
          </div>
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Connect Square and go live</div>
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
