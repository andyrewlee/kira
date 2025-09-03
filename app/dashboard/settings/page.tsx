"use client"

import { useMemo, useState } from "react"

type Conn = { connected: boolean; merchant?: { id: string; name: string }; expiresAt?: string }
type Stage = "idle" | "redirect" | "callback" | "exchange" | "connected" | "error"

export default function SettingsPage() {
  const [conn, setConn] = useState<Conn>({ connected: false })
  const [stage, setStage] = useState<Stage>("idle")
  const [logs, setLogs] = useState<string[]>([])
  const [simulateError, setSimulateError] = useState(false)
  const [mockOut, setMockOut] = useState<unknown | null>(null)

  const clearMock = () => setMockOut(null)

  const connect = async () => {
    setLogs([]); setStage("redirect"); clearMock()
    setLogs(l => [...l, "Redirecting to Square…"]) 
    await delay(700)
    if (simulateError) { setStage("error"); setLogs(l => [...l, "User denied access (simulated)"]); return }
    setStage("callback"); setLogs(l => [...l, "Returned with authorization code…"]) 
    await delay(600)
    setStage("exchange"); setLogs(l => [...l, "Exchanging code for tokens…"]) 
    await delay(800)
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000).toISOString()
    setConn({ connected: true, merchant: { id: "MERCH_MAIN", name: "Kira Coffee - Main" }, expiresAt })
    setStage("connected"); setLogs(l => [...l, "Connected! Tokens stored (mock). Expires in ~7 days." ])
  }

  const disconnect = () => { setConn({ connected: false }); setStage("idle"); setLogs(l => [...l, "Disconnected (mock)"]) }
  const refresh = async () => { setStage("exchange"); setLogs(l => [...l, "Refreshing access token…"]); await delay(700); const expiresAt = new Date(Date.now() + 7*24*60*60*1000).toISOString(); setConn(c => ({ ...c, expiresAt } as Conn)); setStage("connected"); setLogs(l => [...l, "Refreshed (mock)"]) }
  const listLocations = () => setMockOut([{ id: "LOC_MAIN", name: "Kira Coffee - Main" }, { id: "LOC_EAST", name: "Kira Coffee - East" }])

  const countdown = useMemo(() => {
    if (!conn.expiresAt) return null
    const ms = new Date(conn.expiresAt).getTime() - Date.now()
    if (ms <= 0) return "expired"
    const days = Math.floor(ms / (24*60*60*1000))
    return `${days}d remaining`
  }, [conn.expiresAt])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect integrations and manage your account.</p>
      </div>

      <section className="border rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">Square Connection</div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={simulateError} onChange={e => setSimulateError(e.target.checked)} /> Simulate error
          </label>
        </div>
        {!conn.connected ? (
          <button className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm" onClick={connect} disabled={stage!=="idle"}>
            {stage === "idle" ? "Connect Square" : stage === "redirect" ? "Redirecting…" : stage === "callback" ? "Returning…" : stage === "exchange" ? "Exchanging…" : "Connect Square"}
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm">Connected to <span className="font-medium">{conn.merchant?.name}</span>{countdown ? <span className="ml-2 text-xs text-muted-foreground">({countdown})</span> : null}</div>
            <div className="flex gap-2">
              <button className="border px-3 py-1.5 text-sm" onClick={refresh} disabled={stage!=="connected"}>Refresh Token</button>
              <button className="border px-3 py-1.5 text-sm" onClick={disconnect}>Disconnect</button>
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground">This is a mock flow. No network requests are made.</div>
        <div className="border rounded p-2 bg-muted/20 max-h-40 overflow-auto text-xs">
          {logs.length === 0 ? <div className="text-muted-foreground">Logs will appear here…</div> : logs.map((l,i)=> <div key={i}>{l}</div>)}
        </div>
      </section>

      <section className="border rounded-md p-4 space-y-2">
        <div className="text-sm">Mock API test</div>
        <div className="flex gap-2">
          <button className="border px-3 py-1.5 text-sm" onClick={listLocations}>List Locations</button>
          {Boolean(mockOut) && <button className="border px-3 py-1.5 text-sm" onClick={clearMock}>Clear</button>}
        </div>
        {Boolean(mockOut) && (
          <pre className="text-xs bg-muted/10 p-2 rounded overflow-auto">{JSON.stringify(mockOut, null, 2)}</pre>
        )}
      </section>
    </div>
  )
}

function delay(ms: number) { return new Promise(res => setTimeout(res, ms)) }
