"use client"

export default function WebsiteTemplatesPage() {
  const templates = [
    { id: 'coffee-basic', name: 'Coffee — Basic', desc: 'Hero + Locations list + basic detail page' },
  ]
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl">Custom Website · Templates</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id} className="border rounded p-3">
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.desc}</div>
            <button className="mt-2 border px-2 py-1 text-sm" onClick={()=>{ window.location.href = `/dashboard/website/editor?template=${t.id}` }}>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  )
}
