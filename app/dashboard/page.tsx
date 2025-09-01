"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type Activity = { t: number; text: string }

export default function DashboardHome() {
  const [square, setSquare] = useState<{ connected: boolean; location?: string }>({ connected: false })
  const [rpLayouts, setRpLayouts] = useState(0)
  const [lpLayouts, setLpLayouts] = useState(0)
  const [printers, setPrinters] = useState(0)
  const [sites, setSites] = useState({ total: 0, live: 0 })
  const [screens, setScreens] = useState(0)
  const [agentPrompt, setAgentPrompt] = useState(false)
  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {
    try {
      const conn = JSON.parse(localStorage.getItem("square-conn") || "{}")
      setSquare({ connected: !!conn.connected, location: conn.location || undefined })
      setRpLayouts((JSON.parse(localStorage.getItem("rp-layouts") || "[]") as any[]).length)
      setLpLayouts((JSON.parse(localStorage.getItem("lp-layouts") || "[]") as any[]).length)
      setPrinters((JSON.parse(localStorage.getItem("rp-devices") || "[]") as any[]).filter((d: any) => d.paired).length)
      const s = JSON.parse(localStorage.getItem("sites") || "[]") as any[]
      setSites({ total: s.length, live: s.filter(x => x.status === "live").length })
      setScreens((JSON.parse(localStorage.getItem("pickup-screens") || "[]") as any[]).length)
      setAgentPrompt(!!localStorage.getItem("agent-prompt"))
      setActivity(JSON.parse(localStorage.getItem("activity") || "[]"))
    } catch {}
  }, [])

  const onboarding = useMemo(() => {
    const items: Array<{ done: boolean; label: string; href: string }> = []
    items.push({ done: square.connected, label: square.connected ? `Square connected (${square.location})` : "Connect Square", href: "/dashboard/settings" })
    items.push({ done: rpLayouts > 0, label: rpLayouts > 0 ? "Receipt layout created" : "Create your first receipt layout", href: "/dashboard/receipt-printers/editor" })
    items.push({ done: printers > 0, label: printers > 0 ? "Printer paired" : "Register a receipt printer", href: "/dashboard/receipt-printers/register" })
    items.push({ done: lpLayouts > 0, label: lpLayouts > 0 ? "Label layout created" : "Create your first label layout", href: "/dashboard/label-printers/editor" })
    items.push({ done: sites.total > 0, label: sites.total > 0 ? "Website generated" : "Generate your website", href: "/dashboard/website/editor" })
    items.push({ done: screens > 0, label: screens > 0 ? "Pickup screen added" : "Add a pickup screen", href: "/dashboard/pickup/screens" })
    items.push({ done: agentPrompt, label: agentPrompt ? "Phone agent prompt set" : "Configure phone agent prompt", href: "/dashboard/phone-agent/editor" })
    return items
  }, [square, rpLayouts, printers, lpLayouts, sites, screens, agentPrompt])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Kpi title="Square" value={square.connected ? "Connected" : "Not connected"} hint={square.location || ""} href="/dashboard/settings" />
        <Kpi title="Receipt Layouts" value={String(rpLayouts)} href="/dashboard/receipt-printers/layout" />
        <Kpi title="Paired Printers" value={String(printers)} href="/dashboard/receipt-printers/register" />
        <Kpi title="Label Layouts" value={String(lpLayouts)} href="/dashboard/label-printers/layout" />
        <Kpi title="Websites" value={`${sites.live}/${sites.total} live`} href="/dashboard/website/websites" />
        <Kpi title="Pickup Screens" value={String(screens)} href="/dashboard/pickup/screens" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border rounded-md p-4">
          <h2 className="text-base font-medium mb-2">Onboarding Checklist</h2>
          <ul className="space-y-2 text-sm">
            {onboarding.map((i) => (
              <li key={`${i.href}-${i.label}`} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={!!i.done} readOnly className="accent-black" onChange={() => {}} />
                <Link href={i.href} className="hover:underline">{i.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border rounded-md p-4">
          <h2 className="text-base font-medium mb-2">Recent Activity</h2>
          {activity.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recent activity yet.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {activity.slice(0, 8).map((a, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-muted-foreground">{new Date(a.t).toLocaleString()}</span>
                  <span>— {a.text}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Kpi({ title, value, hint, href }: { title: string; value: string; hint?: string; href: string }) {
  return (
    <Link href={href} className="border rounded-md p-4 hover:bg-accent">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold leading-tight">{value}</div>
      {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
    </Link>
  )
}
