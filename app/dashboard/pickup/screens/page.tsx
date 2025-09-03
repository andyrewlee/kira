"use client"

import { useState } from "react"

type Screen = { id: string; name: string }

export default function PickupScreensPage() {
  const [list, setList] = useState<Screen[]>([])
  const write = (next: Screen[]) => { setList(next) }
  const add = () => { const name = prompt("Screen name", `Display ${list.length + 1}`); if (!name) return; write([...list, { id: Math.random().toString(36).slice(2), name }]) }
  const remove = (id: string) => write(list.filter(x => x.id !== id))
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button className="border px-3 py-1.5 text-sm" onClick={add}>Add Screen</button>
      </div>
      {list.length === 0 ? (
        <div className="text-sm text-muted-foreground">No screens yet.</div>
      ) : (
        <ul className="divide-y border rounded-md">
          {list.map(s => (
            <li key={s.id} className="flex items-center justify-between px-3 py-2 text-sm">
              <div className="font-medium">{s.name}</div>
              <div className="flex gap-2">
                <button className="border px-2 py-1" onClick={() => window.open("/dashboard/pickup", "_blank")}>Open</button>
                <button className="border px-2 py-1" onClick={() => remove(s.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
