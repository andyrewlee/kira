"use client"

export default function PhoneAgentTemplatesPage() {
  const templates = [
    { id: 'reception-basic', name: 'Reception — Basic', desc: 'Hours, address, menu, reservations' },
    { id: 'faq-short', name: 'FAQ — Short Replies', desc: 'One-line concise responses' },
  ]
  const goToTemplate = (id: string) => { window.location.href = `/dashboard/phone-agent/editor?template=${id}` }
  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl">Phone Agent · Templates</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id} className="border rounded p-3">
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.desc}</div>
            <button className="mt-2 border px-2 py-1 text-sm" onClick={()=>goToTemplate(t.id)}>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  )
}
