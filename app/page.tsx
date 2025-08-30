"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <Hero />
        <PreviewReceipt />
        <Features />
        <SiteFooter />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <h1 className="font-mono text-4xl sm:text-6xl leading-[0.95] tracking-tight">
            Make printers your competitive advantage
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg">
            Upgrade your Square receipts and labels with fully custom layouts.
            Unique typography, seasonal themes, QR codes, and real-time
            updates—so your brand looks sharp at the counter, on the shelf,
            and in the bag.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Unauthenticated>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 border-2 border-black bg-black text-white font-medium hover:-translate-y-0.5 transition-transform">
                  Start free
                </button>
              </SignUpButton>
            </Unauthenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="px-4 py-2 border-2 border-black bg-white text-black font-medium hover:-translate-y-0.5 transition-transform">
                  Sign in
                </button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <span className="px-4 py-2 border-2 border-black bg-white text-black font-medium">Welcome back</span>
            </Authenticated>
            <span className="ml-2 font-mono text-[11px] tracking-[0.25em] uppercase">Works with Square</span>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="hidden lg:block h-px bg-black mb-4" />
          <ul className="font-mono text-xs tracking-wider leading-6">
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Receipt & label templates</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Brand fonts + logo lockups</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> QR codes for promos & menus</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Schedule seasonal designs</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Instant updates, zero downtime</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function PreviewReceipt() {
  return (
    <section className="mx-auto max-w-6xl mt-16 sm:mt-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em]">Preview</div>
          <h2 className="mt-2 font-mono text-2xl">Printed, but personal</h2>
          <p className="mt-4 max-w-prose text-base">
            Give every receipt and label a point of view. Choose type, spacing,
            rules, and composition—then push changes in seconds. It’s the
            tactile brand touch that customers remember.
          </p>
        </div>
        <div className="md:col-span-6">
          <div className="mx-auto w-full max-w-sm bg-white border-2 border-black rounded-sm shadow-[8px_8px_0_0_#000] p-6 font-mono">
            <div className="text-center text-sm tracking-widest uppercase">KIRA COFFEE</div>
            <div className="mt-1 text-center text-[10px] tracking-widest">123 MAIN ST · NYC</div>
            <div className="mt-4 border-t border-dashed border-black" />

            <div className="mt-4 flex justify-between text-sm">
              <span>Americano</span>
              <span>$3.50</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Blueberry Muffin</span>
              <span>$2.75</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Oat Milk</span>
              <span>$0.50</span>
            </div>

            <div className="mt-4 border-t border-dashed border-black" />
            <div className="mt-3 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>$6.75</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 items-center">
              <div className="col-span-2 text-[10px] leading-4">
                Scan for rewards + seasonal menu
              </div>
              <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
            </div>

            <div className="mt-6 border-t border-dashed border-black" />
            <div className="mt-3 text-center text-[10px] tracking-widest">
              THANK YOU · SEE YOU SOON
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Custom layouts",
      body: "Design receipts and labels that look like your brand—fonts, spacing, rules, and lockups.",
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
  ];

  return (
    <section className="mx-auto max-w-6xl mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((f) => (
          <div key={f.title} className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">{f.title}</div>
            <p className="mt-3 text-base">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Footer moved to components/SiteFooter
