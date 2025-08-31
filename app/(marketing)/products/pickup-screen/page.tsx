"use client";

import SiteFooter from "@/components/SiteFooter";

export default function PickupScreenPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Pickup Screen</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Show orders as they move from preparing to ready—with optional name callouts and fully customizable themes.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Experience</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Live board shows orders: placed → preparing → ready.</li>
              <li>Optional voice callout of the customer name when ready.</li>
              <li>Prompts let you set the vibe: holidays, daytime/evening themes, branding.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Connect Square and select locations.</li>
              <li>We listen for order status updates from Square.</li>
              <li>Display orders on your screen and announce when ready.</li>
            </ol>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">FAQs</div>
            <div className="mt-4 space-y-4 text-base">
              <div>
                <div className="font-medium">What hardware do I need?</div>
                <p>Any modern display with a browser (TV + stick, iPad, or desktop monitor).</p>
              </div>
              <div>
                <div className="font-medium">Is there a delay?</div>
                <p>Updates appear in real time as Square status changes arrive.</p>
              </div>
              <div>
                <div className="font-medium">What if the internet goes down?</div>
                <p>The board will reconnect and catch up automatically once online.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Set up your pickup screen</div>
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
