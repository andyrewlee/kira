"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Printer, Tag, Globe, ShoppingCart, Monitor, PhoneCall } from "lucide-react";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef<HTMLDivElement | null>(null);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    // Close mobile menu on route change
    setOpen(false);
    setProductOpen(false);
  }, [pathname]);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!productOpen) return;
      const m = document.getElementById("products-mega-menu");
      const target = e.target as Node;
      const insideTrigger = productRef.current?.contains(target);
      const insideMenu = m?.contains(target as Node);
      if (!insideTrigger && !insideMenu) {
        setProductOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setProductOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [productOpen]);

  // Position the mega menu to match the inner header container (from KIRA to Get started)
  const positionMenu = useMemo(
    () => () => {
      const inner = headerInnerRef.current;
      const rect = inner?.getBoundingClientRect();
      const top = rect?.bottom ?? headerRef.current?.getBoundingClientRect()?.bottom ?? 56;
      if (rect) {
        setMenuStyle({ position: "fixed", left: rect.left, top, width: rect.width, zIndex: 60 });
      } else {
        setMenuStyle({ position: "fixed", left: 0, right: 0, top, zIndex: 60 });
      }
    },
    []
  );

  useEffect(() => {
    if (!productOpen) return;
    positionMenu();
    // Re-measure after fonts/layout settle
    const raf = requestAnimationFrame(positionMenu);
    const t = setTimeout(positionMenu, 200);
    // Some browsers expose font loading API
    // @ts-ignore
    if (document.fonts && document.fonts.ready) {
      // @ts-ignore
      document.fonts.ready.then(() => positionMenu());
    }
    const onResize = () => positionMenu();
    const onScroll = () => positionMenu();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll as any);
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [productOpen, positionMenu]);

  const productLinks = [
    { href: "/products/printers", label: "Printers", desc: "Design receipts and labels powered by Square.", Icon: Printer },
    { href: "/products/custom-website", label: "Custom Website", desc: "AI‑shaped site grounded in your Square data.", Icon: Globe },
    { href: "/products/pickup-screen", label: "Pickup Screen", desc: "Delightful order boards with voice callouts.", Icon: Monitor },
    { href: "/products/phone-agent", label: "Phone Agent", desc: "Answers calls with accurate info from Square.", Icon: PhoneCall },
  ] as const;
  return (
    <header ref={headerRef} className="sticky top-0 z-10 bg-white border-b-2 border-black text-black">
      <div ref={headerInnerRef} className="mx-auto max-w-6xl w-full relative flex items-center py-3 px-6 sm:px-8">
        <Link href="/" className="tracking-widest text-base font-semibold text-black">
          KIRA
        </Link>
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {/* Products dropdown */}
          <div
            className="relative"
            ref={productRef}
            onMouseEnter={() => setProductOpen(true)}
          >
            <button
              type="button"
              className="relative inline-block text-sm text-black"
              aria-haspopup="menu"
              aria-expanded={productOpen}
              onClick={() => setProductOpen((v) => !v)}
              ref={triggerBtnRef}
            >
              <span className="hover:opacity-70">Products</span>
              {pathname.startsWith("/products") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black" />
              )}
            </button>
            {/* Mega menu rendered outside nav for container-aligned positioning */}
          </div>

          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
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
            <Link href="/demo" className="px-3 py-1.5 border-2 border-black bg-black text-white hover:-translate-y-0.5 transition-transform">
              Get a free demo
            </Link>
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
            <div className="flex flex-col divide-y-2 divide-black">
              {/* Products list */}
              <div className="px-6 py-3">
                <div className="text-base font-medium">Products</div>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  <Link href="/products" onClick={() => setOpen(false)} className="text-sm underline">All Products</Link>
                  {productLinks.map((p) => (
                    <Link key={p.href} href={p.href} onClick={() => setOpen(false)} className="text-sm">
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
              {nav.map((item) => {
                const active = pathname.startsWith(item.href);
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
                  <Link href="/demo" className="px-3 py-1.5 border-2 border-black bg-black text-white">Get a free demo</Link>
                </Unauthenticated>
              </div>
            </div>
          </div>
        )}
        {/* Products mega menu aligned to header container */}
        {productOpen && (
          <div
            id="products-mega-menu"
            role="menu"
            className="hidden md:block absolute left-0 right-0 top-full border-2 border-black bg-white shadow-[8px_8px_0_0_#000]"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <div className="px-6 sm:px-8 py-3 sm:py-4">
              <div className="text-[11px] tracking-[0.25em] uppercase mb-3">Product</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {productLinks.map(({ href, label, desc, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setProductOpen(false)}
                    className="group flex items-start gap-3 rounded border-2 border-transparent hover:border-black px-3 py-2"
                  >
                    <span className="mt-0.5 shrink-0 border-2 border-black p-1 bg-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <div className="text-sm font-medium leading-5 group-hover:underline">{label}</div>
                      <div className="text-xs text-black/70 leading-5">{desc}</div>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
