'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Sparkles, Loader2, Check } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'
import { supabase } from '@/lib/supabase'

export default function OffersPage() {
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    brand_name: '', offer_name: '', target_avatar: '',
    core_problem: '', core_result: '', price: '', currency: 'USD',
    deliverables: '', industry: '',
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
      const res = await fetch('/api/offers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      })
      const data = await res.json()
      setOutput(data.result)
      if (clientId) {
        setSaving(true)
        const payload = {
          client_id: clientId,
          offer_name: form.offer_name,
          dream_outcome: form.core_result,
          target_audience: form.target_avatar,
          price_point: `${form.price} ${form.currency}`,
          offer_stack: data.result,
        }
        const { data: existing } = await supabase.from('offers').select('id').eq('client_id', clientId).eq('offer_name', form.offer_name).single()
        if (existing) {
          await supabase.from('offers').update(payload).eq('id', existing.id)
        } else {
          await supabase.from('offers').insert([payload])
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
          <div style={{ width: 36, height: 36, background: '#10b98120', border: '1px solid #10b98140', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb size={18} color="#10b981" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Diseñador de Ofertas Irresistibles</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Stack de valor, garantía, bonos y copy completo. Método Hormozi aplicado a tu oferta.
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
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Datos de la Oferta</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Marca / Cliente</label>
                <input placeholder="North Factory LLC" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria</label>
                <input placeholder="Agencia de marketing..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
            </div>
            <div>
              <label>Nombre del producto/servicio</label>
              <input placeholder="Programa de Aceleración 90 días, Consultoría VIP, etc." value={form.offer_name} onChange={e => u('offer_name', e.target.value)} />
            </div>
            <div>
              <label>Cliente ideal (avatar)</label>
              <input placeholder="Emprendedor con negocio de 1-3 años que quiere escalar..." value={form.target_avatar} onChange={e => u('target_avatar', e.target.value)} />
            </div>
            <div>
              <label>Problema principal que resuelve</label>
              <textarea placeholder="No tiene sistema de clientes recurrentes, trabaja más de 60 horas semanales sin ver crecer sus ingresos..." value={form.core_problem} onChange={e => u('core_problem', e.target.value)} rows={3} />
            </div>
            <div>
              <label>Resultado específico que entrega (con métricas)</label>
              <textarea placeholder="Genera su primer $10k/mes en 90 días con un sistema de adquisición de clientes predecible..." value={form.core_result} onChange={e => u('core_result', e.target.value)} rows={3} />
            </div>
            <div>
              <label>Entregables actuales (qué incluye hoy)</label>
              <textarea placeholder="4 sesiones de coaching, acceso a comunidad, plantillas, etc." value={form.deliverables} onChange={e => u('deliverables', e.target.value)} rows={3} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div>
                <label>Precio de inversión</label>
                <input type="number" placeholder="2500" value={form.price} onChange={e => u('price', e.target.value)} />
              </div>
              <div>
                <label>Moneda</label>
                <select value={form.currency} onChange={e => u('currency', e.target.value)}>
                  <option>USD</option><option>EUR</option><option>MXN</option><option>COP</option><option>ARS</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.offer_name}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Diseñando oferta...</> : <><Sparkles size={14} /> Crear Oferta Irresistible</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Oferta Diseñada" />
        </div>
      </div>
    </div>
  )
}
