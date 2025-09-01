"use client"

import React, { useMemo } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader() {
  const pathname = usePathname()
  const segs = (pathname || "").split("/").filter(Boolean)
  const crumbs = useMemo(() => {
    const labelFor = (s: string) =>
      ({
        printers: "Printers",
        website: "Custom Website",
        pickup: "Pickup Screen",
        "phone-agent": "Phone Agent",
        register: "Register",
        settings: "Settings",
        editor: "Editor",
        templates: "Templates",
        layout: "Layout",
        websites: "Websites",
        screens: "Screens",
        agents: "Agents",
      } as const)[s] ?? s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

    const list: Array<{ href?: string; label: string }> = []
    if (!pathname) return list
    const startIdx = segs[0] === "dashboard" ? 1 : 0
    const basePrefix = segs[0] === "dashboard" ? "/dashboard" : ""
    let acc = basePrefix
    for (let i = startIdx; i < segs.length; i++) {
      acc += `/${segs[i]}`
      list.push({ href: i < segs.length - 1 ? acc : undefined, label: labelFor(segs[i]) })
    }
    return list
  }, [pathname, segs])
  // Breadcrumbs rendered separately in PageBreadcrumbs
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, idx) => (
              <React.Fragment key={`${c.label}-${idx}`}>
                <BreadcrumbItem>
                  {c.href ? (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < crumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Breadcrumbs */}
      {/* Breadcrumbs moved to PageBreadcrumbs in layout */}
    </header>
  )
}
