import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const products = [
  { name: "Receipt Printers", slug: "receipt-printers", blurb: "Fully custom receipts from Square orders—logos, QR codes, and seasonal designs." },
  { name: "Label Printers", slug: "label-printers", blurb: "Barista-friendly labels that show modifiers clearly; QR/barcodes optional." },
  { name: "Custom Website", slug: "custom-website", blurb: "AI-shaped site grounded in your Square data. SEO and AI-discovery ready." },
  { name: "Pickup Screen", slug: "pickup-screen", blurb: "Delightful order status screens with optional voice callouts and themes." },
  { name: "Phone Agent", slug: "phone-agent", blurb: "Answers common calls with live info from Square. Review transcripts later." },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="px-6 sm:px-8 md:px-12 lg:px-20">
        <section className="mx-auto max-w-6xl pt-16 sm:pt-24">
          <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">Products</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg">
            Supercharge your Square POS with purpose-built tools you can mix and match.
          </p>
        </section>

        <section className="mx-auto max-w-6xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="border-2 border-black p-6 bg-white hover:-translate-y-0.5 transition-transform">
              <div className="font-mono text-xs uppercase tracking-[0.25em]">{p.name}</div>
              <p className="mt-3 text-base">{p.blurb}</p>
            </Link>
          ))}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
