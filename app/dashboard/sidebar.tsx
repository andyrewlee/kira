"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const items = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/pickup", label: "Pickup Board" },
  { href: "/dashboard/printers", label: "Printers" },
  { href: "/dashboard/layouts", label: "Layouts" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="px-4 py-4">
        <Link href="/dashboard" className="font-mono tracking-widest text-sm uppercase text-black">kira</Link>
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1">
        {items.map((i) => {
          const active = i.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
              aria-current={active ? 'page' : undefined}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-black/10 flex items-center justify-between">
        <span className="text-xs opacity-70">Account</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
