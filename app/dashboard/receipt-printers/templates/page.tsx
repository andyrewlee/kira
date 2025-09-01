"use client"

export default function ReceiptPrintersTemplatesPage() {
  const templates = [
    { id: "simple", name: "Simple Receipt", desc: "Store header, items, totals, thank you." },
    { id: "order-number", name: "Big Number", desc: "Large order number centered, minimal items." },
  ]
  const useTemplate = (id: string) => {
    const key = "rp-editor"
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
    window.location.href = "/dashboard/receipt-printers/editor"
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
