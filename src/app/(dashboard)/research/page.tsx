'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, Loader2, Check } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'
import { supabase } from '@/lib/supabase'

export default function ResearchPage() {
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    brand_name: '', industry: '', description: '',
    demographics: '', market: 'Latinoamérica', avatar_name: '',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('clients').select('id, name').order('created_at').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/research', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      })
      const data = await res.json()
      setOutput(data.result)
      if (clientId) {
        setSaving(true)
        const { data: existing } = await supabase.from('audience_research').select('id').eq('client_id', clientId).single()
        const payload = { client_id: clientId, demographics: form.demographics, competitor_analysis: data.result }
        if (existing) {
          await supabase.from('audience_research').update(payload).eq('client_id', clientId)
        } else {
          await supabase.from('audience_research').insert([payload])
        }
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: '#8b5cf620', border: '1px solid #8b5cf640', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={18} color="#8b5cf6" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Investigador de Clientes</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Avatar profundo, psicografía, voz del cliente, mapa de dolor y objeciones con respuestas. Todo listo para copywriting.
        </p>
      </div>

      <div className="card-dark" style={{ padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: 13, color: '#9494aa', whiteSpace: 'nowrap' }}>Cliente:</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ flex: 1 }}>
          <option value="">— Selecciona un cliente (opcional para guardar) —</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {saving && <span style={{ fontSize: 12, color: '#9494aa', display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={12} /> Guardando...</span>}
        {saved && <span style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Guardado</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card-dark" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Datos del Cliente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Marca / Negocio</label>
                <input placeholder="Carmen Victoria Pardo" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria / Nicho</label>
                <input placeholder="Coaching de negocios, marketing..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
            </div>
            <div>
              <label>Nombre del avatar (para personalizar el perfil)</label>
              <input placeholder="Ej: Emprende Laura, El Coach Juan, La Directora Ana..." value={form.avatar_name} onChange={e => u('avatar_name', e.target.value)} />
            </div>
            <div>
              <label>Descripción del negocio / qué ofrece</label>
              <textarea placeholder="Describe qué vende, cómo ayuda a sus clientes, su propuesta de valor..." value={form.description} onChange={e => u('description', e.target.value)} rows={4} />
            </div>
            <div>
              <label>Datos demográficos que ya conoces</label>
              <textarea placeholder="Ej: Mujeres 35-50 años, empresarias, Miami y LATAM, ingresos medios-altos..." value={form.demographics} onChange={e => u('demographics', e.target.value)} rows={3} />
            </div>
            <div>
              <label>Mercado principal</label>
              <select value={form.market} onChange={e => u('market', e.target.value)}>
                <option>Latinoamérica</option>
                <option>Estados Unidos (hispano)</option>
                <option>España</option>
                <option>México</option>
                <option>Colombia</option>
                <option>Argentina</option>
                <option>Global hispanohablante</option>
              </select>
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.brand_name}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Investigando audiencia...</> : <><Sparkles size={14} /> Crear Perfil de Audiencia Completo</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Perfil de Audiencia" />
        </div>
      </div>
    </div>
  )
}
