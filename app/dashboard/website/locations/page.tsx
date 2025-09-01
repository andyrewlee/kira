"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { LOCATIONS } from "../fixtures"

export default function LocationsIndexPage(){
  const [q,setQ]=useState("")
  const filtered = useMemo(()=>{
    const s=q.trim().toLowerCase()
    if (!s) return LOCATIONS
    return LOCATIONS.filter(l => `${l.name} ${l.address?.city} ${l.address?.region}`.toLowerCase().includes(s))
  },[q])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Locations</h1>
        <input className="border rounded px-2 py-1 text-sm" placeholder="Search name or city" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map(l => (
          <li key={l.id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="font-medium">{l.name}</div>
              <span className="text-xs px-2 py-0.5 rounded bg-green-600 text-white">Open</span>
            </div>
            <div className="text-sm text-muted-foreground">{l.address?.city} {l.address?.region}</div>
            <div className="mt-2"><Link className="text-sm underline" href={`/dashboard/website/locations/${l.id}`}>View details</Link></div>
          </li>
        ))}
      </ul>
    </div>
  )
}

