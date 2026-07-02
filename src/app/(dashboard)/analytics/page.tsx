'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#e1306c', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', color: '#010101', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', color: '#1877f2', icon: '👤' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0a66c2', icon: '💼' },
  { id: 'youtube', label: 'YouTube', color: '#ff0000', icon: '▶️' },
]

interface PlatformData {
  followers: string
  followers_growth: string
  reach: string
  impressions: string
  engagement_rate: string
  posts_count: string
  avg_likes: string
  avg_comments: string
}

export default function AnalyticsPage() {
  const [client, setClient] = useState('')
  const [period, setPeriod] = useState('')
  const [active, setActive] = useState('instagram')
  const [data, setData] = useState<Record<string, PlatformData>>({})
  const [saved, setSaved] = useState(false)

  const u = (platform: string, field: string, value: string) => {
    setData(d => ({ ...d, [platform]: { ...d[platform], [field]: value } }))
  }

  const saveReport = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const ScoreCard = ({ label, value, prev }: { label: string; value: string; prev?: string }) => {
    const curr = parseFloat(value) || 0
    const p = parseFloat(prev || '0') || 0
    const diff = curr - p
    return (
      <div style={{ background: '#f8f9ff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px' }}>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{value || '—'}</div>
        {prev && (
          <div style={{ fontSize: 11, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: diff > 0 ? '#34d399' : diff < 0 ? '#f87171' : '#64748b' }}>
            {diff > 0 ? <TrendingUp size={10} /> : diff < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
            {diff > 0 ? '+' : ''}{diff.toFixed(0)} vs anterior
          </div>
        )}
      </div>
    )
  }

  const p = PLATFORMS.find(p => p.id === active)!
  const d = data[active] || {}

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: '#06b6d420', border: '1px solid #06b6d440', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={18} color="#06b6d4" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Analytics Dashboard</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          Registra las métricas mensuales de cada red. Compara, evalúa la salud y genera insights accionables.
        </p>
      </div>

      {/* Header: client + period */}
      <div className="card-dark" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label>Cliente</label>
          <input placeholder="Carmen Victoria Pardo" value={client} onChange={e => setClient(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Período (YYYY-MM)</label>
          <input type="month" value={period} onChange={e => setPeriod(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={saveReport}>
          {saved ? '✓ Guardado' : 'Guardar Reporte'}
        </button>
      </div>

      {/* Platform tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {PLATFORMS.map(pl => (
          <button key={pl.id} onClick={() => setActive(pl.id)} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: active === pl.id ? `${pl.color}20` : 'transparent',
            color: active === pl.id ? pl.color : '#64748b',
            border: `1px solid ${active === pl.id ? pl.color + '40' : '#e2e8f0'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            {pl.icon} {pl.label}
          </button>
        ))}
      </div>

      {/* Metrics input */}
      <div className="card-dark" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{p.icon}</span> {p.label} — Métricas del Mes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Seguidores totales', field: 'followers', placeholder: '5,626' },
            { label: 'Crecimiento (nuevos)', field: 'followers_growth', placeholder: '+120' },
            { label: 'Alcance total', field: 'reach', placeholder: '18,000' },
            { label: 'Impresiones', field: 'impressions', placeholder: '45,000' },
            { label: 'Tasa de engagement %', field: 'engagement_rate', placeholder: '3.2' },
            { label: 'Posts publicados', field: 'posts_count', placeholder: '12' },
            { label: 'Likes promedio', field: 'avg_likes', placeholder: '180' },
            { label: 'Comentarios promedio', field: 'avg_comments', placeholder: '15' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label>{label}</label>
              <input placeholder={placeholder} value={d[field as keyof PlatformData] || ''} onChange={e => u(active, field, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Score cards */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Resumen visual</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <ScoreCard label="Seguidores" value={d.followers || ''} />
            <ScoreCard label="Crecimiento" value={d.followers_growth || ''} />
            <ScoreCard label="Engagement %" value={d.engagement_rate ? `${d.engagement_rate}%` : ''} />
            <ScoreCard label="Posts" value={d.posts_count || ''} />
          </div>
        </div>

        {/* Engagement health indicator */}
        {d.engagement_rate && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 8, background: parseFloat(d.engagement_rate) >= 3 ? '#10b98110' : parseFloat(d.engagement_rate) >= 1 ? '#f59e0b10' : '#f8717110', border: `1px solid ${parseFloat(d.engagement_rate) >= 3 ? '#10b98130' : parseFloat(d.engagement_rate) >= 1 ? '#f59e0b30' : '#f8717130'}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: parseFloat(d.engagement_rate) >= 3 ? '#10b981' : parseFloat(d.engagement_rate) >= 1 ? '#f59e0b' : '#f87171' }}>
              {parseFloat(d.engagement_rate) >= 3 ? '🟢 Engagement excelente' : parseFloat(d.engagement_rate) >= 1 ? '🟡 Engagement aceptable — hay oportunidad de mejora' : '🔴 Engagement bajo — acción urgente requerida'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Benchmark del sector: {p.id === 'instagram' ? '1-5%' : p.id === 'tiktok' ? '3-9%' : p.id === 'linkedin' ? '2-5%' : '1-4%'}
            </div>
          </div>
        )}
      </div>

      {/* Next steps reminder */}
      <div className="card-dark" style={{ padding: 20, marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Próximo paso →</div>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          Con los datos ingresados, ve al módulo <strong style={{ color: '#f97316' }}>Asesor de Estrategia</strong> para generar el informe mensual completo con plan de acción y recomendaciones de IA.
        </p>
      </div>
    </div>
  )
}
