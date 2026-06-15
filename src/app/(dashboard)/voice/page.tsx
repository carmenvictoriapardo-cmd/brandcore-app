'use client'

import { useState, useEffect } from 'react'
import { Mic2, Sparkles, Loader2, Plus, X, Check } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'
import { supabase } from '@/lib/supabase'

const ARCHETYPES = [
  { id: 'hero', label: 'Héroe', desc: 'Valiente, superación, determinación' },
  { id: 'sage', label: 'Sabio', desc: 'Conocimiento, expertise, verdad' },
  { id: 'caregiver', label: 'Cuidador', desc: 'Empatía, apoyo, servicio' },
  { id: 'creator', label: 'Creador', desc: 'Innovación, visión, originalidad' },
  { id: 'ruler', label: 'Gobernante', desc: 'Control, liderazgo, éxito' },
  { id: 'jester', label: 'Bufón', desc: 'Diversión, ligereza, humor' },
  { id: 'lover', label: 'Amante', desc: 'Pasión, conexión, belleza' },
  { id: 'rebel', label: 'Rebelde', desc: 'Disrupción, autenticidad, cambio' },
  { id: 'magician', label: 'Mago', desc: 'Transformación, visión, magia' },
  { id: 'explorer', label: 'Explorador', desc: 'Aventura, libertad, descubrimiento' },
  { id: 'innocent', label: 'Inocente', desc: 'Optimismo, pureza, simplicidad' },
  { id: 'everyman', label: 'Ciudadano', desc: 'Pertenencia, realidad, comunidad' },
]

export default function VoicePage() {
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    brand_name: '', industry: '', archetype: 'hero',
    brand_personality: '', communication_style: '',
    tone_formal: 5, tone_humor: 3, tone_bold: 7, tone_inspirational: 8,
    yes_words: [] as string[], no_words: [] as string[],
  })
  const [yesInput, setYesInput] = useState('')
  const [noInput, setNoInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('clients').select('id, name').order('created_at').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  useEffect(() => {
    if (!clientId) return
    supabase.from('brand_voice').select('*').eq('client_id', clientId).single().then(({ data }) => {
      if (data) {
        setForm(f => ({
          ...f,
          archetype: data.archetype || 'hero',
          tone_formal: data.formality || 5,
          tone_humor: data.humor || 3,
          tone_bold: data.boldness || 7,
          tone_inspirational: data.inspiration || 8,
          yes_words: data.yes_words || [],
          no_words: data.no_words || [],
        }))
        setOutput(data.voice_guide || '')
      }
    })
  }, [clientId])

  const saveToSupabase = async (guide: string) => {
    if (!clientId) return
    setSaving(true)
    const payload = {
      client_id: clientId,
      archetype: form.archetype,
      formality: form.tone_formal,
      humor: form.tone_humor,
      boldness: form.tone_bold,
      inspiration: form.tone_inspirational,
      yes_words: form.yes_words,
      no_words: form.no_words,
      voice_guide: guide,
      updated_at: new Date().toISOString(),
    }
    const { data: existing } = await supabase.from('brand_voice').select('id').eq('client_id', clientId).single()
    if (existing) {
      await supabase.from('brand_voice').update(payload).eq('client_id', clientId)
    } else {
      await supabase.from('brand_voice').insert([payload])
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const u = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))
  const addWord = (type: 'yes' | 'no', word: string) => {
    if (!word.trim()) return
    if (type === 'yes') { setForm(f => ({ ...f, yes_words: [...f.yes_words, word.trim()] })); setYesInput('') }
    else { setForm(f => ({ ...f, no_words: [...f.no_words, word.trim()] })); setNoInput('') }
  }
  const removeWord = (type: 'yes' | 'no', word: string) => {
    if (type === 'yes') setForm(f => ({ ...f, yes_words: f.yes_words.filter(w => w !== word) }))
    else setForm(f => ({ ...f, no_words: f.no_words.filter(w => w !== word) }))
  }

  const ToneSlider = ({ label, field, low, high }: { label: string; field: keyof typeof form; low: string; high: string }) => (
    <div>
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: '#9494aa', minWidth: 60 }}>{low}</span>
        <input type="range" min={1} max={10} value={form[field] as number} onChange={e => u(field, parseInt(e.target.value))}
          style={{ flex: 1, background: 'transparent', accentColor: '#7c3aed' }} />
        <span style={{ fontSize: 11, color: '#9494aa', minWidth: 60, textAlign: 'right' }}>{high}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', minWidth: 20 }}>{form[field] as number}</span>
      </div>
    </div>
  )

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/voice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      })
      const data = await res.json()
      setOutput(data.result)
      await saveToSupabase(data.result)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: '#0ea5e920', border: '1px solid #0ea5e940', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mic2 size={18} color="#0ea5e9" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Brand Voice & Tono</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Define el arquetipo, escala de tonos y vocabulario. Genera la guía de voz completa con ejemplos reales por plataforma.
        </p>
      </div>

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
        <div className="card-dark" style={{ padding: 24, overflowY: 'auto', maxHeight: '80vh' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Definir Voz de Marca</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Marca / Cliente</label>
                <input placeholder="Carmen Victoria Pardo" value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria</label>
                <input placeholder="Coaching, agencia, marca personal..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Arquetipo de Marca</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                {ARCHETYPES.map(a => (
                  <button key={a.id} onClick={() => u('archetype', a.id)} style={{
                    padding: '8px 10px', borderRadius: 8, textAlign: 'left',
                    background: form.archetype === a.id ? '#0ea5e920' : 'transparent',
                    border: `1px solid ${form.archetype === a.id ? '#0ea5e940' : '#1e1e30'}`,
                    cursor: 'pointer'
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: form.archetype === a.id ? '#0ea5e9' : '#f8f8fc' }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: '#9494aa' }}>{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label>Personalidad de la marca (descríbela como una persona)</label>
              <textarea placeholder="Ej: Si la marca fuera una persona sería una mentora apasionada de 40 años, directa pero cálida, que habla sin filtros pero con mucha empatía..." value={form.brand_personality} onChange={e => u('brand_personality', e.target.value)} rows={3} />
            </div>

            <div>
              <label>Estilo de comunicación</label>
              <textarea placeholder="Ej: Habla directamente a los problemas del cliente, usa storytelling breve, evita jerga técnica, usa pronombres cercanos (tú/tu)..." value={form.communication_style} onChange={e => u('communication_style', e.target.value)} rows={3} />
            </div>

            <div style={{ borderTop: '1px solid #1e1e30', paddingTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Escala de Tonos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <ToneSlider label="Formalidad" field={"tone_formal" as keyof typeof form} low="Muy casual" high="Muy formal" />
                <ToneSlider label="Humor" field={"tone_humor" as keyof typeof form} low="Serio" high="Divertido" />
                <ToneSlider label="Atrevimiento" field={"tone_bold" as keyof typeof form} low="Suave" high="Muy directo" />
                <ToneSlider label="Inspiracional" field={"tone_inspirational" as keyof typeof form} low="Neutro" high="Muy inspirador" />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1e1e30', paddingTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Vocabulario de Marca</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Palabras SÍ usamos</label>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    <input placeholder="Agrega palabra..." value={yesInput} onChange={e => setYesInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord('yes', yesInput)} style={{ flex: 1 }} />
                    <button onClick={() => addWord('yes', yesInput)} style={{ padding: '0 10px', background: '#10b98120', border: '1px solid #10b98140', borderRadius: 8, cursor: 'pointer', color: '#10b981' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {form.yes_words.map(w => (
                      <span key={w} style={{ padding: '3px 8px', background: '#10b98115', border: '1px solid #10b98130', borderRadius: 99, fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {w} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeWord('yes', w)} />
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Palabras NO usamos</label>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    <input placeholder="Agrega palabra..." value={noInput} onChange={e => setNoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord('no', noInput)} style={{ flex: 1 }} />
                    <button onClick={() => addWord('no', noInput)} style={{ padding: '0 10px', background: '#f8717120', border: '1px solid #f8717140', borderRadius: 8, cursor: 'pointer', color: '#f87171' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {form.no_words.map(w => (
                      <span key={w} style={{ padding: '3px 8px', background: '#f8717115', border: '1px solid #f8717130', borderRadius: 99, fontSize: 11, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {w} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeWord('no', w)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generate} disabled={loading || !form.brand_name}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generando guía de voz...</> : <><Sparkles size={14} /> Crear Guía de Voz Completa</>}
            </button>
          </div>
        </div>

        <div className="card-dark" style={{ padding: 24 }}>
          <AIOutputPanel output={output} loading={loading} title="Guía de Voz de Marca" />
        </div>
      </div>
    </div>
  )
}
