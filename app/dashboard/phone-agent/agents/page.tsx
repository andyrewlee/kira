"use client"

import { useState } from "react"

type Agent = { id: string; name: string; active: boolean; callsToday: number; containment: number }

const MOCK: Agent[] = [
  { id: 'a1', name: 'Store Receptionist', active: true, callsToday: 24, containment: 0.62 },
  { id: 'a2', name: 'After-hours Voicemail', active: false, callsToday: 0, containment: 0.0 },
]

export default function PhoneAgentAgentsPage() {
  const [list, setList] = useState<Agent[]>(MOCK)
  const toggle = (id: string) => setList(xs => xs.map(a => a.id===id? {...a, active: !a.active}: a))
  const clone = (id: string) => {
    const src = list.find(a=>a.id===id); if (!src) return
    setList(xs => [...xs, { ...src, id: Math.random().toString(36).slice(2), name: src.name + ' Copy', active: false, callsToday: 0 }])
  }
  const remove = (id: string) => setList(xs => xs.filter(a=>a.id!==id))
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl">Phone Agent · Agents</h1>
      <table className="w-full text-sm border rounded">
        <thead>
          <tr className="bg-muted/40">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Active</th>
            <th className="text-left p-2">Calls (Today)</th>
            <th className="text-left p-2">Containment</th>
            <th className="text-left p-2" />
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.name}</td>
              <td className="p-2">{a.active ? <span className="text-green-700">On</span> : <span className="text-muted-foreground">Off</span>}</td>
              <td className="p-2">{a.callsToday}</td>
              <td className="p-2">{Math.round(a.containment*100)}%</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button className="border px-2 py-1" onClick={()=>toggle(a.id)}>{a.active ? 'Disable' : 'Enable'}</button>
                  <button className="border px-2 py-1" onClick={()=>clone(a.id)}>Clone</button>
                  <button className="border px-2 py-1" onClick={()=>remove(a.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
