"use client"

export default function PickupTemplatesPage() {
  const demos = [
    { id: 'rush', name: 'Rush Hour', desc: '10+ orders with constant updates' },
    { id: 'quiet', name: 'Quiet', desc: 'Single order trickling in' },
    { id: 'default', name: 'Default', desc: 'A balanced mix of Preparing/Finished' },
  ]
  const goToDemo = (id: string) => { const q = id==='default' ? '' : `?demo=${id}`; window.location.href = `/dashboard/pickup/editor${q}` }
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl">Pickup Screen · Templates</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {demos.map(d => (
          <div key={d.id} className="border rounded p-3">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm text-muted-foreground">{d.desc}</div>
            <button className="mt-2 border px-2 py-1 text-sm" onClick={()=>goToDemo(d.id)}>Use</button>
          </div>
        ))}
      </div>
    </div>
  )
}
