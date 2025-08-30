"use client";

import SiteFooter from "@/components/SiteFooter";

export default function HowItWorksPage() {
  const steps = [
    {
      n: "01",
      title: "Connect Square",
      body: "Authorize Kira to access your locations and printers. Pick which printers to manage.",
    },
    {
      n: "02",
      title: "Customize templates",
      body: "Choose a base template for receipts or labels. Set type, spacing, rules, and composition.",
    },
    {
      n: "03",
      title: "Add QR + campaigns",
      body: "Drop in QR codes for promos, loyalty, or menus. Update destinations anytime.",
    },
    {
      n: "04",
      title: "Schedule and publish",
      body: "Plan seasonal designs and go live instantly. Printers pick up changes with no downtime.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">How it works</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            From setup to your first beautifully branded print in minutes.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-14">
          <div className="grid grid-cols-1 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="border-2 border-black p-6 bg-white">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-xs uppercase tracking-[0.25em]">{s.n}</div>
                  <div className="grow mx-4 h-px bg-black" />
                  <div className="font-mono text-lg">{s.title}</div>
                </div>
                <p className="mt-3 text-base">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

