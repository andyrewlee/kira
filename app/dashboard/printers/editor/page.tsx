"use client"

import { useEffect, useMemo, useState } from "react"
import CanvasEditor from "@/components/editor/CanvasEditor"

type Scope = "order" | "item"

export default function PrintersEditor() {
  const [scope, setScope] = useState<Scope>("order")
  const [paper, setPaper] = useState<{ w:number; h:number; var:boolean }>({ w: 640, h: 1200, var: true })
  const [scale, setScale] = useState(1)

  const cfg = useMemo(() => {
    return scope === "order"
      ? { key: "order-editor", title: "Receipt (TM‑m30)" }
      : { key: "item-editor", title: "Label (TM‑L100)" }
  }, [scope])

  const setPreset = (id: string) => {
    const mm = (n:number)=> Math.round(n*203/25.4)
    switch(id){
      case 'm30-58': setPaper({ w: mm(58), h: 1200, var: true }); break
      case 'm30-80': setPaper({ w: mm(80), h: 1200, var: true }); break
      case 'l100-40': setPaper({ w: mm(40), h: mm(40), var: false }); break
      case 'l100-58': setPaper({ w: mm(58), h: mm(58), var: false }); break
      case 'l100-80': setPaper({ w: mm(80), h: mm(80), var: false }); break
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl">Printers · Editor</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-3 space-y-2">
          <div className="text-xs font-medium">Paper</div>
          <div className="flex flex-col gap-2">
            <select className="border rounded px-2 py-1 text-sm" onChange={e=>setPreset(e.target.value)} defaultValue={scope==='order'?'m30-80':'l100-58'}>
              <option value="m30-58">TM‑m30 58mm @203dpi</option>
              <option value="m30-80">TM‑m30 80mm @203dpi</option>
              <option value="l100-40">TM‑L100 40mm @203dpi</option>
              <option value="l100-58">TM‑L100 58mm @203dpi</option>
              <option value="l100-80">TM‑L100 80mm @203dpi</option>
            </select>
            <div className="text-xs text-muted-foreground">{cfg.title} • {paper.w}px × {paper.h}px</div>
            <label className="text-xs flex items-center gap-2">Zoom<input type="range" min={0.5} max={2} step={0.25} value={scale} onChange={e=>setScale(Number(e.target.value))} /> <span>{Math.round(scale*100)}%</span></label>
          </div>
        </div>
        <div className="md:col-span-9">
          <CanvasEditor storageKey={cfg.key} width={paper.w} height={paper.h} persist={false} scale={scale} showGrid initial={templateFromLocation()} />
        </div>
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
