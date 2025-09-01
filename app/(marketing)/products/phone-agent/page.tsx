"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function PhoneAgentPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Hero */}
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Phone agent</div>
            <h1 className="mt-2 font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">A friendly voice that actually knows your business</h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg">Instant, accurate answers about hours, locations, and menus—pulled live from Square. Fewer missed calls. Happier guests.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="px-4 py-2 border-2 border-black bg-black text-white">Get a free demo</Link>
              <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
            </div>
          </div>
          {/* Device mock + waveform */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="self-end h-2 w-40 bg-[repeating-linear-gradient(90deg,_#000,_#000_4px,_transparent_4px,_transparent_8px)] opacity-40" />
            <div className="mx-auto max-w-sm w-full border-2 border-black bg-white rounded-[28px] p-4 shadow-[8px_8px_0_0_#000]">
              <div className="h-6 w-28 mx-auto border-2 border-black rounded-full" />
              <div className="mt-4 space-y-2 text-sm">
                <Bubble who="caller">What time are you open today?</Bubble>
                <Bubble who="agent">We’re open 8:00 AM–8:00 PM at Midtown. Want directions by text?</Bubble>
                <Bubble who="caller">Yes please.</Bubble>
                <Bubble who="agent">Sent! Anything else I can help with?</Bubble>
              </div>
              <div className="mt-4 h-8 grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="bg-black" style={{ height: `${(i % 5) * 4 + 4}px`, alignSelf: "end" }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Perforation />

        {/* Highlights strip (no boxes) */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { t: "Accurate", d: "Answers come from your live Square data." },
            { t: "Natural", d: "Fast, friendly voice with barge‑in." },
            { t: "Review", d: "Transcripts and outcomes for quality." },
          ].map((x) => (
            <div key={x.t}>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">{x.t}</div>
              <p className="mt-2 text-base leading-7">{x.d}</p>
              <div className="mt-3 h-[2px] bg-black w-24" />
            </div>
          ))}
        </section>

        {/* Use cases (zig-zag) */}
        <section className="mx-auto max-w-6xl mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Use cases</div>
            <ul className="mt-3 text-base leading-7 space-y-3">
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Hours & directions</span> — “Are you open?” with today’s schedule and a quick SMS link to maps.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Menu questions</span> — “Gluten‑free pastries?” → summarize and offer SMS menu link.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Reservations</span> — Capture details or confirm when enabled.</li>
              <li><span className="font-mono text-xs uppercase tracking-[0.25em]">Multi‑location</span> — Route answers to the correct store.</li>
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="border-2 border-black p-4 bg-white shadow-[8px_8px_0_0_#000]">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">What callers hear</div>
              <p className="mt-2 text-sm leading-6">Natural, fast answers with brief clarifications. Short, helpful phrasing—no scripts.</p>
            </div>
          </div>
        </section>

        {/* Reassurance band */}
        <section className="mt-14 bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 py-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Accuracy & privacy</div>
            <h3 className="mt-2 font-mono text-3xl sm:text-4xl leading-[0.95] tracking-tight">Answers from your live Square data</h3>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">We only read what’s needed—locations, hours, menus. Transcripts help you review; handoffs occur when questions need a human.</p>
          </div>
        </section>

        {/* Multi‑location & routing chips */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Multi‑location routing</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["Midtown","Downtown","Truck A","Truck B","Pop‑up","Catering"].map((c) => (
              <span key={c} className="inline-flex items-center border-2 border-black px-2 py-1 bg-white">{c}</span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 max-w-prose">Route answers to the right location automatically. The agent clarifies which store the caller means and answers with the correct hours, address, and menu.</p>
        </section>

        {/* After‑hours & overflow band */}
        <section className="mt-14 bg-white">
          <div className="mx-auto max-w-6xl border-2 border-black p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">After‑hours & rush</div>
            <h3 className="mt-2 font-mono text-2xl leading-[0.95] tracking-tight">Capture questions when nobody can pick up</h3>
            <p className="mt-2 text-sm">Forward missed calls to Kira during peak or after closing. The agent answers common questions and offers to text helpful links.</p>
          </div>
        </section>

        {/* Labor savings / ROI (rule‑only list) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Why it pays for itself</div>
          <dl className="mt-3 divide-y-2 divide-dashed divide-black/50">
            {[
              { t: "Fewer interruptions", d: "Staff spend more time serving guests in front of them." },
              { t: "More answered calls", d: "After‑hours and rush calls stop going to voicemail." },
              { t: "Happier guests", d: "Fast, accurate info—no hold music." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
                <dt className="md:col-span-4 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-8 text-base leading-7">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Short link examples (rule‑only) */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Texts we can send</div>
          <dl className="mt-3 divide-y-2 divide-dashed divide-black/50 text-sm">
            {[
              { t: "Directions", d: "Map link for the location they asked about." },
              { t: "Menu", d: "Your live menu page grounded in Square." },
              { t: "Specials", d: "Seasonal items or limited‑time promos." },
            ].map((x) => (
              <div key={x.t} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2">
                <dt className="md:col-span-3 font-mono text-xs uppercase tracking-[0.25em]">{x.t}</dt>
                <dd className="md:col-span-9">{x.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Faq q="Will this replace staff?" a="No. It handles common calls and hands off when needed." />
            <Faq q="How fast?" a="Sub‑second perceived responses with natural barge‑in." />
            <Faq q="What about accuracy?" a="Answers come from your live Square locations and menus." />
            <Faq q="Can it book?" a="Yes, when enabled; otherwise it captures details for staff." />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-14">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Try the phone agent</div>
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

function Bubble({ children, who }: { children: React.ReactNode; who: "caller" | "agent" }) {
  const me = who === "agent";
  return (
    <div className={`max-w-[80%] ${me ? "ml-auto" : ""}`}>
      <div className={`inline-block px-3 py-2 ${me ? "bg-black text-white" : "bg-white"} border-2 border-black rounded-2xl`}>{children}</div>
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
