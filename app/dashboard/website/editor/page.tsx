"use client"

import { useEffect, useState } from "react"

// Site type removed as unused in editor

export default function WebsiteEditorPage() {
  const [prompt, setPrompt] = useState("")
  const [html, setHtml] = useState("<h1>Welcome</h1><p>Describe what you want and click Generate.</p>")

  const generate = () => {
    const content = `<!doctype html><html><head><meta charset='utf-8'><title>Kira Site</title><style>body{font-family:system-ui;margin:2rem} h1{letter-spacing:.02em} .hero{padding:2rem;border:1px solid #000}</style></head><body>
      <div class='hero'><h1>${escapeHtml(titleFrom(prompt) || "Your Brand")}</h1><p>${escapeHtml(subFrom(prompt) || "Powered by Square data.")}</p></div>
      <h2>Hours</h2><p>{{catalog or square.hours}}</p>
      <h2>Menu Highlights</h2><ul><li>{{Americano}}</li><li>{{Blueberry Muffin}}</li></ul>
      </body></html>`
    setHtml(content)
  }

  // Load template from query and auto-generate
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    const t = p.get('template')
    if (!t) return
    const presets: Record<string,string> = {
      'coffee-basic': 'title: Kira Coffee\nsub: Find a store near you'
    }
    const text = presets[t] || ''
    if (text) {
      setPrompt(text)
      setTimeout(generate, 0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveDraft = () => { alert("Mock only — no persistence in prototype") }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <textarea className="w-full border rounded p-2 h-40" placeholder="Describe your site (brand, vibe, sections)…" value={prompt} onChange={e => setPrompt(e.target.value)} />
          <div className="flex gap-2">
            <button className="border px-3 py-1.5 text-sm" onClick={generate}>Generate</button>
            <button className="border px-3 py-1.5 text-sm" onClick={saveDraft}>Save Draft (mock)</button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Preview</label>
          <iframe className="w-full h-80 border rounded" srcDoc={html} />
        </div>
      </div>
    </div>
  )
}

function titleFrom(text: string) {
  const m = text.match(/title:\s*([^\n]+)/i)
  return m?.[1]?.trim()
}
function subFrom(text: string) {
  const m = text.match(/sub:\s*([^\n]+)/i)
  return m?.[1]?.trim()
}
// removed unused helper readSites
function escapeHtml(s: string){return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c] as string))}
