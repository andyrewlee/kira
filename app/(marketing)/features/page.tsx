"use client";

import SiteFooter from "@/components/SiteFooter";

export default function FeaturesPage() {
  const items = [
    {
      title: "Custom layouts",
      body: "Design receipts and labels that look like your brand—fonts, spacing, rules, and lockups.",
    },
    {
      title: "Brand assets",
      body: "Upload logos and pick type styles. Create reusable presets for teams.",
    },
    {
      title: "QR + campaigns",
      body: "Drop in QR codes to drive promos, menus, or forms. Swap destinations anytime.",
    },
    {
      title: "Schedules & seasons",
      body: "Plan designs for holidays and events. Roll out on a date, roll back later.",
    },
    {
      title: "Instant updates",
      body: "Push changes live with no downtime. Every printer picks up the latest design.",
    },
    {
      title: "Works with Square",
      body: "Connect once, then configure per location or printer with fine-grained control.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Features</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Everything you need to make printed touchpoints feel unmistakably yours—fast,
            flexible, and beautifully on-brand.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((f) => (
              <div key={f.title} className="border-2 border-black p-6 bg-white">
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{f.title}</div>
                <p className="mt-3 text-base">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

