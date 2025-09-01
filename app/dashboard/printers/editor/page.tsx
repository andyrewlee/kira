"use client"

import { useEffect, useMemo, useState } from "react"
import CanvasEditor from "@/components/editor/CanvasEditor"

type Scope = "order" | "item"

export default function PrintersEditor() {
  const [scope, setScope] = useState<Scope>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("printers-scope") as Scope) || "order"
    }
    return "order"
  })

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("printers-scope", scope)
  }, [scope])

  const cfg = useMemo(() => {
    return scope === "order"
      ? { key: "order-editor", width: 384, height: 800, title: "Entire Order (receipt-size)" }
      : { key: "item-editor", width: 320, height: 240, title: "Per Item (label-size)" }
  }, [scope])

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
      <div className="text-sm text-muted-foreground">{cfg.title}</div>
      <CanvasEditor storageKey={cfg.key} width={cfg.width} height={cfg.height} />
    </div>
  )
}
