'use client'

import { useState } from 'react'
import { Megaphone, Sparkles, Loader2 } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'

const PLATFORMS_LIST = ['Meta (Facebook + Instagram)', 'TikTok Ads', 'Google Ads', 'LinkedIn Ads', 'YouTube Ads', 'Pinterest Ads']
const OBJECTIVES = [
  { id: 'awareness', label: 'Reconocimiento de Marca', desc: 'Llegar a nuevas audiencias' },
  { id: 'engagement', label: 'Engagement y Comunidad', desc: 'Likes, comentarios, shares' },
  { id: 'leads', label: 'Generación de Leads', desc: 'Capturar contactos calificados' },
  { id: 'sales', label: 'Ventas Directas', desc: 'Conversión a compra' },
  { id: 'retargeting', label: 'Retargeting', desc: 'Recuperar prospectos tibios' },
]

export default function CampaignsPage() {
  const [form, setForm] = useState({
    brand_name: '', industry: '', objective: 'leads',
    platforms: [] as string[], target_audience: '', budget_range: '',
    duration_days: '30', offer: '', tone_notes: '',
    hero_wants: '', main_problem: '', success_vision: '',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const u = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }))
  const togglePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p]
    }))
  }

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns', {
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
          <div style={{ width: 36, height: 36, background: '#ec487920', border: '1px solid #ec487940', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={18} color="#ec4899" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Campañas & ADS</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Campañas completas con 3 conjuntos de ads, variaciones A/B, adaptaciones por red y flujo de retargeting.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card-dark" style={{ padding: 24, overflowY: 'auto', maxHeight: '80vh' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Configurar Campaña</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Marca / Cliente</label>
                <input placeholder="North Factory LLC" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria</label>
                <input placeholder="Marketing digital..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Objetivo de la campaña</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {OBJECTIVES.map(o => (
                  <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 0 }}>
                    <input type="radio" name="objective" value={o.id} checked={form.objective === o.id} onChange={e => u('objective', e.target.value)} style={{ width: 'auto' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#f8f8fc' }}>{o.label}</div>
                      <div style={{ fontSize: 11, color: '#9494aa' }}>{o.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label>Plataformas</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {PLATFORMS_LIST.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    style={{
                      padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                      background: form.platforms.includes(p) ? '#ec487920' : 'transparent',
                      color: form.platforms.includes(p) ? '#ec4899' : '#9494aa',
                      border: `1px solid ${form.platforms.includes(p) ? '#ec487940' : '#1e1e30'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label>Oferta / Producto a promover</label>
              <textarea placeholder="Ej: Programa de 3 meses de mentoría grupal para escalar tu agencia a $10k/mes..." value={form.offer} onChange={e => u('offer', e.target.value)} rows={3} />
            </div>

            <div>
              <label>Audiencia objetivo</label>
              <textarea placeholder="Ej: Emprendedores latinos 28-45 años, dueños de negocios de servicios, ingresos $2k-8k/mes, activos en Instagram y Facebook..." value={form.target_audience} onChange={e => u('target_audience', e.target.value)} rows={3} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Presupuesto estimado</label>
                <input placeholder="$500-2000 USD/mes" value={form.budget_range} onChange={e => u('budget_range', e.target.value)} />
              </div>
              <div>
                <label>Duración (días)</label>
                <input type="number" value={form.duration_days} onChange={e => u('duration_days', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Tono de marca</label>
              <input placeholder="Directo, inspirador, sin rodeos, cercano..." value={form.tone_notes} onChange={e => u('tone_notes', e.target.value)} />
            </div>

            <div style={{ borderTop: '1px solid #1e1e30', paddingTop: 14 }}>
              <div style={{ fontSize: 12, color: '#9494aa', marginBottom: 10 }}>Contexto StoryBrand (opcional pero recomendado)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label>¿Qué quiere el cliente ideal?</label>
                  <input placeholder="Escalar su negocio a 6 cifras..." value={form.hero_wants} onChange={e => u('hero_wants', e.target.value)} />
                </div>
                <div>
                  <label>Problema principal</label>
                  <input placeholder="No tiene sistema de captación de clientes..." value={form.main_problem} onChange={e => u('main_problem', e.target.value)} />
                </div>
                <div>
                  <label>Visión de éxito</label>
                  <input placeholder="Negocio escalable que genera sin su presencia..." value={form.success_vision} onChange={e => u('success_vision', e.target.value)} />
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.offer}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Creando campaña...</> : <><Sparkles size={14} /> Generar Campaña Completa</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Campaña Generada" />
        </div>
      </div>
    </div>
  )
}
