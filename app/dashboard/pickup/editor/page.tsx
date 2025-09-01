"use client"

import { useEffect, useMemo, useState } from "react"

type Board = { columns: string[]; theme: "light" | "dark" }

export default function PickupEditorPage() {
  const [prompt, setPrompt] = useState("")
  const [board, setBoard] = useState<Board>({ columns: ["Queued", "Preparing", "Ready"], theme: "light" })

  const applyPrompt = () => {
    const cols = prompt.match(/columns:\s*([^\n]+)/i)?.[1]?.split(",").map(s => s.trim()).filter(Boolean)
    const theme = (prompt.match(/theme:\s*(dark|light)/i)?.[1]?.toLowerCase() as Board["theme"]) || board.theme
    setBoard({ columns: cols && cols.length ? cols : board.columns, theme })
    localStorage.setItem("pickup-board", JSON.stringify({ columns: cols && cols.length ? cols : board.columns, theme }))
  }

  const sample = useMemo(() => (
    [
      { number: "A57", status: "Ready" },
      { number: "B12", status: "Preparing" },
      { number: "C03", status: "Queued" }
    ]
  ), [])

  const grouped = useMemo(() => {
    const g: Record<string, { number: string }[]> = {}
    for (const c of board.columns) g[c] = []
    sample.forEach(o => { (g[o.status] ||= []).push({ number: o.number }) })
    return g
  }, [board, sample])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <textarea className="w-full border rounded p-2 h-32" placeholder="columns: Queued, Preparing, Ready\ntheme: light" value={prompt} onChange={e => setPrompt(e.target.value)} />
          <button className="border px-3 py-1.5 text-sm" onClick={applyPrompt}>Apply</button>
        </div>
        <div>
          <label className="text-sm font-medium">Preview</label>
          <div className="border rounded p-3 overflow-auto" style={{ background: board.theme === "dark" ? "#0a0a0a" : "#fff", color: board.theme === "dark" ? "#fff" : "#000" }}>
            <div className="grid grid-cols-3 gap-3">
              {board.columns.map(col => (
                <div key={col} className="border rounded p-2">
                  <div className="font-semibold mb-2">{col}</div>
                  <ul className="space-y-1">
                    {grouped[col]?.map(o => <li key={o.number} className="text-lg font-mono">{o.number}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
