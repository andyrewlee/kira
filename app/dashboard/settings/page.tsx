"use client"

import { useEffect, useState } from "react"

type Conn = { connected: boolean; location?: string }

export default function SettingsPage() {
  const [conn, setConn] = useState<Conn>({ connected: false })
  useEffect(() => {
    const raw = localStorage.getItem("square-conn")
    if (raw) setConn(JSON.parse(raw))
  }, [])
  const write = (c: Conn) => { setConn(c); localStorage.setItem("square-conn", JSON.stringify(c)) }
  const connect = () => write({ connected: true, location: "Kira Coffee - Main" })
  const disconnect = () => write({ connected: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect integrations and manage your account.</p>
      </div>

      <section className="border rounded-md p-4 space-y-2">
        {!conn.connected ? (
          <button className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm" onClick={connect}>Connect Square</button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm">Connected to <span className="font-medium">{conn.location}</span></div>
            <button className="border px-3 py-1.5 text-sm" onClick={disconnect}>Disconnect</button>
          </div>
        )}
      </section>

      <section className="border rounded-md p-4 space-y-2">
        <div className="text-sm">Endpoint: <code>/api/square/webhook</code></div>
        <div className="text-sm">Delivery: <span className="text-green-700 font-medium">OK</span></div>
      </section>

      <section className="border rounded-md p-4 space-y-2">
        <div className="text-sm">Plan: <span className="font-medium">Starter</span></div>
        <button className="border px-3 py-1.5 text-sm">Update Payment (stub)</button>
      </section>
    </div>
  );
}
