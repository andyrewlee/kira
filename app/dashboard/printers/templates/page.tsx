"use client"

export default function PrintersTemplates() {
  const orderTemplates = [
    { id: "simple", name: "Simple Order", desc: "Store header, items, totals, thank you." },
    { id: "order-number", name: "Big Order Number", desc: "Large order number centered, minimal items." },
  ]
  const itemTemplates = [
    { id: "price", name: "Item Price Label", desc: "Item name + price + barcode." },
    { id: "sku", name: "Item SKU Label", desc: "SKU + name + QR." },
  ]

  const useOrderTemplate = (id: string) => {
    const key = "order-editor"
    const payload = id === "order-number"
      ? [
          { id: "t1", type: "text", text: "Order {{order.number}}", fontSize: 28, align: "center", x: 20, y: 20, w: 340, h: 40 },
          { id: "t2", type: "line", thickness: 2, x: 20, y: 70, w: 340, h: 2 }
        ]
      : [
          { id: "h1", type: "text", text: "{{order.location}}", fontSize: 16, align: "center", x: 20, y: 16, w: 340, h: 24 },
          { id: "ln1", type: "line", thickness: 2, x: 20, y: 48, w: 340, h: 2 },
          { id: "n1", type: "text", text: "#{{order.number}}", fontSize: 14, align: "left", x: 20, y: 56, w: 120, h: 20 }
        ]
    localStorage.setItem(key, JSON.stringify(payload))
    localStorage.setItem("printers-scope", "order")
    window.location.href = "/dashboard/printers/editor"
  }

  const useItemTemplate = (id: string) => {
    const key = "item-editor"
    const payload = id === "price"
      ? [
          { id: "t1", type: "text", text: "{{order.items.0.name}}", fontSize: 14, align: "left", x: 10, y: 8, w: 300, h: 20 },
          { id: "t2", type: "text", text: "$ {{order.total}}", fontSize: 16, align: "right", x: 10, y: 28, w: 300, h: 20 },
          { id: "l1", type: "line", thickness: 2, x: 10, y: 52, w: 300, h: 2 }
        ]
      : [
          { id: "q1", type: "qr", value: "{{order.id}}", x: 230, y: 8, w: 80, h: 80 },
          { id: "n1", type: "text", text: "{{order.items.0.name}}", fontSize: 12, align: "left", x: 10, y: 8, w: 210, h: 20 }
        ]
    localStorage.setItem(key, JSON.stringify(payload))
    localStorage.setItem("printers-scope", "item")
    window.location.href = "/dashboard/printers/editor"
  }

  return (
    <div className="space-y-6">
      <h1 className="font-mono text-2xl">Printers · Templates</h1>
      <section className="space-y-2">
        <h2 className="text-base font-medium">Entire Order Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orderTemplates.map(t => (
            <div key={t.id} className="border rounded-md p-3">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.desc}</div>
              <button className="mt-2 border px-2 py-1 text-sm" onClick={() => useOrderTemplate(t.id)}>Use Template</button>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-base font-medium">Per Item Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {itemTemplates.map(t => (
            <div key={t.id} className="border rounded-md p-3">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.desc}</div>
              <button className="mt-2 border px-2 py-1 text-sm" onClick={() => useItemTemplate(t.id)}>Use Template</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
