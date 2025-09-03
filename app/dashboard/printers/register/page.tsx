"use client"

import { useEffect, useState } from "react"

type Device = { id: string; name: string; ip: string; paired?: boolean }

export default function PrintersRegister() {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Device[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("printers-devices") || localStorage.getItem("rp-devices")
    if (saved) setList(JSON.parse(saved))
  }, [])

  const persist = (next: Device[]) => {
    setList(next)
    localStorage.setItem("printers-devices", JSON.stringify(next))
  }

  const scan = () => {
    setLoading(true)
    setTimeout(() => {
      const discovered: Device[] = [
        { id: "d1", name: "Epson TM-T20", ip: "192.168.1.42" },
        { id: "d2", name: "Star TSP100", ip: "192.168.1.77" },
      ]
      const map = new Map<string, Device>()
      ;[...list, ...discovered].forEach(d => map.set(d.id, { ...map.get(d.id), ...d }))
      persist(Array.from(map.values()))
      setLoading(false)
    }, 1000)
  }

  const pair = (id: string) => {
    const next = list.map(d => d.id === id ? { ...d, paired: true } : d)
    persist(next)
  }
  const unpair = (id: string) => {
    const next = list.map(d => d.id === id ? { ...d, paired: false } : d)
    persist(next)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Discover printers on your network.</div>
          <button className="border px-3 py-1.5 text-sm" onClick={scan} disabled={loading}>{loading ? "Scanning…" : "Scan for printers"}</button>
        </div>
        {list.length === 0 ? (
          <div className="text-sm text-muted-foreground">No printers discovered yet.</div>
        ) : (
          <ul className="divide-y rounded-md border">
            {list.map(d => (
              <li key={d.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-muted-foreground">{d.ip}</div>
                </div>
                {d.paired ? (
                  <button className="border px-2 py-1" onClick={() => unpair(d.id)}>Unpair</button>
                ) : (
                  <button className="border px-2 py-1" onClick={() => pair(d.id)}>Pair</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
