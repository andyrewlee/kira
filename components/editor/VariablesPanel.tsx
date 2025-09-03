"use client"

import { useEffect, useState } from "react"

type Props = {
  onInsert?: (token: string) => void
}

export default function VariablesPanel({ onInsert }: Props) {
  const [vars, setVars] = useState<Record<string, unknown>>({})

  // Inline sample variables; replace with live data when wired.
  useEffect(() => {
    const SAMPLE = {
      order: {
        id: "O-12345",
        location: "Kira Coffee - Main",
        number: "A57",
        createdAt: "2025-08-31T12:34:56Z",
        pickupTime: "2025-08-31T12:42:00Z",
        customer: { name: "Casey Harper" },
        items: [
          { name: "Americano", qty: 1, price: 350, modifiers: ["Oat Milk"] },
          { name: "Blueberry Muffin", qty: 1, price: 275 },
        ],
        subtotal: 625,
        tax: 50,
        total: 675,
        note: "No lid.",
      },
      catalog: {
        items: [
          { name: "Americano", sku: "AMER-12", price: 350 },
          { name: "Blueberry Muffin", sku: "MUF-BB", price: 275 },
        ],
      },
    }
    setVars(SAMPLE)
  }, [])

  function recurse(obj: unknown, prefix: string[] = []): Array<[string, string]> {
    const out: Array<[string, string]> = []
    if (Array.isArray(obj)) {
      out.push([`{{${prefix.join(".")}.length}}`, `${obj.length}`])
      return out
    }
    if (typeof obj === "object" && obj) {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (typeof v === "object") out.push(...recurse(v, [...prefix, k]))
        else out.push([`{{${[...prefix, k].join(".")}}}`, String(v)])
      }
    }
    return out
  }

  const flat = recurse(vars)

  return (
    <div className="border rounded-md p-2 h-64 overflow-auto">
      <div className="text-xs font-medium mb-2">Variables</div>
      {flat.length === 0 ? (
        <div className="text-xs text-muted-foreground">No sample variables found.</div>
      ) : (
        <ul className="space-y-1 text-xs">
          {flat.map(([token, value]) => (
            <li key={token} className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="font-mono text-left hover:underline"
                onClick={() => onInsert?.(token)}
                title="Insert into selected text"
              >
                {token}
              </button>
              <span className="text-muted-foreground truncate max-w-[8rem]">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
