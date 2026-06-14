'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Sparkles, Copy, ChevronRight, Check, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const STEPS = [
  { id: 1, title: 'El Héroe', subtitle: '¿Quién es tu cliente ideal y qué quiere?' },
  { id: 2, title: 'El Problema', subtitle: 'El villano y los 3 niveles de dolor' },
  { id: 3, title: 'El Guía', subtitle: 'Cómo la marca muestra empatía y autoridad' },
  { id: 4, title: 'El Plan', subtitle: 'Los 3 pasos simples hacia la solución' },
  { id: 5, title: 'La Acción', subtitle: 'CTAs directas y de transición' },
  { id: 6, title: 'El Fracaso', subtitle: '¿Qué pierde si no actúa?' },
  { id: 7, title: 'El Éxito', subtitle: 'La transformación prometida' },
]

type OutputType = 'one_liner' | 'brandscript' | 'website_copy' | 'email_sequence'

const OUTPUTS: { id: OutputType; label: string; desc: string }[] = [
  { id: 'one_liner', label: 'One-Liner', desc: '2 oraciones que definen la marca' },
  { id: 'brandscript', label: 'BrandScript', desc: 'Narrativa completa de 1 página' },
  { id: 'website_copy', label: 'Copy de Sitio Web', desc: 'Todas las secciones de la web' },
  { id: 'email_sequence', label: 'Secuencia de 5 Emails', desc: 'Nurturing completo' },
]

export default function StoryBrandPage() {
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    hero_name: '', hero_wants: '',
    villain: '', external_problem: '', internal_problem: '', philosophical_problem: '',
    empathy_statement: '', authority_proof: '',
    plan_step_1: '', plan_step_2: '', plan_step_3: '',
    direct_cta: '', transitional_cta: '',
    failure_stakes: '',
    success_vision: '',
  })
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<Record<OutputType, string>>({
    one_liner: '', brandscript: '', website_copy: '', email_sequence: ''
  })
  const [activeOutput, setActiveOutput] = useState<OutputType>('one_liner')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.from('clients').select('id, name').order('created_at').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  useEffect(() => {
    if (!clientId) return
    supabase.from('storybrand').select('*').eq('client_id', clientId).single().then(({ data }) => {
      if (data) {
        setForm(f => ({ ...f, ...data }))
        setOutput({ one_liner: data.one_liner || '', brandscript: data.brandscript || '', website_copy: data.website_copy || '', email_sequence: data.email_sequence || '' })
      }
    })
  }, [clientId])

  const saveToSupabase = async (updatedOutput: Record<OutputType, string>) => {
    if (!clientId) return
    setSaving(true)
    const payload = { client_id: clientId, ...form, ...updatedOutput, updated_at: new Date().toISOString() }
    const { data: existing } = await supabase.from('storybrand').select('id').eq('client_id', clientId).single()
    if (existing) {
      await supabase.from('storybrand').update(payload).eq('client_id', clientId)
    } else {
      await supabase.from('storybrand').insert([payload])
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const generate = async (action: OutputType) => {
    setLoading(true)
    setActiveOutput(action)
    try {
      const res = await fetch('/api/storybrand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: `generate_${action}`, data: form }),
      })
      const data = await res.json()
      const updated = { ...output, [action]: data.result }
      setOutput(updated)
      await saveToSupabase(updated)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(output[activeOutput])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>¿Quién es tu cliente ideal? (nombre del avatar)</label>
            <input placeholder="Ej: Emprendedor Latino, Coach de Negocios, Mamá Emprendedora..." value={form.hero_name} onChange={e => update('hero_name', e.target.value)} />
          </div>
          <div>
            <label>¿Qué quiere lograr tu cliente ideal? (su deseo más profundo)</label>
            <textarea placeholder="Ej: Escalar su negocio a 6 cifras sin sacrificar su familia ni su tiempo libre..." value={form.hero_wants} onChange={e => update('hero_wants', e.target.value)} />
          </div>
        </div>
      )
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>¿Cuál es el VILLANO? (la fuente real del problema, no una persona)</label>
            <input placeholder="Ej: La mentalidad de escasez, el algoritmo impredecible, la falta de sistema..." value={form.villain} onChange={e => update('villain', e.target.value)} />
          </div>
          <div>
            <label>Problema EXTERNO (tangible, observable)</label>
            <input placeholder="Ej: No tiene suficientes clientes que paguen bien..." value={form.external_problem} onChange={e => update('external_problem', e.target.value)} />
          </div>
          <div>
            <label>Problema INTERNO (cómo se siente por eso)</label>
            <textarea placeholder="Ej: Se siente frustrado, invisible, trabajando mucho sin ver resultados..." value={form.internal_problem} onChange={e => update('internal_problem', e.target.value)} />
          </div>
          <div>
            <label>Problema FILOSÓFICO (por qué esto no debería existir en el mundo)</label>
            <input placeholder="Ej: Los emprendedores talentosos merecen ser reconocidos y bien pagados..." value={form.philosophical_problem} onChange={e => update('philosophical_problem', e.target.value)} />
          </div>
        </div>
      )
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>Declaración de EMPATÍA (muestra que entiendes el dolor)</label>
            <textarea placeholder="Ej: Sabemos lo frustrante que es trabajar 12 horas al día y seguir sin llegar a fin de mes..." value={form.empathy_statement} onChange={e => update('empathy_statement', e.target.value)} />
          </div>
          <div>
            <label>AUTORIDAD (por qué deben confiar en ti como guía)</label>
            <textarea placeholder="Ej: Hemos ayudado a más de 200 emprendedores a escalar sus ingresos, ganamos X premios, 15 años de experiencia..." value={form.authority_proof} onChange={e => update('authority_proof', e.target.value)} />
          </div>
        </div>
      )
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#9494aa', margin: 0 }}>El plan debe ser simple. Máximo 3 pasos que eliminen el miedo de avanzar.</p>
          {[1,2,3].map(n => (
            <div key={n}>
              <label>Paso {n}</label>
              <input
                placeholder={n === 1 ? 'Ej: Agenda tu sesión estratégica gratuita' : n === 2 ? 'Ej: Recibe tu plan personalizado de 90 días' : 'Ej: Ejecuta y escala tu negocio con apoyo'}
                value={form[`plan_step_${n}` as keyof typeof form]}
                onChange={e => update(`plan_step_${n}`, e.target.value)}
              />
            </div>
          ))}
        </div>
      )
      case 5: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>CTA DIRECTA (lo que quieres que hagan ahora)</label>
            <input placeholder="Ej: Agenda tu sesión ahora / Compra el programa / Descarga gratis..." value={form.direct_cta} onChange={e => update('direct_cta', e.target.value)} />
          </div>
          <div>
            <label>CTA TRANSITIONAL (para los que aún no están listos)</label>
            <input placeholder="Ej: Descarga el ebook gratuito / Ve el webinar / Lee el blog..." value={form.transitional_cta} onChange={e => update('transitional_cta', e.target.value)} />
          </div>
        </div>
      )
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>¿Qué pierde tu cliente si NO actúa? (las consecuencias reales)</label>
            <textarea placeholder="Ej: Seguirá invirtiendo tiempo y dinero en estrategias que no funcionan. Su competencia lo superará. Dentro de un año seguirá exactamente igual..." value={form.failure_stakes} onChange={e => update('failure_stakes', e.target.value)} />
          </div>
        </div>
      )
      case 7: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>¿Cómo se ve la vida de tu cliente después de trabajar contigo? (la transformación)</label>
            <textarea placeholder="Ej: Tiene un negocio que genera ingresos sin su presencia constante. Trabaja 4 horas al día y genera más que antes en 12. Tiene claridad, tiempo y libertad..." value={form.success_vision} onChange={e => update('success_vision', e.target.value)} rows={5} />
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: '#7c3aed20', border: '1px solid #7c3aed40', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} color="#7c3aed" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>StoryBrand Builder</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Construye el framework de 7 elementos. Genera BrandScript, One-Liner, copy web y emails automáticamente.
        </p>
      </div>

      {/* Client selector */}
      <div className="card-dark" style={{ padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: 13, color: '#9494aa', whiteSpace: 'nowrap' }}>Cliente:</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ flex: 1 }}>
          <option value="">— Selecciona un cliente —</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {saving && <span style={{ fontSize: 12, color: '#9494aa', display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={12} /> Guardando...</span>}
        {saved && <span style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Guardado</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Form */}
        <div>
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {STEPS.map(s => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                style={{
                  padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                  background: step === s.id ? '#7c3aed' : '#1a1a28',
                  color: step === s.id ? 'white' : '#9494aa',
                  border: `1px solid ${step === s.id ? '#7c3aed' : '#1e1e30'}`,
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {s.id}. {s.title}
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="card-dark" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>
                {STEPS[step - 1].title}
              </h2>
              <p style={{ fontSize: 13, color: '#9494aa', margin: 0 }}>
                {STEPS[step - 1].subtitle}
              </p>
            </div>
            {renderStep()}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button
                className="btn-ghost"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                style={{ opacity: step === 1 ? 0.4 : 1 }}
              >
                ← Anterior
              </button>
              {step < 7 ? (
                <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
                  Siguiente <ChevronRight size={14} />
                </button>
              ) : (
                <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={14} /> StoryBrand completo — genera abajo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Generate outputs */}
        <div>
          <div className="card-dark" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Sparkles size={16} color="#f59e0b" />
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Generar con IA</h3>
            </div>

            {/* Output selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {OUTPUTS.map(out => (
                <button
                  key={out.id}
                  onClick={() => setActiveOutput(out.id)}
                  style={{
                    padding: '12px 14px', borderRadius: 8, textAlign: 'left',
                    background: activeOutput === out.id ? '#7c3aed15' : 'transparent',
                    border: `1px solid ${activeOutput === out.id ? '#7c3aed40' : '#1e1e30'}`,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: activeOutput === out.id ? '#a78bfa' : '#f8f8fc' }}>
                    {out.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#9494aa', marginTop: 2 }}>{out.desc}</div>
                </button>
              ))}
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => generate(activeOutput)}
              disabled={loading}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generando...</> : <><Sparkles size={14} /> Generar {OUTPUTS.find(o => o.id === activeOutput)?.label}</>}
            </button>

            {/* Output */}
            {output[activeOutput] && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#9494aa' }}>Resultado</span>
                  <button
                    className="btn-ghost"
                    style={{ padding: '4px 10px', fontSize: 12 }}
                    onClick={copyText}
                  >
                    {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                  </button>
                </div>
                <div style={{
                  background: '#0a0a12', border: '1px solid #1e1e30', borderRadius: 8,
                  padding: 16, fontSize: 13, lineHeight: 1.7, color: '#d8d8f0',
                  maxHeight: 400, overflowY: 'auto', whiteSpace: 'pre-wrap'
                }}>
                  {output[activeOutput]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
