"use client";

import SiteFooter from "@/components/SiteFooter";

export default function LabelPrintersPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Label Printers</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Clear, barista-friendly labels that show modifiers at a glance—ideal for cafes and boba shops. Optional QR/barcodes for scanners.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Workflow fit</div>
            <ul className="mt-3 list-disc pl-5 text-base leading-7">
              <li>Print labels before making drinks/food so baristas see modifiers clearly.</li>
              <li>Ideal for cafes and boba shops; reduces remake errors and speeds service.</li>
              <li>Optional QR or barcode for automated machines and back-of-house scanners.</li>
            </ul>
          </div>
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">How it works</div>
            <ol className="mt-3 list-decimal pl-5 text-base leading-7">
              <li>Connect Square and approve Orders and Catalog permissions.</li>
              <li>Map item names, sizes, and modifiers into a label layout.</li>
              <li>We format labels from incoming orders and send to your label printer.</li>
            </ol>
          </div>
        </section>

        {/* Showcase examples from the old Showcase page (labels) */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] mb-4">Examples</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LabelShipping />
            <LabelPriceTag />
            <LabelShelf />
            <LabelCoffeeBag />
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 gap-4">
          <div className="border-2 border-black p-6 bg-white">
            <div className="font-mono text-xs uppercase tracking-[0.25em]">FAQs</div>
            <div className="mt-4 space-y-4 text-base">
              <div>
                <div className="font-medium">Which label sizes are supported?</div>
                <p>Common 2×1, 2×2, and 4×6 labels. Ask us about your specific rolls.</p>
              </div>
              <div>
                <div className="font-medium">Can I include a QR/barcode?</div>
                <p>Yes—use QR to link to menus or loyalty. Use barcodes for scanners.</p>
              </div>
              <div>
                <div className="font-medium">Does it sync with Square?</div>
                <p>Yes, we use Square order data and modifiers to format labels accurately.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl mt-10">
          <div className="border-2 border-black p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em]">Ready</div>
              <div className="mt-2 text-lg">Design your label template and print a test</div>
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
