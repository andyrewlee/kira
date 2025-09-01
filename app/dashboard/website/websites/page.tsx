"use client"

type Site = { id: string; name: string; html: string; status: "draft" | "live" }

export default function WebsitesListPage() {
  const sites: Site[] = JSON.parse(typeof window !== "undefined" ? (localStorage.getItem("sites") || "[]") : "[]")
  const write = (list: Site[]) => localStorage.setItem("sites", JSON.stringify(list))
  const publish = (id: string) => {
    const next = sites.map(s => s.id === id ? { ...s, status: "live" } : s)
    write(next); location.reload()
  }
  const rollback = (id: string) => {
    const next = sites.map(s => s.id === id ? { ...s, status: "draft" } : s)
    write(next); location.reload()
  }
  const preview = (id: string) => {
    const s = sites.find(x => x.id === id); if (!s) return
    const w = window.open("", "_blank"); if (w) { w.document.write(s.html); w.document.close() }
  }
  return (
    <div className="space-y-4">
      {sites.length === 0 ? (
        <div className="text-sm text-muted-foreground">No sites yet. Create one from the Generator.</div>
      ) : (
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
      )}
    </div>
  )
}
