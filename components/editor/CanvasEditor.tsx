"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import VariablesPanel from "@/components/editor/VariablesPanel"

type ElementBase = {
  id: string
  x: number
  y: number
  w: number
  h: number
  type: "text" | "image" | "qr" | "line"
}

type TextEl = ElementBase & {
  type: "text"
  text: string
  bind?: string
  fontSize: number
  align: "left" | "center" | "right"
  bold?: boolean
}

type ImageEl = ElementBase & { type: "image"; src: string }
type QrEl = ElementBase & { type: "qr"; value: string }
type LineEl = ElementBase & { type: "line"; thickness: number }

type El = TextEl | ImageEl | QrEl | LineEl

type Props = {
  storageKey: string
  width: number
  height: number
  persist?: boolean // set false for clickable prototype (no localStorage)
  scale?: number // zoom scale e.g. 1.0, 1.25
  showGrid?: boolean
  initial?: El[]
}

export default function CanvasEditor({ storageKey, width, height, persist = true, scale = 1, showGrid = true, initial }: Props) {
  const [els, setEls] = useState<El[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const sel = useMemo(() => els.find(e => e.id === selected) ?? null, [els, selected])
  const canvasRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Load/Save (optional)
  useEffect(() => {
    if (!persist) return
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      try { setEls(JSON.parse(raw)) } catch {}
    }
  }, [storageKey, persist])
  useEffect(() => {
    if (!persist) return
    localStorage.setItem(storageKey, JSON.stringify(els))
  }, [storageKey, els, persist])

  // Seed initial elements (prototype templates)
  useEffect(() => {
    if (!initial || initial.length === 0) return
    if (els.length === 0) setEls(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  // Basic keyboard controls: arrows to nudge (1px, shift=10px), delete to remove
  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return
    const onKey = (e: KeyboardEvent) => {
      if (!sel) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setEls(list => list.filter(el => el.id !== sel.id)); setSelected(null)
      }
      const step = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft') setEls(list => list.map(el => el.id === sel.id ? { ...el, x: Math.max(0, el.x - step) } as El : el))
      if (e.key === 'ArrowRight') setEls(list => list.map(el => el.id === sel.id ? { ...el, x: el.x + step } as El : el))
      if (e.key === 'ArrowUp') setEls(list => list.map(el => el.id === sel.id ? { ...el, y: Math.max(0, el.y - step) } as El : el))
      if (e.key === 'ArrowDown') setEls(list => list.map(el => el.id === sel.id ? { ...el, y: el.y + step } as El : el))
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [sel])

  // Sample data for binding previews
  const SAMPLE = useMemo(() => ({
    order: {
      id: 'O-12345', number: 'A57', customer: { name: 'Casey' },
      line_items: [ { name: 'Americano', quantity: '1', total_money: { amount: 350, currency: 'USD' } }, { name: 'Muffin', quantity: '1', total_money: { amount: 275, currency: 'USD' } } ],
      total_money: { amount: 625, currency: 'USD' }
    }
  }), [])

  const renderTpl = useCallback((tpl: string) => {
    try {
      // very small mustache-like replacer: {{path}} and {{#each order.line_items}} .. {{/each}}
      let out = tpl
      // each over order.line_items only (first 5)
      out = out.replace(/{{#each\s+order\.line_items}}([\s\S]*?){{\/each}}/g, (_m, inner) => {
        const items = SAMPLE.order.line_items.slice(0,5)
        return items.map(it => inner.replace(/{{\s*quantity\s*}}/g, it.quantity).replace(/{{\s*name\s*}}/g, it.name).replace(/{{\s*currency\s+total_money\s*}}/g, currency(it.total_money))).join('\n')
      })
      // simple {{currency path}}
      out = out.replace(/{{\s*currency\s+order\.total_money\s*}}/g, currency(SAMPLE.order.total_money))
      out = out.replace(/{{\s*order\.id\s*}}/g, SAMPLE.order.id)
      out = out.replace(/{{\s*order\.number\s*}}/g, SAMPLE.order.number)
      out = out.replace(/{{\s*order\.customer\.name\s*}}/g, SAMPLE.order.customer.name)
      return out
    } catch { return tpl }
  }, [SAMPLE])

  function currency(money: any) {
    try { const n = Number(money?.amount||0)/100; const c = money?.currency || 'USD'; return new Intl.NumberFormat(undefined,{style:'currency',currency:c}).format(n) } catch { return `$${(Number(money?.amount||0)/100).toFixed(2)}` }
  }

  const addEl = (type: El["type"]) => {
    const id = Math.random().toString(36).slice(2)
    const base = { id, x: 20, y: 20 + els.length * 10, w: 120, h: 24, type } as ElementBase
    let el: El
    switch (type) {
      case "text":
        el = { ...base, type, text: "New Text", bind: "", fontSize: 14, align: "left" }
        break
      case "image":
        el = { ...base, type, src: "/convex.svg" }
        break
      case "qr":
        el = { ...base, type, value: "{{order.number}}" }
        break
      case "line":
        el = { ...base, type, h: 2, thickness: 2 }
        break
    }
    setEls(e => [...e, el!])
    setSelected(id)
  }

  const onDrag = useCallback((id: string, dx: number, dy: number) => {
    setEls(list => list.map(el => el.id === id ? { ...el, x: Math.max(0, el.x + dx), y: Math.max(0, el.y + dy) } : el))
  }, [])

  const startDrag = (id: string, e: React.PointerEvent) => {
    setSelected(id)
    const startX = e.clientX, startY = e.clientY
    const move = (ev: PointerEvent) => onDrag(id, ev.clientX - startX, ev.clientY - startY)
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  const updateSel = (patch: Partial<El>) => {
    if (!sel) return
    setEls(list => list.map(el => el.id === sel.id ? { ...el, ...patch } as El : el))
  }

  const insertVar = (token: string) => {
    if (!sel || sel.type !== "text") return
    const t = sel as TextEl
    const nextBind = (t.bind || "") + token
    updateSel({ bind: nextBind })
  }

  const clearAll = () => { setEls([]); setSelected(null) }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(els, null, 2)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${storageKey}.json`
    a.click()
  }

  const importJSON = (file: File) => {
    const r = new FileReader()
    r.onload = () => {
      try { setEls(JSON.parse(String(r.result))) } catch { alert("Invalid JSON") }
    }
    r.readAsText(file)
  }

  const printCanvas = () => {
    const node = canvasRef.current
    if (!node) return
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>Print</title>
      <style>body{margin:0;display:flex;justify-content:center} .c{margin:16px;}</style></head>
      <body><div class='c'>${node.outerHTML}</div><script>window.onload=()=>window.print()</script></body></html>`
    const w = window.open("", "_blank")
    if (w) { w.document.write(html); w.document.close() }
  }

  return (
    <div ref={wrapperRef} tabIndex={0} className="grid grid-cols-12 gap-4 outline-none">
      <div className="col-span-2 space-y-2">
        <div className="text-xs font-medium">Elements</div>
        <div className="flex flex-col gap-2">
          <button className="border px-2 py-1 text-sm" onClick={() => addEl("text")}>Text</button>
          <button className="border px-2 py-1 text-sm" onClick={() => addEl("image")}>Image</button>
          <button className="border px-2 py-1 text-sm" onClick={() => addEl("qr")}>QR</button>
          <button className="border px-2 py-1 text-sm" onClick={() => addEl("line")}>Divider</button>
        </div>
        <div className="mt-4"><VariablesPanel onInsert={insertVar} /></div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <button className="border px-2 py-1 text-sm" onClick={clearAll}>Clear</button>
            <button className="border px-2 py-1 text-sm" onClick={exportJSON}>Export</button>
            <label className="border px-2 py-1 text-sm cursor-pointer">
              Import
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files && importJSON(e.target.files[0])} />
            </label>
          </div>
          <button className="border px-2 py-1 text-sm" onClick={printCanvas}>Print Test</button>
        </div>
      </div>

      <div className="col-span-7">
        <div className="text-xs font-medium mb-2">Canvas</div>
        <div className="bg-white border shadow-sm p-4 inline-block" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div
            ref={canvasRef}
            className="relative bg-white border border-dashed"
            style={{ width, height, backgroundImage: showGrid ? "repeating-linear-gradient(0deg,#eee,#eee 1px,transparent 1px,transparent 8px), repeating-linear-gradient(90deg,#eee,#eee 1px,transparent 1px,transparent 8px)" : undefined }}
          >
            {els.map(el => (
              <ElView key={el.id} el={el} selected={el.id === selected} onPointerDown={(e) => startDrag(el.id, e)} renderTpl={renderTpl} />
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-3 space-y-2">
        <div className="text-xs font-medium">Properties</div>
        {!sel ? (
          <div className="text-sm text-muted-foreground">Select an element</div>
        ) : sel.type === "text" ? (
          <TextInspector el={sel as TextEl} onChange={updateSel} renderTpl={renderTpl} />
        ) : sel.type === "image" ? (
          <ImageInspector el={sel as ImageEl} onChange={updateSel} />
        ) : sel.type === "qr" ? (
          <QrInspector el={sel as QrEl} onChange={updateSel} />
        ) : (
          <LineInspector el={sel as LineEl} onChange={updateSel} />
        )}
      </div>
    </div>
  )
}

function ElView({ el, selected, onPointerDown, renderTpl }: { el: El; selected: boolean; onPointerDown: (e: React.PointerEvent) => void; renderTpl: (tpl: string)=>string }) {
  const common = {
    className: `absolute border ${selected ? "border-blue-500" : "border-transparent"}`,
    style: { left: el.x, top: el.y, width: el.w, height: el.h },
    onPointerDown,
  } as any
  if (el.type === "text") {
    const t = el as TextEl
    const rendered = t.bind && t.bind.trim() ? renderTpl(t.bind) : t.text
    return <div {...common} style={{ ...common.style, padding: 2 }}><div style={{ fontSize: t.fontSize, fontWeight: t.bold ? 700 : 400, textAlign: t.align as any, whiteSpace: 'pre-wrap' }}>{rendered}</div></div>
  }
  if (el.type === "image") {
    const i = el as ImageEl
    return <div {...common}><img src={i.src} alt="" className="w-full h-full object-contain" /></div>
  }
  if (el.type === "qr") {
    const q = el as QrEl
    // Simple placeholder for QR
    return <div {...common} className={`${common.className} grid place-items-center bg-[repeating-linear-gradient(45deg,#000_0_4px,#fff_4px_8px)]`}><span className="bg-white px-1 text-[10px]">QR: {q.value}</span></div>
  }
  const l = el as LineEl
  return <div {...common} style={{ ...common.style, height: l.thickness }} className="bg-black" />
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="grow" />
      {children}
    </label>
  )
}

function TextInspector({ el, onChange, renderTpl }: { el: TextEl; onChange: (p: Partial<TextEl>) => void; renderTpl: (tpl:string)=>string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs">Binding (prototype)</label>
      <input className="w-full border rounded px-2 py-1 text-sm" value={el.bind || ""} onChange={e => onChange({ bind: e.target.value })} />
      <div className="text-xs text-muted-foreground">Preview</div>
      <div className="border rounded p-2 bg-white text-black text-sm min-h-10 whitespace-pre-wrap">{el.bind ? renderTpl(el.bind) : el.text}</div>
      <div className="text-xs">Fallback text</div>
      <textarea className="w-full border rounded p-2 text-sm" rows={3} value={el.text} onChange={e => onChange({ text: e.target.value })} />
      <FieldRow label="Font Size"><input type="number" className="w-20 border rounded px-1" value={el.fontSize} onChange={e => onChange({ fontSize: Number(e.target.value) })} /></FieldRow>
      <FieldRow label="Bold"><input type="checkbox" checked={!!el.bold} onChange={e => onChange({ bold: e.target.checked })} /></FieldRow>
      <FieldRow label="Align">
        <select className="border rounded px-1" value={el.align} onChange={e => onChange({ align: e.target.value as any })}>
          <option>left</option><option>center</option><option>right</option>
        </select>
      </FieldRow>
      <FieldRow label="Width"><input type="number" className="w-24 border rounded px-1" value={el.w} onChange={e => onChange({ w: Number(e.target.value) })} /></FieldRow>
      <FieldRow label="Height"><input type="number" className="w-24 border rounded px-1" value={el.h} onChange={e => onChange({ h: Number(e.target.value) })} /></FieldRow>
    </div>
  )
}

function ImageInspector({ el, onChange }: { el: ImageEl; onChange: (p: Partial<ImageEl>) => void }) {
  return (
    <div className="space-y-2">
      <FieldRow label="Src"><input className="border rounded px-2 py-1 text-sm w-full" value={el.src} onChange={e => onChange({ src: e.target.value })} /></FieldRow>
      <FieldRow label="Width"><input type="number" className="w-24 border rounded px-1" value={el.w} onChange={e => onChange({ w: Number(e.target.value) })} /></FieldRow>
      <FieldRow label="Height"><input type="number" className="w-24 border rounded px-1" value={el.h} onChange={e => onChange({ h: Number(e.target.value) })} /></FieldRow>
    </div>
  )
}

function QrInspector({ el, onChange }: { el: QrEl; onChange: (p: Partial<QrEl>) => void }) {
  return (
    <div className="space-y-2">
      <FieldRow label="Value"><input className="border rounded px-2 py-1 text-sm w-full" value={el.value} onChange={e => onChange({ value: e.target.value })} /></FieldRow>
      <FieldRow label="Size W"><input type="number" className="w-24 border rounded px-1" value={el.w} onChange={e => onChange({ w: Number(e.target.value) })} /></FieldRow>
      <FieldRow label="Size H"><input type="number" className="w-24 border rounded px-1" value={el.h} onChange={e => onChange({ h: Number(e.target.value) })} /></FieldRow>
    </div>
  )
}

function LineInspector({ el, onChange }: { el: LineEl; onChange: (p: Partial<LineEl>) => void }) {
  return (
    <div className="space-y-2">
      <FieldRow label="Thickness"><input type="number" className="w-24 border rounded px-1" value={el.thickness} onChange={e => onChange({ thickness: Number(e.target.value) })} /></FieldRow>
      <FieldRow label="Width"><input type="number" className="w-24 border rounded px-1" value={el.w} onChange={e => onChange({ w: Number(e.target.value) })} /></FieldRow>
    </div>
  )
}
