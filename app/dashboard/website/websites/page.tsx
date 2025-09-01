"use client"

import { useState } from "react"

type Site = { id: string; name: string; html: string; status: "draft" | "live" }

const MOCK_SITES: Site[] = [
  { id: "s1", name: "Kira Coffee — Main", html: "<h1>Main</h1>", status: "live" },
  { id: "s2", name: "Kira Coffee — East", html: "<h1>East</h1>", status: "draft" },
]

export default function WebsitesListPage() {
  const [sites, setSites] = useState<Site[]>(MOCK_SITES)
  const publish = (id: string) => setSites(s => s.map(x => x.id === id ? { ...x, status: "live" } : x))
  const rollback = (id: string) => setSites(s => s.map(x => x.id === id ? { ...x, status: "draft" } : x))
  const preview = (id: string) => { const s = sites.find(x => x.id === id); if (!s) return; const w = window.open("", "_blank"); if (w) { w.document.write(s.html); w.document.close() } }
  return (
    <div className="space-y-4">
      <ul className="divide-y border rounded-md">
        {sites.map(s => (
          <li key={s.id} className="flex items-center justify-between px-3 py-2">
            <div className="text-sm"><span className="font-medium">{s.name}</span> <span className="text-muted-foreground">({s.status})</span></div>
            <div className="flex gap-2">
              <button className="border px-2 py-1 text-sm" onClick={() => preview(s.id)}>Preview</button>
              {s.status === "live" ? (
                <button className="border px-2 py-1 text-sm" onClick={() => rollback(s.id)}>Rollback</button>
              ) : (
                <button className="border px-2 py-1 text-sm" onClick={() => publish(s.id)}>Publish</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted-foreground">Mock list — no persistence.</div>
    </div>
  )
}
