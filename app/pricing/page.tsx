"use client";

import { SignUpButton } from "@clerk/nextjs";
import SiteFooter from "@/components/SiteFooter";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/mo",
      features: [
        "1 location",
        "Basic receipt template",
        "QR codes",
        "Email support",
      ],
      cta: "Start free",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      features: [
        "Up to 5 locations",
        "All templates",
        "Schedules & seasons",
        "Priority support",
      ],
      cta: "Try Pro",
      highlighted: true,
    },
    {
      name: "Business",
      price: "Custom",
      period: "",
      features: [
        "Unlimited locations",
        "SSO & roles",
        "SLA & onboarding",
        "Dedicated support",
      ],
      cta: "Contact sales",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24 text-center">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Pricing</h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg">
            Start free. Upgrade when you want more control across locations and seasons.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`border-2 border-black p-6 bg-white ${p.highlighted ? "shadow-[8px_8px_0_0_#000]" : ""}`}
              >
                <div className="font-mono text-xs uppercase tracking-[0.25em]">{p.name}</div>
                <div className="mt-3 flex items-end gap-1">
                  <div className="text-4xl font-mono">{p.price}</div>
                  <div className="text-sm">{p.period}</div>
                </div>
                <ul className="mt-4 text-sm leading-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-baseline gap-2">
                      <span className="h-2 w-2 border border-black inline-block" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-2 border-2 border-black bg-black text-white font-medium hover:-translate-y-0.5 transition-transform">
                      {p.cta}
                    </button>
                  </SignUpButton>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs">No credit card required</p>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

