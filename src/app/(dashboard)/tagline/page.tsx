'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader2, Star, StarOff, ChevronRight, RotateCcw, Check, Zap } from 'lucide-react'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'
import { supabase } from '@/lib/supabase'

type Stage = 'setup' | 'discovery' | 'rounds' | 'refine' | 'final'

interface TaglineOption {
  text: string
  angle: string
  starred: boolean
  round: number
}

export default function TaglinePage() {
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [clientId, setClientId] = useState('')
  const [stage, setStage] = useState<Stage>('setup')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('clients').select('id, name').order('created_at').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  const saveTagline = async (taglineText: string, angle: string, analysis: string) => {
    if (!clientId) return
    await supabase.from('taglines').insert([{
      client_id: clientId,
      tagline: taglineText,
      angle,
      final_analysis: analysis,
      is_selected: true,
    }])
  }

  // Setup
  const [form, setForm] = useState({
    brand_name: '', industry: '', description: '',
  })

  // Discovery
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})

  // Rounds
  const [round, setRound] = useState(1)
  const [roundOutput, setRoundOutput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [allOptions, setAllOptions] = useState<TaglineOption[]>([])
  const [parsedOptions, setParsedOptions] = useState<{ text: string; angle: string }[]>([])

  // Final
  const [selectedTagline, setSelectedTagline] = useState('')
  const [finalAnalysis, setFinalAnalysis] = useState('')

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generateQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tagline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discovery_questions', data: form }),
      })
      const data = await res.json()
      const qs = data.result.split('\n').filter((l: string) => l.trim()).map((l: string) => l.replace(/^\d+\.\s*/, '').trim())
      setQuestions(qs)
      setStage('discovery')
    } finally { setLoading(false) }
  }

  const generateRound = async () => {
    setLoading(true)
    try {
      const answersText = questions.map((q, i) => `${q}\n→ ${answers[i] || '(sin responder)'}`).join('\n\n')
      const previousText = allOptions.length > 0
        ? allOptions.map(o => `"${o.text}" — ${o.angle}`).join('\n')
        : ''

      const res = await fetch('/api/tagline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_round',
          data: { ...form, round, answers: answersText, previous_options: previousText, feedback }
        }),
      })
      const data = await res.json()
      setRoundOutput(data.result)

      // Parse options
      const lines = data.result.split('\n')
      const parsed: { text: string; angle: string }[] = []
      let current: { text: string; angle: string } | null = null
      for (const line of lines) {
        if (line.startsWith('TAGLINE:')) {
          if (current) parsed.push(current)
          current = { text: line.replace('TAGLINE:', '').trim(), angle: '' }
        } else if (line.startsWith('ÁNGULO:') && current) {
          current.angle = line.replace('ÁNGULO:', '').trim()
        }
      }
      if (current) parsed.push(current)
      setParsedOptions(parsed)
      setStage('rounds')
    } finally { setLoading(false) }
  }

  const toggleStar = (option: { text: string; angle: string }) => {
    const exists = allOptions.find(o => o.text === option.text)
    if (exists) {
      setAllOptions(prev => prev.map(o => o.text === option.text ? { ...o, starred: !o.starred } : o))
    } else {
      setAllOptions(prev => [...prev, { ...option, starred: true, round }])
    }
  }

  const isStarred = (text: string) => allOptions.find(o => o.text === text)?.starred || false

  const nextRound = () => {
    setRound(r => r + 1)
    setParsedOptions([])
    setRoundOutput('')
    generateRound()
  }

  const generateFinal = async () => {
    if (!selectedTagline) return
    setLoading(true)
    try {
      const res = await fetch('/api/tagline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'final_analysis',
          data: {
            ...form,
            tagline: selectedTagline,
            brand_essence: questions.map((q, i) => `${q}: ${answers[i] || ''}`).join('\n'),
          }
        }),
      })
      const data = await res.json()
      setFinalAnalysis(data.result)
      setStage('final')
      const angle = allOptions.find(o => o.text === selectedTagline)?.angle || ''
      await saveTagline(selectedTagline, angle, data.result)
    } finally { setLoading(false) }
  }

  const starred = allOptions.filter(o => o.starred)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7c3aed20, #ec487920)', border: '1px solid #7c3aed40', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#a78bfa" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Posicionamiento & Tagline</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Descubre el tagline de identidad de tu marca. El que hace que el cliente diga <em>"eso soy yo"</em> — como Think Different o Just Do It.
        </p>
      </div>

      <div className="card-dark" style={{ padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: 13, color: '#9494aa', whiteSpace: 'nowrap' }}>Cliente:</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ flex: 1 }}>
          <option value="">— Selecciona un cliente para guardar el tagline —</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        {[
          { id: 'setup', label: 'Marca' },
          { id: 'discovery', label: 'Descubrimiento' },
          { id: 'rounds', label: `Rondas (${round})` },
          { id: 'final', label: 'Tagline Final' },
        ].map((s, i, arr) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
              background: stage === s.id ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : '#1a1a28',
              color: stage === s.id ? 'white' : '#9494aa',
              border: `1px solid ${stage === s.id ? 'transparent' : '#1e1e30'}`,
            }}>
              {s.label}
            </div>
            {i < arr.length - 1 && <ChevronRight size={14} color="#2a2a3a" />}
          </div>
        ))}
      </div>

      {/* STAGE: SETUP */}
      {stage === 'setup' && (
        <div style={{ maxWidth: 600 }}>
          <div className="card-dark" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>¿Para qué marca?</h3>
            <p style={{ fontSize: 13, color: '#9494aa', margin: '0 0 24px' }}>
              Vamos a encontrar el tagline que captura la identidad de esta marca — no lo que vende, sino lo que representa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Nombre de la marca</label>
                <input placeholder="The Money Lab™, Carmen Victoria Pardo, North Factory..." value={form.brand_name} onChange={e => u('brand_name', e.target.value)} />
              </div>
              <div>
                <label>Industria</label>
                <input placeholder="Coaching de negocios, agencia de marketing..." value={form.industry} onChange={e => u('industry', e.target.value)} />
              </div>
              <div>
                <label>¿Qué hace y a quién ayuda?</label>
                <textarea placeholder="Describe brevemente el negocio, el cliente al que sirve y el resultado que entrega..." value={form.description} onChange={e => u('description', e.target.value)} rows={4} />
              </div>
              <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={generateQuestions} disabled={loading || !form.brand_name}>
                {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Preparando...</> : <>Comenzar el descubrimiento <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE: DISCOVERY */}
      {stage === 'discovery' && (
        <div style={{ maxWidth: 700 }}>
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Preguntas de Descubrimiento</h3>
              <p style={{ fontSize: 13, color: '#9494aa', margin: 0 }}>
                Responde desde lo más honesto. No hay respuesta correcta. De aquí nace el tagline.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {questions.map((q, i) => (
                <div key={i}>
                  <label style={{ fontSize: 14, color: '#f8f8fc', marginBottom: 8 }}>{i + 1}. {q}</label>
                  <textarea
                    placeholder="Tu respuesta honesta..."
                    value={answers[i] || ''}
                    onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                    rows={3}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn-primary"
              style={{ justifyContent: 'center', marginTop: 24 }}
              onClick={generateRound}
              disabled={loading}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generando primera ronda...</> : <><Sparkles size={14} /> Ver primera ronda de taglines</>}
            </button>
          </div>
        </div>
      )}

      {/* STAGE: ROUNDS */}
      {stage === 'rounds' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Options */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 2px' }}>Ronda {round} — Opciones</h3>
                <p style={{ fontSize: 12, color: '#9494aa', margin: 0 }}>Marca con ⭐ las que resuenan. Luego damos feedback para ir más profundo.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {parsedOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => toggleStar(opt)}
                  style={{
                    padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                    background: isStarred(opt.text) ? 'linear-gradient(135deg, #7c3aed10, #ec487910)' : '#0f0f1a',
                    border: `1px solid ${isStarred(opt.text) ? '#7c3aed40' : '#1e1e30'}`,
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: isStarred(opt.text) ? '#a78bfa' : '#f8f8fc', fontStyle: 'italic' }}>
                      "{opt.text}"
                    </div>
                    <div style={{ fontSize: 12, color: '#9494aa' }}>{opt.angle}</div>
                  </div>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    {isStarred(opt.text)
                      ? <Star size={18} color="#f59e0b" fill="#f59e0b" />
                      : <StarOff size={18} color="#2a2a3a" />
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="card-dark" style={{ padding: 20 }}>
              <label>¿Qué dirección resuena? ¿Qué falta? ¿Qué sobra?</label>
              <textarea
                placeholder="Ej: Me gustan las que hablan de construcción pero quiero algo más provocador... / La de 'Beyond the possible' va cerca pero necesita más energía..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn-primary" onClick={nextRound} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generando ronda {round + 1}...</> : <><RotateCcw size={14} /> Siguiente ronda — más profundo</>}
                </button>
              </div>
            </div>
          </div>

          {/* Starred sidebar */}
          <div>
            <div className="card-dark" style={{ padding: 20, position: 'sticky', top: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" /> Mis favoritas ({starred.length})
              </div>

              {starred.length === 0 ? (
                <p style={{ fontSize: 12, color: '#5a5a7a' }}>Haz clic en una opción para marcarla como favorita</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {starred.map(o => (
                    <div
                      key={o.text}
                      onClick={() => setSelectedTagline(o.text)}
                      style={{
                        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                        background: selectedTagline === o.text ? '#7c3aed20' : '#0a0a12',
                        border: `1px solid ${selectedTagline === o.text ? '#7c3aed50' : '#1e1e30'}`,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600, color: selectedTagline === o.text ? '#a78bfa' : '#f8f8fc', fontStyle: 'italic' }}>"{o.text}"</div>
                      <div style={{ fontSize: 10, color: '#9494aa', marginTop: 2 }}>Ronda {o.round}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTagline && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={generateFinal}
                  disabled={loading}
                >
                  {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analizando...</> : <><Check size={14} /> Este es el tagline</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE: FINAL */}
      {stage === 'final' && (
        <div>
          {/* Hero del tagline */}
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: 'linear-gradient(135deg, #7c3aed10, #ec487910)',
            border: '1px solid #7c3aed30', borderRadius: 16, marginBottom: 24
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#9494aa', marginBottom: 12, textTransform: 'uppercase' }}>
              {form.brand_name} — Tagline de Identidad
            </div>
            <div className="gradient-text" style={{ fontSize: 48, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.2 }}>
              "{selectedTagline}"
            </div>
          </div>

          {/* Analysis */}
          <div className="card-dark" style={{ padding: 28 }}>
            <AIOutputPanel output={finalAnalysis} loading={loading} title="Análisis completo del tagline" />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn-ghost" onClick={() => { setStage('rounds'); setFinalAnalysis('') }}>
              ← Explorar más opciones
            </button>
            <button className="btn-primary" onClick={() => { setStage('setup'); setRound(1); setAllOptions([]); setAnswers({}); setFeedback(''); setSelectedTagline(''); setFinalAnalysis('') }}>
              Nuevo tagline para otro cliente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
