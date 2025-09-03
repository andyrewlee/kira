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
    const t = id === 'order-number' ? 'order-number' : 'order-simple'
    window.location.href = `/dashboard/printers/editor?template=${t}`
  }

  const useItemTemplate = (id: string) => {
    const t = id === 'price' ? 'item-price' : 'item-sku'
    window.location.href = `/dashboard/printers/editor?template=${t}`
  }

  return (
    <div className="space-y-6">
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
