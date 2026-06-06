'use client'

import { useState } from 'react'
import { FileText, Sparkles, Loader2 } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'

const PLATFORMS = ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'YouTube (largo)', 'Podcast', 'Facebook', 'LinkedIn']
const FORMATS = [
  { id: 'hook_story_cta', label: 'Hook → Historia → CTA', desc: 'El más viral. Engancha, desarrolla, convierte.' },
  { id: 'problem_agitation_solution', label: 'Problema → Agitación → Solución', desc: 'Activa dolor, lo amplifica, ofrece salida.' },
  { id: 'before_after', label: 'Antes → Después', desc: 'Transformación visual y emocional.' },
  { id: 'storytelling', label: 'Storytelling', desc: 'Historia personal o de cliente que vende.' },
  { id: 'educational', label: 'Educacional', desc: 'Posicionamiento de autoridad y valor.' },
  { id: 'testimonial', label: 'Testimonio', desc: 'Prueba social que convierte.' },
]

export default function ScriptsPage() {
  const [form, setForm] = useState({
    brand_name: '', industry: '', topic: '', platform: 'Instagram Reels',
    format: 'hook_story_cta', duration_seconds: '', tone_notes: '',
    target_audience: '', special_instructions: '',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scripts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      })
      const data = await res.json()
      setOutput(data.result)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: '#f59e0b20', border: '1px solid #f59e0b40', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="#f59e0b" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Guionista Viral</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Guiones con hook irresistible, cuerpo que engancha y CTA que convierte. Variaciones A/B incluidas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card-dark" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Configurar Guión</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Marca / Persona</label>
                <input placeholder="North Factory LLC" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria / Nicho</label>
                <input placeholder="Marketing digital, coaching..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Tema del guión</label>
              <input placeholder="Ej: Por qué el 95% de emprendedores falla en redes sociales..." value={form.topic} onChange={e => u('topic', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Plataforma</label>
                <select value={form.platform} onChange={e => u('platform', e.target.value)}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label>Duración (segundos)</label>
                <input type="number" placeholder="60" value={form.duration_seconds} onChange={e => u('duration_seconds', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Formato del guión</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {FORMATS.map(f => (
                  <label key={f.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 0 }}>
                    <input type="radio" name="format" value={f.id} checked={form.format === f.id} onChange={e => u('format', e.target.value)} style={{ width: 'auto', marginTop: 3 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#f8f8fc' }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: '#9494aa' }}>{f.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label>Audiencia objetivo</label>
              <input placeholder="Emprendedores latinos 30-45 años que quieren escalar su negocio..." value={form.target_audience} onChange={e => u('target_audience', e.target.value)} />
            </div>

            <div>
              <label>Tono / Voz de la marca</label>
              <input placeholder="Inspirador, directo, cercano, sin rodeos..." value={form.tone_notes} onChange={e => u('tone_notes', e.target.value)} />
            </div>

            <div>
              <label>Instrucciones especiales (opcional)</label>
              <textarea placeholder="Mencionar X oferta, evitar Y tema, incluir estadística Z..." value={form.special_instructions} onChange={e => u('special_instructions', e.target.value)} rows={3} />
            </div>

            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.topic}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Escribiendo guión...</> : <><Sparkles size={14} /> Crear Guión Viral</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Guión Generado" />
        </div>
      </div>
    </div>
  )
}
