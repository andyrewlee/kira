"use client";

import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-white text-black mt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-20 pt-12 pb-10">
        {/* Perforation strip */}
        <div
          className="h-[10px] w-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] [background-size:8px_8px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-50"
          aria-hidden="true"
        />

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Product</div>
            <ul className="mt-3 space-y-2">
              <li><Link href="/features" className="hover:opacity-70">Features</Link></li>
              <li><Link href="/showcase" className="hover:opacity-70">Showcase</Link></li>
              <li><Link href="/pricing" className="hover:opacity-70">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Learn</div>
            <ul className="mt-3 space-y-2">
              <li><Link href="/how-it-works" className="hover:opacity-70">How it works</Link></li>
              <li><Link href="/" className="hover:opacity-70">Home</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Company</div>
            <ul className="mt-3 space-y-2">
              <li><a href="mailto:hello@kira.app" className="hover:opacity-70">Contact</a></li>
              <li><a href="#" className="pointer-events-none opacity-50">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em]">Legal</div>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="pointer-events-none opacity-50">Privacy</a></li>
              <li><a href="#" className="pointer-events-none opacity-50">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black" />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs">
          <div className="flex items-center gap-2">
            {/* Registration mark */}
            <span className="relative inline-flex items-center justify-center h-4 w-4">
              <span className="absolute inset-0 rounded-full border border-black" />
              <span className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-black" />
              <span className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-black" />
            </span>
            <span className="font-mono uppercase tracking-[0.25em]">Printed beautifully</span>
          </div>
          <div>© {year} kira</div>
        </div>
      </div>
    </footer>
  );
}
