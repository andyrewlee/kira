"use client"

import React, { useMemo } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function PageBreadcrumbs() {
  const pathname = usePathname()
  const segs = (pathname || "").split("/").filter(Boolean)
  const labelMap: Record<string, string> = useMemo(() => ({
    dashboard: "Home",
    printers: "Printers",
    website: "Custom Website",
    pickup: "Pickup Screen",
    "phone-agent": "Phone Agent",
    editor: "Editor",
    templates: "Templates",
    layout: "Layout",
    websites: "Websites",
    screens: "Screens",
    agents: "Agents",
  }), [])

  const crumbs = useMemo(() => {
    const out: Array<{ href?: string; label: string }> = []
    if (!pathname) return out
    let acc = ""
    for (let i = 0; i < segs.length; i++) {
      acc += `/${segs[i]}`
      const key = segs[i]
      const label = labelMap[key] || key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      out.push({ href: i < segs.length - 1 ? acc : undefined, label })
    }
    return out
  }, [pathname, segs, labelMap])

  if (segs.length <= 1) return null

  return (
    <div className="px-4 lg:px-6 pt-2">
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
  )
}
