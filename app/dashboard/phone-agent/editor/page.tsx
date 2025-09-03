"use client"

import { useEffect, useMemo, useState } from "react"

type Turn = { from: "user" | "agent"; text: string }

export default function PhoneAgentEditorPage() {
  const [prompt, setPrompt] = useState("Be helpful and concise. If asked about hours, answer from Square data.")
  const [q, setQ] = useState("")
  const [chat, setChat] = useState<Turn[]>([])
  const [latencyMs, setLatencyMs] = useState(600)
  const [history, setHistory] = useState<{ name: string; args: Record<string, unknown>; result: unknown }[]>([])
  const [form, setForm] = useState({ location: '', category: '', partySize: 2, when: '' })
  // Load template prompt from query (on mount only)
  // Avoid setState during render to prevent Router update errors
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    const t = p.get('template')
    if (t && prompt.indexOf('Be helpful') === 0) {
      if (t === 'reception-basic') {
        setPrompt('You are a helpful store assistant. Use tools for hours, address, menus, and reservations. Be concise and confirm details before booking.')
      } else if (t === 'faq-short') {
        setPrompt('Answer in one short sentence. If unknown, say you will check and get back.')
      }
      // strip the query to keep state stable
      window.history.replaceState({}, '', window.location.pathname)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const square = useMemo(() => ({ hours: "Mon–Fri 7am–6pm; Sat–Sun 8am–5pm", items: ["Americano", "Blueberry Muffin"] }), [])

  const reply = () => {
    if (!q.trim()) return
    const userTurn: Turn = { from: "user", text: q }
    setChat(c => [...c, userTurn])
    const agentText = synthesize(prompt, q, square)
    setTimeout(() => {
      const agentTurn: Turn = { from: "agent", text: agentText }
      setChat(c => [...c, agentTurn])
    }, latencyMs)
    setQ("")
  }

  // Mock tools
  const toolLocationsSearch = () => {
    const result = [{ id: 'main', name: 'Kira Coffee — Main' }, { id: 'east', name: 'Kira Coffee — East' }]
    setHistory(h => [...h, { name: 'locations.search', args: { query: form.location }, result }])
    setChat(c => [...c, { from:'agent', text: `I found ${result.length} locations. The main store is open ${square.hours}.` }])
  }
  const toolLocationsGet = () => {
    const result = { id: 'main', name: 'Kira Coffee — Main', phone: '+1 555-0100', hours: square.hours }
    setHistory(h => [...h, { name: 'locations.get', args: { name: form.location || 'Main' }, result }])
    setChat(c => [...c, { from:'agent', text: `Main is open ${result.hours}. Phone ${result.phone}.` }])
  }
  const toolMenuGet = () => {
    const result = { categories: [{ name: 'Beverages', items: square.items }] }
    setHistory(h => [...h, { name: 'menu.get', args: { category: form.category }, result }])
    setChat(c => [...c, { from:'agent', text: `Popular items: ${square.items.slice(0,2).join(', ')}.` }])
  }
  const toolReservationCreate = () => {
    const result = { bookingId: Math.random().toString(36).slice(2).toUpperCase(), status: 'CONFIRMED' }
    setHistory(h => [...h, { name: 'reservations.create', args: { name:'Caller', partySize: form.partySize, whenISO: form.when }, result }])
    setChat(c => [...c, { from:'agent', text: `Booked for ${form.partySize} at ${form.when}. Confirmation ${result.bookingId}.` }])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">System Prompt</label>
          <textarea className="w-full border rounded p-2 h-40" value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Simulator</label>
          <div className="border rounded p-2 h-64 overflow-auto bg-white">
            {chat.length === 0 ? <div className="text-sm text-muted-foreground">No conversation yet.</div> : (
              <ul className="space-y-2 text-sm">
                {chat.map((t, i) => (
                  <li key={i} className={t.from === "user" ? "text-black" : "text-blue-700"}>
                    <span className="font-medium mr-2">{t.from === "user" ? "You" : "Agent"}:</span>{t.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Latency</span>
            <input type="range" min={0} max={1500} step={100} value={latencyMs} onChange={e => setLatencyMs(Number(e.target.value))} />
            <span>{latencyMs} ms</span>
          </div>
          <div className="flex gap-2">
            <input className="border rounded px-2 py-1 text-sm grow" placeholder="Ask a question…" value={q} onChange={e => setQ(e.target.value)} />
            <button className="border px-3 py-1.5 text-sm" onClick={reply}>Send</button>
          </div>
          <div className="mt-3 border rounded p-2 text-sm bg-white">
            <div className="font-medium mb-1">Mock Tools</div>
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1 text-xs" placeholder="Location name" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} />
              <input className="border rounded px-2 py-1 text-xs" placeholder="Category (e.g., Pastries)" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
              <input className="border rounded px-2 py-1 text-xs" placeholder="When ISO" value={form.when} onChange={e=>setForm({...form, when: e.target.value})} />
              <input className="border rounded px-2 py-1 text-xs" type="number" min={1} max={10} value={form.partySize} onChange={e=>setForm({...form, partySize: Number(e.target.value)})} />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button className="border px-2 py-1 text-xs" onClick={toolLocationsSearch}>locations.search</button>
              <button className="border px-2 py-1 text-xs" onClick={toolLocationsGet}>locations.get</button>
              <button className="border px-2 py-1 text-xs" onClick={toolMenuGet}>menu.get</button>
              <button className="border px-2 py-1 text-xs" onClick={toolReservationCreate}>reservations.create</button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Results below are mocked.</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-medium">Tool Call History</div>
        <div className="border rounded p-2 bg-white text-xs max-h-64 overflow-auto">
          {history.length===0 ? <div className="text-muted-foreground">No tool calls yet.</div> : (
            <ul className="space-y-1">
              {history.map((h,i)=> (
                <li key={i}><span className="font-mono">{h.name}</span> · args {JSON.stringify(h.args)} · result {Array.isArray(h.result)? `${h.result.length} items` : (typeof h.result === 'object' && h.result && 'bookingId' in (h.result as Record<string, unknown>) ? String((h.result as { bookingId: unknown }).bookingId) : 'ok')}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function synthesize(prompt: string, q: string, data: { hours: string; items: string[] }) {
  const lq = q.toLowerCase()
  if (lq.includes("hour")) return `We are open ${data.hours}.`
  if (lq.includes("menu") || lq.includes("item")) return `Popular items include ${data.items.join(", ")}.`
  if (lq.includes("thank")) return "You’re welcome!"
  return "I’ll check on that and get back to you shortly."
}
