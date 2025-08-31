"use client";

import SiteFooter from "@/components/SiteFooter";

export default function CustomWebsitePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Custom Website</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Be found on Google and AI assistants. Build a fast site shaped by AI—grounded in your Square data for accurate hours, menu, and locations.
          </p>
        </section>

        {/* Value prop / SEO + AI discovery */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Why it matters</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Rank locally and answer common questions clearly.</li>
              <li>Accurate info from Square: hours, menu, pricing, locations.</li>
              <li>Fast, mobile‑first pages that customers and assistants can parse.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">AI‑shaped, within guardrails</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Use prompts to adjust layout, tone, and sections.</li>
              <li>Guardrails keep content accurate to Square data.</li>
              <li>Flexible designs without losing truthfulness.</li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Connect Square (OAuth); approve Catalog, Locations, and Hours.</li>
              <li>Pick a starting template and provide a short prompt.</li>
              <li>We generate pages and FAQs using your Square data as source‑of‑truth.</li>
              <li>Publish to your domain; update content or prompts anytime.</li>
            </ol>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">FAQs</div>
            <div className="mt-4 space-y-4 text-base">
              <div>
                <div className="font-medium">How do you help with SEO?</div>
                <p>Fast pages, clean structure, and content scaffolds with clear answers—so search and AI assistants can understand your site.</p>
              </div>
              <div>
                <div className="font-medium">Will ChatGPT/Bing recommend us?</div>
                <p>We surface accurate hours, menu, and FAQs in a way assistants can parse. Keeping data fresh from Square builds trust.</p>
              </div>
              <div>
                <div className="font-medium">Do I keep my domain and data?</div>
                <p>Yes. You use your own domain. Content stays yours and syncs from Square.</p>
              </div>
              <div>
                <div className="font-medium">What about multiple locations?</div>
                <p>Create location pages with unique metadata and hours per store.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Launch your SEO‑ready site grounded in Square</div>
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
