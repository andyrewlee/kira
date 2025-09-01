"use client"

type Saved = { id: string; name: string; data: any }

export default function PrintersLayout() {
  const orderKey = "order-editor"
  const orderListKey = "order-layouts"
  const itemKey = "item-editor"
  const itemListKey = "item-layouts"

  const orderLayouts: Saved[] = JSON.parse((typeof window !== "undefined" && localStorage.getItem(orderListKey)) || "[]")
  const itemLayouts: Saved[] = JSON.parse((typeof window !== "undefined" && localStorage.getItem(itemListKey)) || "[]")

  const saveOrder = () => {
    const data = localStorage.getItem(orderKey)
    if (!data) return alert("Nothing to save from order editor")
    const name = prompt("Name this order layout", `Order ${orderLayouts.length + 1}`)
    if (!name) return
    const s = { id: Math.random().toString(36).slice(2), name, data: JSON.parse(data!) }
    const next = [...orderLayouts, s]
    localStorage.setItem(orderListKey, JSON.stringify(next))
    location.reload()
  }
  const saveItem = () => {
    const data = localStorage.getItem(itemKey)
    if (!data) return alert("Nothing to save from item editor")
    const name = prompt("Name this item layout", `Item ${itemLayouts.length + 1}`)
    if (!name) return
    const s = { id: Math.random().toString(36).slice(2), name, data: JSON.parse(data!) }
    const next = [...itemLayouts, s]
    localStorage.setItem(itemListKey, JSON.stringify(next))
    location.reload()
  }

  const load = (scope: "order" | "item", id: string) => {
    const list = scope === "order" ? orderLayouts : itemLayouts
    const key = scope === "order" ? orderKey : itemKey
    const found = list.find(l => l.id === id)
    if (!found) return
    localStorage.setItem(key, JSON.stringify(found.data))
    localStorage.setItem("printers-scope", scope)
    window.location.href = "/dashboard/printers/editor"
  }
  const del = (scope: "order" | "item", id: string) => {
    const listKey = scope === "order" ? orderListKey : itemListKey
    const layouts = scope === "order" ? orderLayouts : itemLayouts
    const next = layouts.filter(l => l.id !== id)
    localStorage.setItem(listKey, JSON.stringify(next))
    location.reload()
  }

  return (
    <div className="space-y-8">
      <h1 className="font-mono text-2xl">Printers · Layouts</h1>
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
                  <button className="border px-2 py-1 text-sm" onClick={() => load("order", l.id)}>Load</button>
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
                  <button className="border px-2 py-1 text-sm" onClick={() => load("item", l.id)}>Load</button>
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
