"use client"

import { useMemo, useState } from "react"

type Turn = { from: "user" | "agent"; text: string }

export default function PhoneAgentEditorPage() {
  const [prompt, setPrompt] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("agent-prompt") || "Be helpful and concise. If asked about hours, answer from Square data."
      : "Be helpful and concise. If asked about hours, answer from Square data."
  )
  const [q, setQ] = useState("")
  const [chat, setChat] = useState<Turn[]>([])

  const square = useMemo(() => ({ hours: "Mon–Fri 7am–6pm; Sat–Sun 8am–5pm", items: ["Americano", "Blueberry Muffin"] }), [])

  const reply = () => {
    if (!q.trim()) return
    const userTurn: Turn = { from: "user", text: q }
    const agentText = synthesize(prompt, q, square)
    const agentTurn: Turn = { from: "agent", text: agentText }
    setChat(c => [...c, userTurn, agentTurn])
    setQ("")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">System Prompt</label>
          <textarea className="w-full border rounded p-2 h-40" value={prompt} onChange={e => { setPrompt(e.target.value); localStorage.setItem("agent-prompt", e.target.value) }} />
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
          <div className="flex gap-2">
            <input className="border rounded px-2 py-1 text-sm grow" placeholder="Ask a question…" value={q} onChange={e => setQ(e.target.value)} />
            <button className="border px-3 py-1.5 text-sm" onClick={reply}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function synthesize(prompt: string, q: string, data: any) {
  const lq = q.toLowerCase()
  if (lq.includes("hour")) return `We are open ${data.hours}.`
  if (lq.includes("menu") || lq.includes("item")) return `Popular items include ${data.items.join(", ")}.`
  if (lq.includes("thank")) return "You’re welcome!"
  return "I’ll check on that and get back to you shortly."
}
