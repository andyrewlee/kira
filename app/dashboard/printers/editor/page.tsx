"use client"

import { useState } from "react"
import FabricEditor from "@/components/editor/FabricEditor"

type Scope = "order" | "item"

export default function PrintersEditor() {
  const [scope, setScope] = useState<Scope>("order")
  const [scale] = useState(1)

  // scope toggles between order-wide and per-item templates

  return (
    <div className="space-y-4">
      <div>
        <FabricEditor
          width={640}
          height={1200}
          scale={scale}
          sidebarTop={(
            <div className="flex items-center justify-between">
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
          )}
        />
      </div>
    </div>
  )
}

// Template seeding moved to FabricEditor usage
