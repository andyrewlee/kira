"use client"

export default function LabelPrintersTemplatesPage() {
  const templates = [
    { id: "price", name: "Price Label", desc: "Item name + price + barcode." },
    { id: "sku", name: "SKU Label", desc: "SKU + name + QR." },
  ]
  const useTemplate = (id: string) => {
    const key = "lp-editor"
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
    window.location.href = "/dashboard/label-printers/editor"
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id} className="border rounded-md p-3">
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.desc}</div>
            <button className="mt-2 border px-2 py-1 text-sm" onClick={() => useTemplate(t.id)}>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  )
}
