"use client";

import SiteFooter from "@/components/SiteFooter";

export default function PhoneAgentPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Phone Agent</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            When staff can’t pick up, an AI agent answers common questions using live Square data—hours, menu, reservations—and logs transcripts.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Capabilities</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Answers hours, menu questions, and reservation info using Square data.</li>
              <li>Configurable tone and personality; multiple languages.</li>
              <li>Review transcripts and mark outcomes for quality.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Forward missed calls to your Kira number.</li>
              <li>We query Square for accurate answers and respond in your brand voice.</li>
              <li>Log a transcript and notify you of any handoffs needed.</li>
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl mt-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] mb-3">Sample transcript</div>
          <div className="border-2 border-black bg-white p-4 md:p-6 max-w-2xl">
            <ul className="space-y-3 text-[15px] leading-6">
              <li>
                <span className="font-medium">Caller:</span> Hi, what time do you open tomorrow?
              </li>
              <li>
                <span className="font-medium">Agent:</span> We open at 8:00 AM and close at 8:00 PM.
              </li>
              <li>
                <span className="font-medium">Caller:</span> Do you have dairy‑free milk options for lattes?
              </li>
              <li>
                <span className="font-medium">Agent:</span> Yes—oat, almond, and soy are available. Would you like our menu link by text?
              </li>
              <li>
                <span className="font-medium">Caller:</span> Sure, please text it to me.
              </li>
              <li>
                <span className="font-medium">Agent:</span> Done. Anything else I can help with?
              </li>
            </ul>
            <div className="mt-4 text-xs text-black/70">Powered by live Square hours and menu data</div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Try the phone agent</div>
            </div>
            <a href="/pricing" className="px-4 py-2 border-2 border-black bg-black text-white inline-block text-center">
              See pricing
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

