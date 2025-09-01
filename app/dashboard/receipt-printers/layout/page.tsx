"use client"

type Saved = { id: string; name: string; data: any }

export default function ReceiptPrintersLayoutPage() {
  const key = "rp-editor"
  const listKey = "rp-layouts"
  const raw = (typeof window !== "undefined" && localStorage.getItem(listKey)) || "[]"
  const layouts: Saved[] = JSON.parse(raw)

  const save = () => {
    const data = localStorage.getItem(key)
    if (!data) return alert("Nothing to save")
    const name = prompt("Name this layout", `Layout ${layouts.length + 1}`)
    if (!name) return
    const s = { id: Math.random().toString(36).slice(2), name, data: JSON.parse(data!) }
    const next = [...layouts, s]
    localStorage.setItem(listKey, JSON.stringify(next))
    location.reload()
  }
  const load = (id: string) => {
    const found = layouts.find(l => l.id === id)
    if (!found) return
    localStorage.setItem(key, JSON.stringify(found.data))
    window.location.href = "/dashboard/receipt-printers/editor"
  }
  const del = (id: string) => {
    const next = layouts.filter(l => l.id !== id)
    localStorage.setItem(listKey, JSON.stringify(next))
    location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button className="border px-2 py-1 text-sm" onClick={save}>Save current as layout</button>
      </div>
      {layouts.length === 0 ? (
        <div className="text-sm text-muted-foreground">No saved layouts yet.</div>
      ) : (
        <ul className="divide-y border rounded-md">
          {layouts.map(l => (
            <li key={l.id} className="flex items-center justify-between px-3 py-2">
              <div className="text-sm">{l.name}</div>
              <div className="flex gap-2">
                <button className="border px-2 py-1 text-sm" onClick={() => load(l.id)}>Load</button>
                <button className="border px-2 py-1 text-sm" onClick={() => del(l.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
