"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const nav = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/showcase", label: "Showcase" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Close mobile menu on route change
    setOpen(false);
  }, [pathname]);
  return (
    <header className="sticky top-0 z-10 bg-white border-b-2 border-black text-black">
      <div className="mx-auto max-w-6xl relative flex items-center py-3 px-6 sm:px-8">
        <Link href="/" className="font-mono tracking-widest text-sm uppercase text-black">
          kira
        </Link>
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative inline-block text-sm text-black"
                aria-current={active ? "page" : undefined}
              >
                <span className="hover:opacity-70">{item.label}</span>
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black" />
                )}
              </Link>
            );
          })}
        </nav>
        {/* Desktop actions */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <button className="px-3 py-1.5 border-2 border-black bg-white text-black hover:-translate-y-0.5 transition-transform">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <button className="px-3 py-1.5 border-2 border-black bg-black text-white hover:-translate-y-0.5 transition-transform">
                Get started
              </button>
            </SignUpButton>
          </Unauthenticated>
        </div>

        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span
              className={`absolute left-1/2 top-1/2 h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-transform duration-200 ease-out ${open ? 'rotate-45' : '-translate-y-[6px]'}`}
            />
            <span
              className={`absolute left-1/2 ${open ? 'top-1/2' : 'top-[calc(50%+1px)]'} h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-all duration-200 ease-out ${open ? 'scale-x-0' : 'scale-x-100'}`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-transform duration-200 ease-out ${open ? '-rotate-45' : 'translate-y-[6px]'}`}
            />
          </span>
          <span className="text-sm">Menu</span>
        </button>

        {/* Mobile panel */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full z-20 bg-white border-b-2 border-t-2 border-black"
          >
            {/* perforation */}
            <div className="h-[8px] w-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
            <div className="flex flex-col divide-y-2 divide-black">
              {nav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-6 py-3 text-base ${active ? 'font-medium' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="px-6 py-4 flex items-center gap-3">
                <Authenticated>
                  <UserButton afterSignOutUrl="/" />
                </Authenticated>
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                    <button className="px-3 py-1.5 border-2 border-black bg-white text-black">Sign in</button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                    <button className="px-3 py-1.5 border-2 border-black bg-black text-white">Get started</button>
                  </SignUpButton>
                </Unauthenticated>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
