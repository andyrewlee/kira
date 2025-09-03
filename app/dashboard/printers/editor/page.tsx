"use client"

import { useMemo, useState } from "react"
import FabricEditor from "@/components/editor/FabricEditor"

type Scope = "order" | "item"

export default function PrintersEditor() {
  const [scope, setScope] = useState<Scope>("order")
  const [scale] = useState(1)

  const cfg = useMemo(() => {
    return scope === "order"
      ? { key: "order-editor", title: "Receipt (TM‑m30)" }
      : { key: "item-editor", title: "Label (TM‑L100)" }
  }, [scope])

  return (
    <div className="space-y-4">
      <div>
        <FabricEditor
          width={640}
          height={1200}
          scale={scale}
          sidebarTop={(
            <div className="flex items-center justify-between">
              <div className="inline-flex border rounded-md overflow-hidden text-sm">
                <button
                  className={`px-3 py-1 ${scope === "order" ? "bg-black text-white" : "bg-white"}`}
                  onClick={() => setScope("order")}
                >
                  Entire order
                </button>
                <button
                  className={`px-3 py-1 border-l ${scope === "item" ? "bg-black text-white" : "bg-white"}`}
                  onClick={() => setScope("item")}
                >
                  Per item
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

function templateFromLocation(){
  if (typeof window === 'undefined') return [] as any
  const params = new URLSearchParams(window.location.search)
  const t = params.get('template')
  switch(t){
    case 'order-number':
      return [
        { id: 't1', type: 'text', text: 'Order {{order.number}}', bind: 'Order {{order.number}}', fontSize: 28, align: 'center', x: 20, y: 20, w: 340, h: 40 },
        { id: 't2', type: 'line', thickness: 2, x: 20, y: 70, w: 340, h: 2 }
      ] as any
    case 'order-simple':
      return [
        { id: 'h1', type: 'text', text: '{{order.location}}', bind: '{{order.location}}', fontSize: 16, align: 'center', x: 20, y: 16, w: 340, h: 24 },
        { id: 'ln1', type: 'line', thickness: 2, x: 20, y: 48, w: 340, h: 2 },
        { id: 'n1', type: 'text', text: '#{{order.number}}', bind: '#{{order.number}}', fontSize: 14, align: 'left', x: 20, y: 56, w: 120, h: 20 }
      ] as any
    case 'item-sku':
      return [
        { id: 'q1', type: 'qr', value: '{{order.id}}', x: 230, y: 8, w: 80, h: 80 },
        { id: 'n1', type: 'text', text: '{{order.items.0.name}}', bind: '{{order.items.0.name}}', fontSize: 12, align: 'left', x: 10, y: 8, w: 210, h: 20 }
      ] as any
    case 'item-price':
      return [
        { id: 't1', type: 'text', text: '{{order.items.0.name}}', bind: '{{order.items.0.name}}', fontSize: 14, align: 'left', x: 10, y: 8, w: 300, h: 20 },
        { id: 't2', type: 'text', text: '{{currency order.total_money}}', bind: '{{currency order.total_money}}', fontSize: 16, align: 'right', x: 10, y: 28, w: 300, h: 20 },
        { id: 'l1', type: 'line', thickness: 2, x: 10, y: 52, w: 300, h: 2 }
      ] as any
    default:
      return [] as any
  }
}
