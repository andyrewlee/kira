"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Clock, ShieldCheck, Webhook, ListChecks, CreditCard, Settings as SettingsIcon } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <Hero />
        <Perforation />
        <ReceiptStrip />
        <Perforation />
        <LabelTickets />
        <Perforation />
        <WebsiteCanvas />
        <Perforation />
        
        <PickupBoard />
        <Perforation />
        <PhoneAgentStrip />
        <Perforation />
        <HowItWorksSummary />
        <Perforation />
        <SquareIntegration />
        <FAQTeaser />
        <BottomCTA />
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
            Supercharge your Square POS
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg">
            Kira is a suite of tools that extends Square—custom receipts and labels, a website that stays accurate, pickup screens, and an AI phone agent. No POS swap. Month-to-month.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products" className="px-4 py-2 border-2 border-black bg-black text-white font-medium hover:-translate-y-0.5 transition-transform">
              Explore products
            </Link>
            <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black font-medium hover:-translate-y-0.5 transition-transform">
              See pricing
            </Link>
            <span className="ml-2 font-mono text-[11px] tracking-[0.25em] uppercase">Works with Square</span>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="hidden lg:block h-px bg-black mb-4" />
          <ul className="font-mono text-xs tracking-wider leading-6">
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> No POS swap</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Month-to-month</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Built for Square APIs</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Fast setup</li>
            <li className="flex items-baseline gap-2"><span className="h-2 w-2 border border-black inline-block" /> Cancel anytime</li>
          </ul>
        </div>
      </div>
    </section>
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

function ReceiptStrip() {
  return (
    <section className="mx-auto max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.3em]">Printed touchpoints</div>
        <h3 className="mt-2 font-mono text-2xl">Receipts that look like you</h3>
        <p className="mt-3 max-w-prose text-base">Design the little details customers remember—type, spacing, rules, and QR codes. Schedule seasonal designs and push updates instantly.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <Link href="/products/printers" className="underline">See printers</Link>
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="mx-auto w-full max-w-sm bg-white border-2 border-black rounded-sm shadow-[8px_8px_0_0_#000] p-6 font-mono">
          <div className="text-center text-sm tracking-widest uppercase">KIRA COFFEE</div>
          <div className="mt-1 text-center text-[10px] tracking-widest">123 MAIN ST · NYC</div>
          <div className="mt-4 border-t border-dashed border-black" />
          <div className="mt-4 flex justify-between text-sm"><span>Americano</span><span>$3.50</span></div>
          <div className="mt-1 flex justify-between text-sm"><span>Blueberry Muffin</span><span>$2.75</span></div>
          <div className="mt-1 flex justify-between text-sm"><span>Oat Milk</span><span>$0.50</span></div>
          <div className="mt-4 border-t border-dashed border-black" />
          <div className="mt-3 flex justify-between text-sm font-bold"><span>Total</span><span>$6.75</span></div>
          <div className="mt-6 grid grid-cols-3 gap-3 items-center">
            <div className="col-span-2 text-[10px] leading-4">Scan for rewards + seasonal menu</div>
            <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
          </div>
          <div className="mt-6 border-t border-dashed border-black" />
          <div className="mt-3 text-center text-[10px] tracking-widest">THANK YOU · SEE YOU SOON</div>
        </div>
      </div>
    </section>
  );
}


function HowItWorksSummary() {
  const steps = [
    { title: "Connect Square", body: "Sign in with Square and approve permissions.", Icon: CreditCard },
    { title: "Sync data", body: "We pull items, hours, and locations as needed.", Icon: ListChecks },
    { title: "Configure", body: "Pick templates, write prompts, and set rules.", Icon: SettingsIcon },
    { title: "Go live", body: "Publish—no POS swap or downtime.", Icon: ShieldCheck },
  ];
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em]">How it works</div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 lg:col-start-1">
          <ol className="relative border-l-2 border-dashed border-black/60 pl-6">
            {steps.map(({ title, body, Icon }, idx) => (
              <li key={title} className="mb-8 last:mb-0">
                <span className="absolute -left-[11px] mt-1 inline-flex h-4 w-4 items-center justify-center border-2 border-black bg-white">
                  <Icon className="h-3 w-3" />
                </span>
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/80">{String(idx + 1).padStart(2, '0')} · {title}</div>
                <div className="mt-2 text-base leading-7">{body}</div>
              </li>
            ))}
          </ol>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="text-[11px] font-mono uppercase tracking-[0.3em]">Notes</div>
          <p className="mt-2 text-sm">First‑class Square integration. Keep your POS and hardware. Month‑to‑month; cancel anytime.</p>
        </aside>
      </div>
    </section>
  );
}

function SquareIntegration() {
  const items = [
    { title: "Webhooks", body: "Orders and status updates powering receipts, labels, and pickup screens.", Icon: Webhook },
    { title: "Catalog", body: "Items, modifiers, and categories for sites, labels, and ordering.", Icon: ListChecks },
    { title: "Locations & hours", body: "Accurate info for your site, agent, and checkout.", Icon: Clock },
    { title: "Payments", body: "Apple/Google Pay, tips, promos, and taxes.", Icon: CreditCard },
  ];
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Square integration</div>
      <dl className="mt-6 divide-y-2 divide-dashed divide-black/40">
        {items.map(({ title, body, Icon }) => (
          <div key={title} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
            <dt className="md:col-span-3 flex items-center gap-2">
              <span className="border-2 border-black p-1 bg-white"><Icon className="h-4 w-4" /></span>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]">{title}</span>
            </dt>
            <dd className="md:col-span-9 text-base leading-7">{body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function LabelTickets() {
  const tickets = [
    { title: "Matcha Latte", meta: "Size: M · Oat milk", price: "$5.50" },
    { title: "Brown Sugar Boba", meta: "Less ice · 50% sweet", price: "$5.25" },
    { title: "Turkey Panini", meta: "No onions · Add pesto", price: "$8.50" },
  ];
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em]">Label previews</div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {tickets.map((t, idx) => (
          <div key={t.title} className={`bg-white border-2 border-black p-4 ${idx === 0 ? 'shadow-[6px_6px_0_0_#000]' : ''}`}>
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-sm">{t.title}</div>
              <div className="font-mono text-xl">{t.price}</div>
            </div>
            <div className="mt-2 text-[11px]">{t.meta}</div>
            <div className="mt-3 grid grid-cols-3 gap-3 items-center">
              <div className="col-span-2 text-[10px] leading-4">Scan for order status</div>
              <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Online ordering section removed

function PickupBoard() {
  const rows = [
    { name: "Ava", item: "Iced Latte", status: "Preparing" },
    { name: "Liam", item: "Brown Sugar Boba", status: "Ready" },
    { name: "Noah", item: "Turkey Panini", status: "Preparing" },
  ];
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em]">Pickup screen</div>
      <div className="mt-4 border-2 border-black bg-white p-4">
        <div className="grid grid-cols-3 font-mono text-xs uppercase tracking-[0.25em]">
          <div>Name</div>
          <div>Order</div>
          <div>Status</div>
        </div>
        <div className="mt-2 h-px bg-black" />
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-3 py-2 text-sm">
            <div>{r.name}</div>
            <div>{r.item}</div>
            <div className={r.status === 'Ready' ? 'font-bold' : ''}>{r.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WebsiteCanvas() {
  return (
    <section className="mx-auto max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-5">
        <div className="font-mono text-xs uppercase tracking-[0.3em]">Custom website</div>
        <h3 className="mt-2 font-mono text-2xl">AI‑shaped site—grounded in Square</h3>
        <p className="mt-3 text-base">Pages stay accurate with your hours, menu, and locations. Built‑in FAQs help search and assistants understand your business.</p>
        <div className="mt-4 text-sm"><Link href="/products/custom-website" className="underline">Explore custom website</Link></div>
      </div>
      <div className="md:col-span-7">
        <div className="border-2 border-black bg-white p-4 sm:p-6">
          {/* Fake page header */}
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Kira Cafe</div>
            <div className="h-5 w-24 border-2 border-black" />
          </div>
          <div className="mt-3 h-px bg-black" />
          {/* Hero */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:col-span-2">
              <div className="font-mono text-3xl leading-[0.95] tracking-tight">Seasonal favorites. Always accurate.</div>
              <p className="mt-2 text-sm">Hours and menu synced from Square. No stale info.</p>
            </div>
            <div className="border-2 border-black p-3">
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase">SEO helpers</div>
              <ul className="mt-2 text-xs space-y-1">
                <li>• Menu page per category</li>
                <li>• Location pages w/ hours</li>
                <li>• FAQ answers</li>
              </ul>
            </div>
          </div>
          {/* Menu preview */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border-2 border-black p-3">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Drinks</div>
              <div className="mt-2 text-sm">Iced Latte — $5.25</div>
              <div className="text-sm">Matcha Latte — $5.50</div>
            </div>
            <div className="border-2 border-black p-3">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Pastries</div>
              <div className="mt-2 text-sm">Blueberry Muffin — $2.75</div>
              <div className="text-sm">Butter Croissant — $3.25</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneAgentStrip() {
  return (
    <section className="mx-auto max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-5">
        <div className="font-mono text-xs uppercase tracking-[0.3em]">AI phone agent</div>
        <h3 className="mt-2 font-mono text-2xl">Never miss a call</h3>
        <p className="mt-3 text-base">When staff can’t pick up, an agent answers using your Square hours and menu—then logs a transcript.</p>
        <div className="mt-4 text-sm"><Link href="/products/phone-agent" className="underline">Explore phone agent</Link></div>
      </div>
      <div className="md:col-span-7">
        <div className="border-2 border-black bg-white p-4 sm:p-6">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase">Sample transcript</div>
          <ul className="mt-3 space-y-3 text-[15px] leading-6">
            <li><span className="font-medium">Caller:</span> What time do you open tomorrow?</li>
            <li><span className="font-medium">AI Agent:</span> We open at 8:00 AM and close at 8:00 PM.</li>
            <li><span className="font-medium">Caller:</span> Do you have dairy‑free milk?</li>
            <li><span className="font-medium">AI Agent:</span> Yes—oat, almond, and soy. Want the menu link by text?</li>
          </ul>
          <div className="mt-3 text-xs text-black/70">Powered by live Square hours and menu data</div>
        </div>
      </div>
    </section>
  );
}

function FAQTeaser() {
  const faqs = [
    { q: "Do I have to switch POS?", a: "No—Kira extends your Square POS. Keep your hardware." },
    { q: "How long does setup take?", a: "Minutes. Connect Square, configure, and go live." },
    { q: "Month‑to‑month?", a: "Yes. Cancel anytime." },
  ];
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em]">FAQs</div>
      <div className="mt-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="py-4 border-b-2 border-dashed border-black/40 last:border-none">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Q: {q}</div>
            <div className="mt-2 text-base leading-7">A: {a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="mx-auto max-w-6xl mt-24">
      <div className="relative p-6 bg-white border-2 border-black">
        <div className="absolute inset-x-0 -top-2 h-2 bg-[repeating-linear-gradient(90deg,_#000_0,_#000_8px,_transparent_8px,_transparent_16px)] opacity-20" aria-hidden="true" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]">Ready</div>
            <div className="mt-2 text-lg">Pick a product and launch in minutes</div>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="px-4 py-2 border-2 border-black bg-black text-white">Explore products</Link>
            <Link href="/pricing" className="px-4 py-2 border-2 border-black bg-white text-black">See pricing</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer moved to components/SiteFooter
