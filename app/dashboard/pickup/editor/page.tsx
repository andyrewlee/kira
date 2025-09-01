"use client"

import { useMemo, useState } from "react"

type Order = { id: string; displayName: string; status: "Preparing" | "Finished"; updatedAt: string; items: string }

export default function PickupEditorPage() {
  const [orders, setOrders] = useState<Order[]>(seedFromQuery())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [privacy, setPrivacy] = useState<"name"|"order"|"masked">("name")
  const [ttl, setTtl] = useState(10)
  const [offline, setOffline] = useState(false)

  const addPreparing = () => {
    const id = randId()
    setOrders(o => [{ id, displayName: demoName(), status: "Preparing", updatedAt: new Date().toISOString(), items: demoItems() }, ...o])
  }
  const finishSelected = () => {
    if (!selectedId) return
    setOrders(list => list.map(o => o.id === selectedId ? { ...o, status: "Finished", updatedAt: new Date().toISOString() } : o))
  }
  const clearFinished = () => {
    const cutoff = Date.now() - ttl*60*1000
    setOrders(list => list.filter(o => !(o.status === "Finished" && Date.parse(o.updatedAt) < cutoff)))
  }

  const byBucket = useMemo(() => {
    const prep = orders.filter(o => o.status === "Preparing").sort((a,b)=> b.updatedAt.localeCompare(a.updatedAt))
    const fin = orders.filter(o => o.status === "Finished").sort((a,b)=> b.updatedAt.localeCompare(a.updatedAt))
    return { prep, fin }
  }, [orders])

  const mask = (o: Order) => privacy === "order" ? o.id.slice(-6) : privacy === "masked" ? o.displayName.slice(0,1) + "•••" : o.displayName

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="border px-3 py-1.5 text-sm" onClick={addPreparing}>Add Preparing</button>
          <button className="border px-3 py-1.5 text-sm" onClick={finishSelected} disabled={!selectedId}>Finish Selected</button>
          <button className="border px-3 py-1.5 text-sm" onClick={clearFinished}>Clear Finished &lt; {ttl}m</button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2">Privacy
            <select className="border rounded px-1" value={privacy} onChange={e => setPrivacy(e.target.value as any)}>
              <option value="name">Names</option>
              <option value="order">Order numbers</option>
              <option value="masked">Masked</option>
            </select>
          </label>
          <label className="flex items-center gap-2">TTL
            <input type="range" min={5} max={30} step={5} value={ttl} onChange={e => setTtl(Number(e.target.value))} />
            <span className="text-muted-foreground">{ttl}m</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={offline} onChange={e => setOffline(e.target.checked)} /> Offline
          </label>
        </div>
      </header>

      {offline && <div className="rounded bg-red-600 text-white px-3 py-2 text-sm">Offline (simulated)</div>}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Column title="Preparing" items={byBucket.prep} mask={mask} selectedId={selectedId} onSelect={setSelectedId} />
        <Column title="Finished" items={byBucket.fin} mask={mask} selectedId={selectedId} onSelect={setSelectedId} />
      </section>
    </div>
  )
}

function Column({ title, items, mask, selectedId, onSelect }: { title: string; items: Order[]; mask: (o: Order)=>string; selectedId: string|null; onSelect: (s:string)=>void }){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="grid gap-3">
        {items.map(o => (
          <button key={o.id} onClick={()=>onSelect(o.id)} className={`text-left rounded border px-3 py-2 ${selectedId===o.id? 'border-blue-500' : ''}`}>
            <div className="text-2xl font-bold font-mono">{mask(o)}</div>
            <div className="text-xs text-muted-foreground truncate">{o.items}</div>
          </button>
        ))}
        {items.length===0 && <div className="text-sm text-muted-foreground">No items</div>}
      </div>
    </div>
  )
}

function randId(){ return Math.random().toString(36).slice(2, 10).toUpperCase() }
function demoName(){ const names=["Alex","Sam","Jordan","Taylor","Riley","Casey"]; return names[Math.floor(Math.random()*names.length)] }
function demoItems(){ const items=["2× Latte, 1× Muffin","1× Americano","1× Croissant","1× Tea, 1× Scone"]; return items[Math.floor(Math.random()*items.length)] }
function seed(): Order[]{
  const base = [
    { id: randId(), displayName: "Alex", status: "Preparing" as const, updatedAt: new Date(Date.now()-2*60*1000).toISOString(), items: "2× Latte, 1× Muffin" },
    { id: randId(), displayName: "Sam", status: "Preparing" as const, updatedAt: new Date(Date.now()-60*1000).toISOString(), items: "1× Americano" },
    { id: randId(), displayName: "Jordan", status: "Finished" as const, updatedAt: new Date(Date.now()-5*60*1000).toISOString(), items: "1× Croissant" }
  ]
  return base
}
function seedFromQuery(){
  if (typeof window === 'undefined') return seed()
  const p = new URLSearchParams(window.location.search)
  const d = p.get('demo')
  if (d === 'rush'){
    const out: Order[] = []
    for (let i=0;i<10;i++) out.push({ id: randId(), displayName: demoName(), status: i<3? 'Finished':'Preparing', updatedAt: new Date(Date.now()-i*60000).toISOString(), items: demoItems() })
    return out
  }
  if (d === 'quiet'){ return [{ id: randId(), displayName: 'Alex', status: 'Preparing', updatedAt: new Date().toISOString(), items: '1× Drip' }] }
  return seed()
}
