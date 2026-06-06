'use client'

import { useState } from 'react'
import { TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'

export default function StrategyPage() {
  const [form, setForm] = useState({
    brand_name: '', industry: '', period: '',
    main_objective: '', challenges: '',
    has_storybrand: true, has_voice: true,
    metrics_summary: '', previous_month: '',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const u = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/strategy', {
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
          <div style={{ width: 36, height: 36, background: '#f9731620', border: '1px solid #f9731640', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} color="#f97316" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Asesor de Estrategia Mensual</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          IA analiza los números, el StoryBrand y la voz. Genera informe de estrategia con plan de acción listo para presentar al cliente.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card-dark" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Datos para el Análisis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Cliente</label>
                <input placeholder="Carmen Victoria Pardo" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Período (Mes Año)</label>
                <input placeholder="Junio 2026" value={form.period} onChange={e => u('period', e.target.value)} />
              </div>
            </div>
            <div>
              <label>Industria</label>
              <input placeholder="Coaching de negocios, marca personal..." value={form.industry} onChange={e => u('industry', e.target.value)} />
            </div>
            <div>
              <label>Objetivo principal de este mes</label>
              <input placeholder="Lanzar nuevo programa, crecer 20% en seguidores, generar 50 leads..." value={form.main_objective} onChange={e => u('main_objective', e.target.value)} />
            </div>
            <div>
              <label>Desafíos o problemas actuales</label>
              <textarea placeholder="Bajo engagement en Instagram, pocas conversiones, inconsistencia en publicación..." value={form.challenges} onChange={e => u('challenges', e.target.value)} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.has_storybrand} onChange={e => u('has_storybrand', e.target.checked)} style={{ width: 'auto' }} />
                <span style={{ fontSize: 13 }}>StoryBrand definido</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.has_voice} onChange={e => u('has_voice', e.target.checked)} style={{ width: 'auto' }} />
                <span style={{ fontSize: 13 }}>Brand Voice definida</span>
              </label>
            </div>
            <div>
              <label>Resumen de métricas del mes (pega los datos clave)</label>
              <textarea
                placeholder={`Ej:
Instagram: 5,626 seguidores (+120), engagement 3.2%, 12 posts, alcance 18k
TikTok: 2,727 seguidores (+80), 8 videos, 45k vistas
YouTube: 340 subs, 2 videos, 1,200 vistas
Leads generados: 15
Ventas cerradas: 3`}
                value={form.metrics_summary}
                onChange={e => u('metrics_summary', e.target.value)}
                rows={7}
              />
            </div>
            <div>
              <label>Comparativa mes anterior (opcional)</label>
              <textarea placeholder="Instagram: 5,506 seguidores, engagement 2.8%, 10 posts..." value={form.previous_month} onChange={e => u('previous_month', e.target.value)} rows={4} />
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.brand_name || !form.metrics_summary}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analizando y generando informe...</> : <><Sparkles size={14} /> Generar Informe Estratégico</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Informe de Estrategia Mensual" />
        </div>
      </div>
    </div>
  )
}
