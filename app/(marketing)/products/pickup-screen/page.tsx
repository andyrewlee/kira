"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function PickupScreenPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero: split with board mock */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Pickup screen</div>
            <h1 className="mt-2 font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">Customers see their name, not a crowd</h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg">Live order boards powered by your Square orders. Clear columns, big names, optional voice callouts—fewer “is my order ready?” interruptions.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <BoardMock theme="light" />
          </div>
        </section>

        <Perforation />

        {/* Light/Dark preview */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <BoardMock theme="light" compact />
          <BoardMock theme="dark" compact />
        </section>

        {/* Outcomes as rule-only rows */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Outcomes</div>
          <dl className="mt-4 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Shorter lines, calmer counters", d: "Guests know exactly when to step up." },
              { t: "Fewer interruptions", d: "Staff focus on prep instead of status questions." },
              { t: "On‑brand experience", d: "Fonts, colors, and layout that match your space." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Zig-zag use cases */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Use cases</div>
            <ul className="mt-3 text-base leading-7 space-y-3">
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Cafe queue</span> — Preparing vs Finished columns with names or order numbers.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Food hall window</span> — Station‑specific boards by category.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Privacy modes</span> — Show names, masked names, or IDs.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Audio cues</span> — Optional voice announcements when orders flip to Finished.</li>
            </ul>
          </div>
          <div className="lg:col-span-5">
            <ControlMock />
          </div>
        </section>

        {/* Minimalist FAQ */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Faq q="What hardware do I need?" a="Any modern display with a browser (TV + stick, iPad, or desktop monitor)." />
            <Faq q="Is there a delay?" a="Updates appear in real time as Square status changes arrive." />
            <Faq q="What if the internet goes down?" a="The board will reconnect and catch up automatically once online." />
            <Faq q="Can I theme it?" a="Yes—fonts, colors, and logo to match your brand." />
          </div>
        </section>

        {/* Full‑bleed callout */}
        <section className="mt-14 bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 py-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Finished orders</div>
            <h3 className="mt-2 font-mono text-3xl sm:text-4xl leading-[0.95] tracking-tight">Clear, confident announcements—no crowding the counter</h3>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">Optional voice callouts and legible names reduce stress and keep the line moving.</p>
          </div>
        </section>

        {/* KPI row */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">What improves</div>
          <dl className="mt-3 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Fewer interruptions", d: "Guests see their status without asking." },
              { t: "Faster handoff", d: "Names/numbers pop when orders flip to Finished." },
              { t: "On‑brand", d: "Boards look and feel like your space." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Use cases expanded (food trucks, quiet stores) */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">More use cases</div>
            <ul className="mt-3 text-base leading-7 space-y-3">
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Food trucks</span> — Show finished numbers so guests see their turn without shouting over generators.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Quiet stores</span> — Keep it calm; no need to call names—names/numbers are clear on screen.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Multi‑station</span> — Sort by category or station to reduce cross‑talk.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Events & pop‑ups</span> — Bring a tablet; be organized when it’s busy.</li>
            </ul>
          </div>
          <div className="lg:col-span-5 border-2 border-black p-4 bg-white shadow-[8px_8px_0_0_#000]">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Labor savings</div>
            <p className="mt-2 text-sm leading-6">Fewer status questions and clearer handoffs = faster lines with the same team. Reduce time spent shouting names and repeating orders.</p>
          </div>
        </section>

        {/* Themes & layouts chips */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Themes & layouts</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["Light","Dark","Holiday","Day/Night","Two columns","Single column","Names","Numbers","Masked"].map((t) => (
              <span key={t} className="inline-flex items-center border-2 border-black px-2 py-1 bg-white">{t}</span>
            ))}
          </div>
        </section>


        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Set up your pickup screen</div>
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

function BoardMock({ theme = "light", compact = false }: { theme?: "light" | "dark"; compact?: boolean }) {
  const base = theme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const tile = theme === "dark" ? "bg-gray-900" : "bg-white";
  return (
    <div className={`border-2 border-black ${base} ${compact ? "p-3" : "p-5"} shadow-[8px_8px_0_0_#000]`}>
      <div className="grid grid-cols-3 font-mono text-xs uppercase tracking-[0.25em]">
        <div>name</div><div>order</div><div>status</div>
      </div>
      <div className={`mt-2 h-px ${theme === "dark" ? "bg-white/60" : "bg-black"}`} />
      <div className={`mt-3 grid grid-cols-1 ${compact ? "gap-2" : "gap-3"}`}>
        {[
          { n: "Ava", i: "Iced Latte", s: "Preparing" },
          { n: "Liam", i: "Brown Sugar Boba", s: "Ready" },
          { n: "Noah", i: "Turkey Panini", s: "Preparing" },
        ].map((r, idx) => (
          <div key={idx} className={`grid grid-cols-3 ${tile} ${theme === "dark" ? "text-white" : "text-black"} ${theme === "dark" ? "" : "border-2 border-black"} p-2`}> 
            <div className="font-mono">{r.n}</div>
            <div className="truncate">{r.i}</div>
            <div className={r.s === "Ready" ? "font-bold" : ""}>{r.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlMock() {
  return (
    <div className="border-2 border-black bg-white p-4 shadow-[8px_8px_0_0_#000]">
      <div className="font-mono text-xs uppercase tracking-[0.25em]">Controls</div>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs">Privacy</div>
          <div className="mt-1 border-2 border-black p-2">Names ▾</div>
        </div>
        <div>
          <div className="text-xs">Volume</div>
          <div className="mt-3 h-2 bg-black" />
        </div>
      </div>
    </div>
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
