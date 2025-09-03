"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Script from "next/script"

type Props = {
  width: number
  height: number
  scale?: number
  sidebarTop?: React.ReactNode
}

type FabricObject = {
  set: (...args: [key: string, value: unknown] | [patch: Record<string, unknown>]) => void
  get?: (key: string) => unknown
  on?: (event: string, cb: () => void) => void
  setCoords?: () => void
  canvas?: FabricCanvas
  type?: string
  left?: number
  top?: number
  height?: number
  angle?: number
  getBoundingRect?: (arg1?: boolean, arg2?: boolean) => { top: number; height: number }
}

type FabricTextbox = FabricObject & { text?: string; fontSize?: number; width?: number }
type FabricGroup = FabricObject

type FabricCanvas = {
  setWidth: (n: number) => void
  setHeight: (n: number) => void
  on: (event: string, handler: (e: { selected?: FabricObject[] }) => void) => void
  getObjects: (type?: string) => FabricObject[]
  add: (obj: FabricObject) => void
  setActiveObject: (obj: FabricObject) => void
  remove: (obj: FabricObject) => void
  insertAt: (obj: FabricObject, index: number) => void
  requestRenderAll: () => void
  dispose: () => void
  setZoom: (n: number) => void
  toDataURL: (opts: { format: 'png' }) => string
  getWidth: () => number
  getHeight: () => number
  setBackgroundImage: (url: string, cb: () => void, opts: Record<string, unknown>) => void
}

type FabricNS = {
  Canvas: new (el: HTMLCanvasElement, opts: Record<string, unknown>) => FabricCanvas
  Textbox: new (text: string, opts: Record<string, unknown>) => FabricTextbox
  Rect: new (opts: Record<string, unknown>) => FabricObject
  Text: new (text: string, opts: Record<string, unknown>) => FabricObject
  Group: new (objs: FabricObject[], opts: Record<string, unknown>) => FabricGroup
  Image: { fromURL: (url: string, cb: (img: FabricObject) => void) => void }
}

declare global {
  interface Window { fabric: FabricNS }
}

export default function FabricEditor({ width, height, scale = 1, sidebarTop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<FabricObject | null>(null)
  const [dataText, setDataText] = useState(JSON.stringify(SAMPLE_ORDER, null, 2))
  const [paper, setPaper] = useState<{ w:number; h:number; preset:string }>({ w: width, h: height, preset: 'm30-80' })
  const [zoom, setZoom] = useState(scale)
  const [bindingDraft, setBindingDraft] = useState('')
  const data = useMemo<unknown>(() => { try { return JSON.parse(dataText) } catch { return {} } }, [dataText])

  useEffect(() => {
    if (!ready || !canvasRef.current || !window.fabric) return
    const fabric = window.fabric
    const c = new fabric.Canvas(canvasRef.current, { preserveObjectStacking: true, selection: true })
    c.setWidth(paper.w)
    c.setHeight(paper.h)
    c.on('selection:created', (e: { selected?: FabricObject[] }) => setSelected(e.selected?.[0] || null))
    c.on('selection:updated', (e: { selected?: FabricObject[] }) => setSelected(e.selected?.[0] || null))
    c.on('selection:cleared', () => setSelected(null))
    fabricRef.current = c
    drawGrid(c)
    return () => { c.dispose() }
  }, [ready, paper.w, paper.h])

  // Keep zoom inside Fabric (not CSS transform) so objects aren't visually squished
  useEffect(() => {
    const c = fabricRef.current; if (!c) return
    c.setZoom(zoom)
    c.requestRenderAll()
  }, [zoom])

  // Re-evaluate bindings and repeaters when data JSON changes
  useEffect(() => {
    const c = fabricRef.current; if (!c) return
    c.getObjects('textbox').forEach((obj) => {
      const bind = obj.get?.('binding')
      if (typeof bind === 'string'){
        const { text, unresolved } = evalBindingWithStatus(bind, data)
        obj.set('text', text)
        obj.set('fill', unresolved ? '#b91c1c' : '#000')
      }
    })
    c.getObjects().forEach((obj) => { if (obj.get && obj.get('kind') === 'repeater') rerenderRepeater(obj, data) })
    expandCanvasToFit(c)
    c.requestRenderAll()
  }, [data])

  // Re-evaluate on data change
  useEffect(() => {
    const c = fabricRef.current; if (!c) return
    c.getObjects('textbox').forEach((obj) => {
      const bind = obj.get?.('binding'); if (typeof bind !== 'string') return
      const { text, unresolved } = evalBindingWithStatus(bind, data)
      obj.set('text', text)
      obj.set('fill', unresolved ? '#b91c1c' : '#000')
    })
    c.getObjects().forEach((obj) => { if (obj.get && obj.get('kind') === 'repeater') rerenderRepeater(obj, data) })
    expandCanvasToFit(c)
    c.requestRenderAll()
  }, [data])

  // Sync binding draft from selected textbox
  useEffect(() => {
    if (selected && selected.type === 'textbox') {
      try {
        const tb = selected as FabricTextbox
        setBindingDraft((tb.get?.('binding') as string) || tb.text || '')
      } catch {}
    }
  }, [selected])

  const addText = () => {
    const c = fabricRef.current; if (!c) return
    const t = new window.fabric.Textbox('Order {{order.id}}', { left: 24, top: 24, fontSize: 18, fill: '#000', width: 320 })
    renderBindingToTextbox(t, 'Order {{order.id}}', data)
    t.on?.('editing:exited', () => { const bind = String((t as FabricTextbox).text||''); renderBindingToTextbox(t, bind, data); c.requestRenderAll(); expandCanvasToFit(c) })
    c.add(t); c.setActiveObject(t); setSelected(t); expandCanvasToFit(c)
  }
  const addImage = async () => {
    const url = prompt('Image URL (can be data URL):') || ''
    if (!url) return
    const c = fabricRef.current; if (!c) return
    window.fabric.Image.fromURL(url, (img) => { img.set({ left: 40, top: 80, scaleX: 0.5, scaleY: 0.5 }); c.add(img); c.setActiveObject(img); setSelected(img); expandCanvasToFit(c) })
  }
  const addQR = () => {
    const c = fabricRef.current; if (!c) return
    // Placeholder square labeled QR (no generator yet)
    const rect = new window.fabric.Rect({ left: 200, top: 80, width: 120, height: 120, fill: 'transparent', stroke: '#000' })
    rect.set('kind', 'qr'); rect.set('binding', '{{order.id}}')
    const label = new window.fabric.Text('QR', { left: 200+45, top: 80+45, fontSize: 24, fill: '#000' })
    const group = new window.fabric.Group([rect, label], { left: 200, top: 80 })
    group.set('binding', '{{order.id}}')
    c.add(group); c.setActiveObject(group); setSelected(group); expandCanvasToFit(c)
  }

  const addList = () => {
    const c = fabricRef.current; if (!c) return
    const g = makeRepeaterGroup({ left: 24, top: 120, path: 'order.line_items', rowTpl: '{{quantity}}× {{name}} — {{currency total_money}}', fontSize: 14, width: 360, gap: 4 }, data)
    c.add(g); c.setActiveObject(g); setSelected(g); expandCanvasToFit(c)
  }

  const exportPNG = () => {
    const c = fabricRef.current; if (!c) return
    const url = c.toDataURL({ format: 'png' })
    const a = document.createElement('a'); a.href = url; a.download = 'layout.png'; a.click()
  }

  const updateSelected = (patch: Record<string, unknown>) => {
    const obj = selected; if (!obj) return
    obj.set(patch); obj.canvas?.requestRenderAll(); setSelected({ ...obj })
    const c = fabricRef.current; if (c) expandCanvasToFit(c)
  }

  // Delete with keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const c = fabricRef.current; if (!c) return
        try { c.remove(selected); setSelected(null); c.requestRenderAll() } catch {}
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

function applyPreset(id: string){
    const c = fabricRef.current; if (!c) return
    let w = paper.w, h = paper.h
    switch(id){
      case 'm30-58': w = mmToPx(58); h = 1200; break
      case 'm30-80': w = mmToPx(80); h = 1200; break
      case 'l100-40': w = mmToPx(40); h = mmToPx(40); break
      case 'l100-58': w = mmToPx(58); h = mmToPx(58); break
      case 'l100-80': w = mmToPx(80); h = mmToPx(80); break
    }
    setPaper({ w, h, preset: id })
    applyCanvasSize(c, w, h)
}

function setPaperSize(partial: { w?: number; h?: number }){
  const c = fabricRef.current; if (!c) return
  const w = clamp(partial.w ?? paper.w, 64, 2000)
  const minH = clamp(partial.h ?? paper.h, 64, 6000)
  const needed = contentBottom(c) + 48
  const finalH = Math.max(minH, needed)
  setPaper(p => ({ ...p, w, h: finalH, preset: p.preset }))
  applyCanvasSize(c, w, finalH)
}

  return (
    <div className="grid grid-cols-12 gap-4">
      <Script src="https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js" onLoad={() => setReady(true)} />
      <div className="col-span-3 space-y-2">
        {sidebarTop}
        <div className="text-xs font-medium">Paper</div>
        <select className="border rounded px-2 py-1 text-sm" value={paper.preset} onChange={(e)=>applyPreset(e.target.value)}>
          <option value="m30-58">TM‑m30 58mm @203dpi</option>
          <option value="m30-80">TM‑m30 80mm @203dpi</option>
          <option value="l100-40">TM‑L100 40mm @203dpi</option>
          <option value="l100-58">TM‑L100 58mm @203dpi</option>
          <option value="l100-80">TM‑L100 80mm @203dpi</option>
        </select>
        <div className="text-xs text-muted-foreground">{Math.round(paper.w)}px × {Math.round(paper.h)}px • {toMm(paper.w)}mm @203dpi</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center justify-between gap-2">Width (px)
            <input className="border rounded px-1 w-24" type="number" min={64} value={Math.round(paper.w)} onChange={e=>setPaperSize({ w: Number(e.target.value) || paper.w })} />
          </label>
          <label className="flex items-center justify-between gap-2">Height (px)
            <input className="border rounded px-1 w-24" type="number" min={64} value={Math.round(paper.h)} onChange={e=>setPaperSize({ h: Number(e.target.value) || paper.h })} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-xs">Zoom
          <input type="range" min={0.5} max={2} step={0.25} value={zoom} onChange={e=>setZoom(Number(e.target.value))} />
          <span>{Math.round(zoom*100)}%</span>
        </label>

        <div className="text-xs font-medium mt-4">Elements</div>
        <div className="flex flex-col gap-2">
          <button className="border px-2 py-1 text-sm" onClick={addText}>Text</button>
          <button className="border px-2 py-1 text-sm" onClick={addImage}>Image</button>
          <button className="border px-2 py-1 text-sm" onClick={addQR}>QR</button>
          <button className="border px-2 py-1 text-sm" onClick={addList}>List (Repeater)</button>
        </div>
        <div className="mt-4 text-xs font-medium">Data (sample)</div>
        <textarea className="w-full border rounded p-2 text-xs h-40" value={dataText} onChange={e => setDataText(e.target.value)} />
        <div className="mt-4 flex gap-2">
          <button className="border px-2 py-1 text-sm" onClick={exportPNG}>Export PNG</button>
        </div>
        <div className="text-xs text-muted-foreground">MVP — QR uses a visual placeholder square.</div>
      </div>

      <div className="col-span-6">
        <div className="bg-white border p-3" style={{ overflow: 'auto', maxWidth: '100%' }}>
          <div style={{ display:'inline-block', background:'#fff', boxShadow:'0 0 0 1px #e5e7eb', padding:0 }}>
            <canvas ref={canvasRef} width={paper.w} height={paper.h} style={{ display:'block' }} />
          </div>
        </div>
      </div>

      <div className="col-span-3 space-y-2">
        <div className="text-xs font-medium">Properties</div>
        {!selected ? (
          <div className="text-sm text-muted-foreground">Select an object.</div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <button className="border px-2 py-1" onClick={()=>{ const c = fabricRef.current; if (c && selected){ c.remove(selected); setSelected(null); c.requestRenderAll() }}}>Delete</button>
            </div>
            <label className="flex items-center justify-between gap-2">X<input type="number" className="w-24 border rounded px-1" value={Math.round(selected.left||0)} onChange={e=>updateSelected({ left: Number(e.target.value) })} /></label>
            <label className="flex items-center justify-between gap-2">Y<input type="number" className="w-24 border rounded px-1" value={Math.round(selected.top||0)} onChange={e=>updateSelected({ top: Number(e.target.value) })} /></label>
            {selected.type === 'textbox' && (
              <>
                <label className="flex items-center justify-between gap-2">Binding<input className="border rounded px-2 py-1" value={bindingDraft} onChange={e=>setBindingDraft(e.target.value)} /></label>
                <div className="flex gap-2">
                  <button
                    className="border px-2 py-1"
                    onClick={()=>{
                      renderBindingToTextbox(selected, bindingDraft, data)
                      try { selected.setCoords?.() } catch {}
                      const c = selected?.canvas; if (c) { expandCanvasToFit(c); c.requestRenderAll() }
                      setSelected({ ...selected })
                    }}
                  >
                    Save
                  </button>
                </div>
                {(() => { const tb = selected as FabricTextbox; return (
                  <label className="flex items-center justify-between gap-2">Font Size<input type="number" className="w-24 border rounded px-1" value={tb.fontSize||16} onChange={e=>updateSelected({ fontSize: Number(e.target.value) })} /></label>
                )})()}
              </>
            )}
            {selected?.get && selected.get('kind') === 'repeater' && (
              <>
                <label className="flex items-center justify-between gap-2">Path<input className="border rounded px-2 py-1" value={String(selected.get('path')||'order.line_items')} onChange={e=>{ selected.set('path', e.target.value); rerenderRepeater(selected, data) }} /></label>
                <label className="flex items-center justify-between gap-2">Row Template</label>
                <textarea className="w-full border rounded p-2 text-xs" rows={3} value={String(selected.get('rowTpl')||'')} onChange={e=>{ selected.set('rowTpl', e.target.value); rerenderRepeater(selected, data) }} />
                <label className="flex items-center justify-between gap-2">Font Size<input type="number" className="w-24 border rounded px-1" value={Number(selected.get('fontSize')||14)} onChange={e=>{ selected.set('fontSize', Number(e.target.value)); rerenderRepeater(selected, data) }} /></label>
                <label className="flex items-center justify-between gap-2">Width<input type="number" className="w-24 border rounded px-1" value={Number(selected.get('width')||360)} onChange={e=>{ selected.set('width', Number(e.target.value)); rerenderRepeater(selected, data) }} /></label>
                <label className="flex items-center justify-between gap-2">Line Gap<input type="number" className="w-24 border rounded px-1" value={Number(selected.get('gap')||4)} onChange={e=>{ selected.set('gap', Number(e.target.value)); rerenderRepeater(selected, data) }} /></label>
              </>
            )}
            <label className="flex items-center justify-between gap-2">Angle<input type="number" className="w-24 border rounded px-1" value={Math.round(selected.angle||0)} onChange={e=>updateSelected({ angle: Number(e.target.value) })} /></label>
          </div>
        )}
      </div>
    </div>
  )
}

function drawGrid(c: FabricCanvas){
  const w = c.getWidth(); const h = c.getHeight(); const step = 8
  const grid = document.createElement('canvas'); grid.width = w; grid.height = h
  const g = grid.getContext('2d')!
  g.fillStyle = '#fff'; g.fillRect(0,0,w,h)
  g.strokeStyle = '#eef1f6'; g.lineWidth = 1
  for (let x=0;x<w;x+=step){ g.beginPath(); g.moveTo(x+0.5,0); g.lineTo(x+0.5,h); g.stroke() }
  for (let y=0;y<h;y+=step){ g.beginPath(); g.moveTo(0,y+0.5); g.lineTo(w,y+0.5); g.stroke() }
  const url = grid.toDataURL('image/png')
  // @ts-expect-error fabric types not available
  c.setBackgroundImage(url, c.renderAll.bind(c), { originX:'left', originY:'top', backgroundVpt: true })
}

function mmToPx(mm:number, dpi=203){ return Math.round(mm*dpi/25.4) }
function toMm(px:number, dpi=203){ return Math.round((px*25.4/dpi)*10)/10 }

function applyCanvasSize(c: FabricCanvas, w:number, h:number){ c.setWidth(w); c.setHeight(h); drawGrid(c); c.requestRenderAll() }

function clamp(n:number, min:number, max:number){ return Math.max(min, Math.min(max, n)) }


const SAMPLE_ORDER = {
  order: {
    id: 'CAISENgvlJ6jLWAzERDzjyHVybY',
    number: 'A57',
    customer: { name: 'Casey' },
    line_items: [
      { quantity:'1', name:'Americano', total_money:{ amount:350, currency:'USD' } },
      { quantity:'1', name:'Blueberry Muffin', total_money:{ amount:275, currency:'USD' } },
    ],
    total_money: { amount: 625, currency: 'USD' }
  }
}

type Money = { amount?: number; currency?: string }
function currency(m: unknown){ try{ const v = (m as Money)||{}; const n=Number(v.amount||0)/100; const c=v.currency||'USD'; return new Intl.NumberFormat(undefined,{style:'currency',currency:c}).format(n)}catch{return '$0.00'} }
function evalBindingWithStatus(tpl: string, data: unknown): { text:string; unresolved:boolean }{
  try{
    let out = tpl
    const d = data as { order?: { total_money?: Money; id?: string; number?: string; customer?: { name?: string }; line_items?: Array<{ quantity?: string; name?: string; total_money?: Money }> } }
    out = out.replace(/{{\s*currency\s+order\.total_money\s*}}/g, currency(d?.order?.total_money))
    out = out.replace(/{{\s*order\.id\s*}}/g, d?.order?.id||'')
    out = out.replace(/{{\s*order\.number\s*}}/g, d?.order?.number||'')
    out = out.replace(/{{\s*order\.customer\.name\s*}}/g, d?.order?.customer?.name||'')
    out = out.replace(/{{#each\s+order\.line_items}}([\s\S]*?){{\/each}}/g, (_m, inner) => {
      const items = (d?.order?.line_items||[]).slice(0,50)
      return items.map((it) => inner.replace(/{{\s*quantity\s*}}/g,it.quantity||'').replace(/{{\s*name\s*}}/g,it.name||'').replace(/{{\s*currency\s+total_money\s*}}/g,currency(it.total_money))).join('\n')
    })
    const unresolved = /{{[^}]+}}/.test(out)
    return { text: out, unresolved }
  }catch{return { text: tpl, unresolved: true }}
}
function renderBindingToTextbox(tb: FabricObject, binding:string, data: unknown){
  tb.set('binding', binding)
  const { text, unresolved } = evalBindingWithStatus(binding, data)
  tb.set('text', text)
  tb.set('fill', unresolved ? '#b91c1c' : '#000')
}

function getAtPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>) ? (acc as Record<string, unknown>)[key] : undefined), obj)
}

function makeRepeaterGroup({ left, top, path, rowTpl, fontSize, width, gap }:{ left:number; top:number; path:string; rowTpl:string; fontSize:number; width:number; gap:number }, data: unknown){
  const fabric = window.fabric
  const raw = getAtPath(data, path)
  const items: Array<{ quantity?: string; name?: string; total_money?: Money }> = Array.isArray(raw) ? (raw as Array<{ quantity?: string; name?: string; total_money?: Money }>) : []
  const lines: FabricObject[] = []
  let y = 0
  for (const it of items){
    const text = rowTpl
      .replace(/{{\s*quantity\s*}}/g, it.quantity||'')
      .replace(/{{\s*name\s*}}/g, it.name||'')
      .replace(/{{\s*currency\s+total_money\s*}}/g, currency(it.total_money))
    const tb = new fabric.Textbox(text, { left, top: top + y, fontSize, width, fill:'#000' })
    lines.push(tb)
    y += (tb.height || 0) + gap
  }
  const g = new fabric.Group(lines, { left, top })
  g.set('kind','repeater'); g.set('path', path); g.set('rowTpl', rowTpl); g.set('fontSize', fontSize); g.set('width', width); g.set('gap', gap)
  return g
}

function rerenderRepeater(group: FabricObject, data: unknown){
  const c = group.canvas; if (!c) return
  const left = group.left||0; const top = group.top||0
  const path = (group.get?.('path') as string) || 'order.line_items'
  const rowTpl = (group.get?.('rowTpl') as string) || '{{quantity}}× {{name}} — {{currency total_money}}'
  const fontSize = (group.get?.('fontSize') as number) || 14
  const width = (group.get?.('width') as number) || 360
  const gap = (group.get?.('gap') as number) || 4
  const index = c.getObjects().indexOf(group)
  c.remove(group)
  const g = makeRepeaterGroup({ left, top, path, rowTpl, fontSize, width, gap }, data)
  c.insertAt(g, index)
  c.setActiveObject(g)
  c.requestRenderAll()
  expandCanvasToFit(c)
}

function contentBottom(c: FabricCanvas){
  let bottom = 0
  c.getObjects().forEach((o) => { const r = o.getBoundingRect?.(true, true) || { top: 0, height: 0 }; bottom = Math.max(bottom, r.top + r.height) })
  return bottom
}

function expandCanvasToFit(c: FabricCanvas){
  const needed = contentBottom(c) + 48
  const currentW = c.getWidth(); const currentH = c.getHeight()
  if (needed > currentH){ applyCanvasSize(c, currentW, needed) }
}
