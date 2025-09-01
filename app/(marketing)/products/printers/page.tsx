"use client";

import SiteFooter from "@/components/SiteFooter";

export default function PrintersPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Printers</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Design receipts and labels that fit your workflow—use live Square order data, add logos and QR/barcodes, and push updates instantly.
          </p>
        </section>

        {/* Benefits / Why it helps */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Entire order</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Print the whole order on one slip—attach or hand to customer.</li>
              <li>Customize content: items, modifiers, notes, pickup/delivery details.</li>
              <li>Add logos and QR codes for promos, loyalty, menus, or feedback.</li>
              <li>Match your brand with type, spacing, and rules.</li>
              <li>Schedule seasonal designs; roll back anytime.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Per item</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Print one label per item; surface modifiers clearly.</li>
              <li>Ideal for cafes, boba, retail, and fulfillment.</li>
              <li>Optional QR/barcodes for scanners and automations.</li>
              <li>Fast setup; uses live Square order data.</li>
            </ul>
          </div>
        </section>

        {/* Examples */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] mb-4">Examples</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReceiptCafe />
            <ReceiptBoutique />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <LabelShipping />
            <LabelPriceTag />
            <LabelShelf />
            <LabelCoffeeBag />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Connect Square and approve permissions for Orders, Catalog, and Webhooks.</li>
              <li>Pick a template for Entire Order or Per Item and choose fields.</li>
              <li>We listen for new orders via webhooks and format your print(s).</li>
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
                <p>Common thermal receipt and label printers used with Square (e.g. Star Micronics). Tell us your model if unsure.</p>
              </div>
              <div>
                <div className="font-medium">Can I include QR/barcodes?</div>
                <p>Yes. Add QR codes for menus, loyalty, or feedback; use barcodes for scanners.</p>
              </div>
              <div>
                <div className="font-medium">How long does setup take?</div>
                <p>Usually minutes—connect Square, pick a template, print a test, and go live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Design your templates (order or item) and run a test</div>
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

function LabelShipping() {
  return (
    <Card title="4×6 shipping label">
      <div className="grid grid-cols-3 gap-2 text-[10px] leading-4">
        <div className="col-span-2">
          <div className="font-bold">From</div>
          <div>Kira Fulfillment</div>
          <div>100 Print Way</div>
          <div>New York, NY 10001</div>
        </div>
        <div>
          <div className="font-bold">To</div>
          <div>Alex Lee</div>
          <div>42 Orchard St</div>
          <div>San Francisco, CA 94110</div>
        </div>
      </div>
      <div className="mt-3 h-14 bg-[repeating-linear-gradient(90deg,_#000,_#000_2px,_transparent_2px,_transparent_6px)]" />
      <div className="mt-2 text-center text-[10px]">TRACKING: 1Z 999 999 99 9999</div>
    </Card>
  );
}

function LabelPriceTag() {
  return (
    <Card title="Price tag label">
      <div className="text-center">
        <div className="font-mono tracking-widest text-xs">KIRA STUDIO</div>
        <div className="mt-1 text-3xl font-mono">$48</div>
        <div className="mt-1 text-[10px]">Linen Hand Towel · Sand</div>
      </div>
      <div className="mt-3 h-9 bg-[repeating-linear-gradient(90deg,_#000,_#000_6px,_transparent_6px,_transparent_12px)]" />
    </Card>
  );
}

function LabelShelf() {
  return (
    <Card title="Shelf label">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-sm">Blueberries 6oz</div>
        <div className="font-mono text-2xl">$3.99</div>
      </div>
      <div className="mt-2 text-[10px]">Origin: Maine · Organic</div>
      <div className="mt-3 grid grid-cols-3 gap-3 items-center">
        <div className="col-span-2 text-[10px] leading-4">Scan for recipe ideas</div>
        <div className="col-span-1 aspect-square border-2 border-black flex items-center justify-center text-[10px]">QR</div>
      </div>
    </Card>
  );
}

function LabelCoffeeBag() {
  return (
    <Card title="Coffee bag label">
      <div className="text-center">
        <div className="tracking-[0.4em] uppercase text-xs">Kira Coffee</div>
        <div className="mt-1 font-mono text-xl">Ethiopia Yirgacheffe</div>
        <div className="mt-1 text-[10px]">Notes: Bergamot · Peach · Floral</div>
      </div>
      <div className="mt-3 border-t border-dashed border-black" />
      <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
        <div>
          <div className="font-bold">Process</div>
          <div>Washed</div>
        </div>
        <div>
          <div className="font-bold">Roast</div>
          <div>Light</div>
        </div>
        <div>
          <div className="font-bold">Weight</div>
          <div>12 oz</div>
        </div>
      </div>
    </Card>
  );
}
