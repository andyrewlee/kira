"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

const nav = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/printers", label: "Printers" },
  { href: "/dashboard/layouts", label: "Layouts" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="bg-white border-b-2 border-black text-black h-14">
      <div className="mx-auto max-w-6xl relative flex items-center h-full px-6 sm:px-8">
        <Link href="/dashboard" className="font-mono tracking-widest text-sm uppercase text-black">
          kira
        </Link>
        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3 h-full">
          <UserButton afterSignOutUrl="/" />
          <button
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="dashboard-mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <span className={`absolute left-1/2 top-1/2 h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-transform duration-200 ease-out ${open ? 'rotate-45' : '-translate-y-[6px]'}`} />
              <span className={`absolute left-1/2 ${open ? 'top-1/2' : 'top-[calc(50%+1px)]'} h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-all duration-200 ease-out ${open ? 'scale-x-0' : 'scale-x-100'}`} />
              <span className={`absolute left-1/2 top-1/2 h-[2px] w-[16px] -translate-x-1/2 -translate-y-1/2 bg-black transition-transform duration-200 ease-out ${open ? '-rotate-45' : 'translate-y-[6px]'}`} />
            </span>
            <span className="text-sm">Menu</span>
          </button>
        </div>
        {open && (
          <div
            id="dashboard-mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full z-20 bg-white border-b-2 border-t-2 border-black"
          >
            <div className="flex flex-col divide-y-2 divide-black">
              {nav.map((item) => {
                const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-6 py-3 text-base ${active ? 'font-medium' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
