"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function CustomWebsitePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero split with browser mock */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Custom website</div>
            <h1 className="mt-2 font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">An AI‑shaped website that stays accurate</h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg">Pages are generated from your Square data—hours, menu, locations—so nothing goes stale. Built to be understood by Google and AI assistants.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="border-2 border-black bg-white shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-1 border-b-2 border-black p-2">
                <span className="h-3 w-3 rounded-full border-2 border-black" />
                <span className="h-3 w-3 rounded-full border-2 border-black" />
                <span className="h-3 w-3 rounded-full border-2 border-black" />
                <div className="ml-2 h-4 flex-1 border-2 border-black" />
              </div>
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="font-mono text-2xl tracking-tight">Seasonal favorites. Always accurate.</div>
                  <p className="mt-2 text-sm">Hours and menu sync from Square. No stale info.</p>
                  <div className="mt-3 h-px bg-black" />
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="border-2 border-black p-3">Map + hours</div>
                    <div className="border-2 border-black p-3">Menu items</div>
                  </div>
                </div>
                <div className="border-2 border-dashed border-black p-3 text-xs">FAQ + schema badges</div>
              </div>
            </div>
          </div>
        </section>

        <Perforation />

        {/* Outcomes strip */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { t: "More customers from search", d: "Fast pages and clear answers help you rank locally." },
            { t: "Never out‑of‑date", d: "Hours, menu, and locations stay in sync with Square." },
            { t: "Fewer support calls", d: "Answer common questions with helpful FAQs and details." },
            { t: "Launch in days", d: "Start with strong defaults and refine when ready." },
          ].map((x) => (
            <div key={x.t} className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">{x.t}</div>
              <p className="mt-3 text-base leading-7">{x.d}</p>
            </div>
          ))}
        </section>

        {/* Use cases zig‑zag */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Use cases</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Single location</div>
              <p className="mt-2">Beautiful home, menu, and hours with maps and contact.</p>
            </div>
            <div className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Multi‑location</div>
              <p className="mt-2">Location pages with unique hours, pickup/delivery info, and menus.</p>
            </div>
            <div className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Seasonal updates</div>
              <p className="mt-2">New items and promos propagate automatically—no stale info.</p>
            </div>
            <div className="border-2 border-black p-6 bg-white">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">AI‑readable</div>
              <p className="mt-2">Structured data helps assistants answer accurately about you.</p>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Highlights</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Generated pages: Home, Menu, Locations, About, FAQs—pre‑wired to Square.</li>
              <li>Structured data for hours, location, and menu to boost SEO/AI discovery.</li>
              <li>Lightweight, fast pages with excellent Core Web Vitals.</li>
              <li>Edit copy, swap images, and publish instantly.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Made to be visual</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Generous white space and clean typographic hierarchy.</li>
              <li>2px borders, offset shadows, perforation strips, and dotted rules.</li>
              <li>Simple iconography and cards; minimal motion with hover lifts.</li>
            </ul>
          </div>
        </section>

        {/* Before / After (rule-only rows) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Before / After</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Before</div>
              <dl className="mt-2 divide-y-2 divide-dashed divide-black/50">
                {[
                  { t: "Stale hours", d: "Customers call to check if you’re open." },
                  { t: "Mismatched menus", d: "What’s online doesn’t match the register." },
                  { t: "Thin pages", d: "Search and assistants don’t find enough detail." },
                ].map((x) => (
                  <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-3 py-3">
                    <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                    <dd className="md:col-span-8 text-sm leading-6">{x.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">After</div>
              <dl className="mt-2 divide-y-2 divide-dashed divide-black/50">
                {[
                  { t: "Always accurate", d: "Hours and locations sync from Square automatically." },
                  { t: "Menu in sync", d: "Items and categories stay up‑to‑date." },
                  { t: "Structured", d: "Clear pages with schema help search and assistants." },
                ].map((x) => (
                  <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-3 py-3">
                    <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                    <dd className="md:col-span-8 text-sm leading-6">{x.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Location cards row */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Locations</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Midtown","Brooklyn","SoMa"].map((loc) => (
              <div key={loc} className="border-2 border-black bg-white p-4 shadow-[8px_8px_0_0_#000]">
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{loc}</div>
                <div className="mt-2 text-sm">Open today · 8:00 AM – 8:00 PM</div>
                <div className="mt-3 h-24 border-2 border-black" />
                <div className="mt-2 text-xs">Map + directions</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO & AI discovery badges */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Discovery</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["LocalBusiness schema","OpeningHours","Menu","FAQ","Fast pages","Clean URLs"].map((b) => (
              <span key={b} className="inline-flex items-center border-2 border-black px-2 py-1 text-xs bg-white">{b}</span>
            ))}
          </div>
        </section>

        {/* Menu sync mosaic */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-5 border-2 border-black p-4 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Menu preview</div>
            <ul className="mt-2 text-sm space-y-2">
              <li>Latte — $4.50</li>
              <li>Brown Sugar Boba — $5.25</li>
              <li>Turkey Panini — $8.50</li>
            </ul>
          </div>
          <div className="md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Always in sync</div>
            <p className="mt-2 text-base leading-7">Add seasonal items in Square and your site stays current. No more copy‑paste updates.</p>
            <div className="mt-3 h-[2px] bg-black w-24" />
          </div>
        </section>

        {/* Performance / Core Web Vitals hint (rule-only KPI row) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Performance</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Fast loads", d: "Optimized assets and clean markup for quick first paint." },
              { t: "Responsive", d: "Looks great on phones, tablets, and desktops." },
              { t: "Accessible", d: "Clear contrast and semantic content." },
            ].map((x) => (
              <div key={x.t}>
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{x.t}</div>
                <p className="mt-2 text-sm leading-6">{x.d}</p>
                <div className="mt-3 h-[2px] bg-black w-24" />
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">How it works</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n: "01", t: "Connect Square", d: "Approve Catalog, Locations, and Hours." },
              { n: "02", t: "Pick a template", d: "Add a short prompt to shape the site." },
              { n: "03", t: "Review & tweak", d: "Edit copy/images; FAQs scaffolded automatically." },
              { n: "04", t: "Publish", d: "Use your domain; updates flow in from Square." },
            ].map((s) => (
              <div key={s.n} className="border-2 border-black p-6 bg-white">
                <div className="font-mono text-3xl">{s.n}</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em]">{s.t}</div>
                <p className="mt-2 text-sm leading-6">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">FAQs</div>
            <div className="mt-4 space-y-4 text-base">
              <div>
                <div className="font-medium">How do you help with SEO?</div>
                <p>Fast pages, clean structure, and content scaffolds with clear answers—so search and AI assistants can understand your site.</p>
              </div>
              <div>
                <div className="font-medium">Do I keep my domain and data?</div>
                <p>Yes. You use your own domain. Content stays yours and syncs from Square.</p>
              </div>
              <div>
                <div className="font-medium">What about multiple locations?</div>
                <p>Create location pages with unique metadata and hours per store.</p>
              </div>
              <div>
                <div className="font-medium">Can I edit content?</div>
                <p>Yes—tweak headlines, sections, and images anytime. Publish in seconds.</p>
              </div>
              <div>
                <div className="font-medium">Does this replace my current site?</div>
                <p>Your choice—use Kira as your main site or a microsite. We can help transition.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full‑bleed callout */}
        <section className="mt-14 bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 py-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Always accurate</div>
            <h3 className="mt-2 font-mono text-3xl sm:text-4xl leading-[0.95] tracking-tight">Hours, menu, and locations that never go stale</h3>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">Keep searchers and assistants happy with up‑to‑date info grounded in your Square data.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Launch an accurate, fast site grounded in Square</div>
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
