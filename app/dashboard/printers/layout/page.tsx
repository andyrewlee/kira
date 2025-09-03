"use client"

import { useState } from "react"

type Saved = { id: string; name: string; data: unknown }

export default function PrintersLayout() {
  const [orderLayouts, setOrderLayouts] = useState<Saved[]>([])
  const [itemLayouts, setItemLayouts] = useState<Saved[]>([])

  const saveOrder = () => {
    const name = prompt("Name this order layout", `Order ${orderLayouts.length + 1}`)
    if (!name) return
    const s = { id: Math.random().toString(36).slice(2), name, data: {} }
    setOrderLayouts(prev => [...prev, s])
  }
  const saveItem = () => {
    const name = prompt("Name this item layout", `Item ${itemLayouts.length + 1}`)
    if (!name) return
    const s = { id: Math.random().toString(36).slice(2), name, data: {} }
    setItemLayouts(prev => [...prev, s])
  }

  const del = (scope: "order" | "item", id: string) => {
    if (scope === "order") setOrderLayouts(list => list.filter(l => l.id !== id))
    else setItemLayouts(list => list.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Entire Order Layouts</h2>
          <button className="border px-2 py-1 text-sm" onClick={saveOrder}>Save current as order</button>
        </div>
        {orderLayouts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No saved order layouts yet.</div>
        ) : (
          <ul className="divide-y border rounded-md">
            {orderLayouts.map(l => (
              <li key={l.id} className="flex items-center justify-between px-3 py-2">
                <div className="text-sm">{l.name}</div>
                <div className="flex gap-2">
                  <button className="border px-2 py-1 text-sm" onClick={() => { window.location.href = "/dashboard/printers/editor" }}>Load</button>
                  <button className="border px-2 py-1 text-sm" onClick={() => del("order", l.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Per Item Layouts</h2>
          <button className="border px-2 py-1 text-sm" onClick={saveItem}>Save current as item</button>
        </div>
        {itemLayouts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No saved item layouts yet.</div>
        ) : (
          <ul className="divide-y border rounded-md">
            {itemLayouts.map(l => (
              <li key={l.id} className="flex items-center justify-between px-3 py-2">
                <div className="text-sm">{l.name}</div>
                <div className="flex gap-2">
                  <button className="border px-2 py-1 text-sm" onClick={() => { window.location.href = "/dashboard/printers/editor" }}>Load</button>
                  <button className="border px-2 py-1 text-sm" onClick={() => del("item", l.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
