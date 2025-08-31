"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname()
  const title = useMemo(() => {
    const routes: Array<[string, string]> = [
      ["/dashboard/pickup", "Pickup Board"],
      ["/dashboard/printers", "Printers"],
      ["/dashboard/layouts", "Layouts"],
      ["/dashboard/templates", "Templates"],
      ["/dashboard/settings", "Settings"],
      ["/dashboard", "Home"],
    ]
    const entry = routes.find(([k]) => pathname?.startsWith(k))
    if (entry) return entry[1]
    // Fallback: last segment capitalized
    const seg = pathname?.split("/").filter(Boolean).pop() || ""
    return seg ? seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Dashboard"
  }, [pathname])
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
