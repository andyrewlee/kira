"use client";

import SiteFooter from "@/components/SiteFooter";

export default function ReceiptPrintersPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Receipt Printers</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Customize exactly how receipts look—from minimalist to full details—using live Square order data. Add logos, QR codes, and event themes.
          </p>
        </section>

        {/* Benefits / Customization */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Customization</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Show only what matters (or everything): items, modifiers, notes, pickup/delivery details.</li>
              <li>Add logo lockups and QR codes for promos, menus, or feedback.</li>
              <li>Set type, spacing, and rules to feel like your brand.</li>
              <li>Schedule seasonal/event themes and roll back anytime.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Why it helps</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Cleaner counters and fewer mistakes at the register.</li>
              <li>Memorable printed touchpoint customers actually keep.</li>
              <li>Drive actions with QR (loyalty, menu, reviews, reorders).</li>
              <li>Push updates instantly with zero downtime.</li>
            </ul>
          </div>
        </section>

        {/* Examples (migrated from Showcase) */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] mb-4">Examples</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReceiptCafe />
            <ReceiptBoutique />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Connect Square and approve permissions for Orders and Webhooks.</li>
              <li>Pick a template and choose what to show from each order.</li>
              <li>We listen for new orders via webhooks and format the receipt.</li>
              <li>Printers pick up the latest design automatically.</li>
            </ol>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">FAQs</div>
            <div className="mt-4 space-y-4 text-base">
              <div>
                <div className="font-medium">What printers are supported?</div>
                <p>Star Micronics and other common thermal receipt printers used with Square. Contact us if you have a specific model.</p>
              </div>
              <div>
                <div className="font-medium">How long does setup take?</div>
                <p>Minutes. Connect Square, pick a template, print a test, and go live.</p>
              </div>
              <div>
                <div className="font-medium">What data do you use?</div>
                <p>Only the order details Square sends (items, modifiers, notes, fulfillment info). We don’t require POS swaps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Customize your receipts and print a test</div>
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

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="border-2 border-black bg-white p-4">
      <div className="font-mono text-xs uppercase tracking-[0.25em] mb-3">{title}</div>
      <div className="mx-auto w-full max-w-sm bg-white border-2 border-black rounded-sm shadow-[8px_8px_0_0_#000] p-6 font-mono">
        {children}
      </div>
    </div>
  );
}

function ReceiptCafe() {
  return (
    <Card title="Cafe receipt">
      <div className="text-center text-sm tracking-widest uppercase">KIRA COFFEE</div>
      <div className="mt-1 text-center text-[10px] tracking-widest">123 MAIN ST · NYC</div>
      <div className="mt-4 border-t border-dashed border-black" />
      <div className="mt-4 flex justify-between text-sm"><span>Americano</span><span>$3.50</span></div>
      <div className="mt-1 flex justify-between text-sm"><span>Croissant</span><span>$3.25</span></div>
      <div className="mt-4 border-t border-dashed border-black" />
      <div className="mt-3 flex justify-between text-sm font-bold"><span>Total</span><span>$6.75</span></div>
      <div className="mt-6 grid grid-cols-3 gap-3 items-center">
        <div className="col-span-2 text-[10px] leading-4">Scan for rewards + menu</div>
        <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
      </div>
      <div className="mt-6 border-t border-dashed border-black" />
      <div className="mt-3 text-center text-[10px] tracking-widest">THANK YOU</div>
    </Card>
  );
}

function ReceiptBoutique() {
  return (
    <Card title="Boutique receipt">
      <div className="text-center text-base tracking-[0.35em] uppercase">KIRA BOUTIQUE</div>
      <div className="mt-3 text-[10px]">Order #004291 — 2025-08-30</div>
      <div className="mt-2 border-t border-dashed border-black" />
      <div className="mt-3 text-[10px]">1 × Linen Shirt — M</div>
      <div className="text-[10px]">1 × Wide-Leg Pant — 30</div>
      <div className="mt-2 border-t border-dashed border-black" />
      <div className="mt-2 flex justify-between text-sm font-bold"><span>Subtotal</span><span>$148.00</span></div>
      <div className="flex justify-between text-sm"><span>Tax</span><span>$13.32</span></div>
      <div className="flex justify-between text-sm font-bold"><span>Total</span><span>$161.32</span></div>
      <div className="mt-4 h-10 bg-[repeating-linear-gradient(90deg,_#000,_#000_8px,_transparent_8px,_transparent_16px)]" />
      <div className="mt-2 text-center text-[10px] tracking-widest">EXCHANGE WITHIN 30 DAYS</div>
    </Card>
  );
}
