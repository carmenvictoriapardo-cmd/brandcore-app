'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Sparkles, Loader2, Link, Check, AlertCircle, Instagram, TrendingUp, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AIOutputPanel } from '@/components/modules/AIOutputPanel'

const META_APP_ID = '2093578584930362'

export default function MetaAnalysisPage() {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [clientId, setClientId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [pages, setPages] = useState<any[]>([])
  const [selectedIgId, setSelectedIgId] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [media, setMedia] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)
  const [competitors, setCompetitors] = useState('')
  const [competitorResults, setCompetitorResults] = useState<any[]>([])
  const [analysis, setAnalysis] = useState('')
  const [step, setStep] = useState<'connect' | 'select' | 'data' | 'analyze'>('connect')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  useEffect(() => {
    supabase.from('clients').select('id, name').order('created_at').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  const connectWithMeta = () => {
    const scope = 'pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,ads_read,read_insights'
    const redirectUri = encodeURIComponent(window.location.origin + '/meta/callback')
    const url = `https://www.facebook.com/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`
    window.open(url, '_blank', 'width=600,height=700')
  }

  const connectWithToken = async () => {
    if (!tokenInput.trim()) return
    setLoading(true)
    setLoadingMsg('Verificando token...')
    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_accounts', data: { access_token: tokenInput } }),
      })
      const data = await res.json()
      if (data.result?.data) {
        setAccessToken(tokenInput)
        setPages(data.result.data)
        setStep('select')
      } else {
        alert('Token inválido o sin permisos. Verifica que sea un token de larga duración con permisos de páginas.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadInstagramData = async () => {
    if (!selectedIgId) return
    setLoading(true)
    setLoadingMsg('Cargando datos de Instagram...')
    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_instagram_insights', data: { ig_id: selectedIgId, access_token: accessToken } }),
      })
      const data = await res.json()
      setProfile(data.profile)
      setMedia(data.media)
      setInsights(data.insights)
      setStep('data')
    } finally {
      setLoading(false)
    }
  }

  const searchCompetitors = async () => {
    if (!competitors.trim()) return
    setLoading(true)
    setLoadingMsg('Buscando ads de competidores...')
    try {
      const names = competitors.split(',').map(s => s.trim()).filter(Boolean)
      const results = []
      for (const name of names.slice(0, 3)) {
        const res = await fetch('/api/meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'search_competitor_ads', data: { competitor_name: name, country: 'US' } }),
        })
        const data = await res.json()
        if (data.result?.data) results.push(...data.result.data.slice(0, 3))
      }
      setCompetitorResults(results)
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async () => {
    const client = clients.find(c => c.id === clientId)
    setLoading(true)
    setLoadingMsg('La IA está analizando todo... esto toma 30-60 segundos.')
    setStep('analyze')
    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          data: {
            client_name: client?.name || 'Cliente',
            profile,
            media,
            insights,
            competitors: competitorResults,
          }
        }),
      })
      const data = await res.json()
      setAnalysis(data.result)
      // Save to Supabase
      if (clientId) {
        await supabase.from('analytics').insert([{
          client_id: clientId,
          platform: 'Instagram/Facebook',
          period_start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          followers: profile?.followers_count,
          notes: data.result,
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  const topPosts = (media?.data || [])
    .sort((a: any, b: any) => (b.like_count + b.comments_count * 3) - (a.like_count + a.comments_count * 3))
    .slice(0, 6)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #833ab420, #fd1d1d20, #fcb04520)', border: '1px solid #833ab440', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Instagram size={18} color="#e1306c" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Meta Intelligence</h1>
        </div>
        <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
          Conecta la cuenta de Instagram/Facebook de cada cliente. La IA analiza qué funciona, qué no, qué hace la competencia y qué hacer.
        </p>
      </div>

      {/* Client selector */}
      <div className="card-dark" style={{ padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: 13, color: '#9494aa', whiteSpace: 'nowrap' }}>Cliente:</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ flex: 1 }}>
          <option value="">— Selecciona un cliente —</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Step 1: Connect */}
      {step === 'connect' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Link size={16} color="#e1306c" />
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Conectar con Token de Acceso</h3>
            </div>
            <p style={{ fontSize: 13, color: '#9494aa', margin: '0 0 20px', lineHeight: 1.6 }}>
              Obtén un token de acceso de la cuenta de tu cliente desde Meta Business Suite o el Graph API Explorer.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label>Token de acceso (Page Access Token)</label>
              <textarea
                placeholder="EAAxxxxxxxxxxxxxx..."
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                rows={4}
                style={{ fontFamily: 'monospace', fontSize: 11 }}
              />
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', width: '100%' }} onClick={connectWithToken} disabled={loading || !tokenInput}>
              {loading ? <><Loader2 size={14} /> {loadingMsg}</> : <><Check size={14} /> Conectar cuenta</>}
            </button>
          </div>

          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertCircle size={16} color="#f59e0b" />
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>¿Cómo obtener el token?</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { n: 1, text: 'Ve a Meta Business Suite de tu cliente' },
                { n: 2, text: 'Configuración → Acceso a la API' },
                { n: 3, text: 'Genera un token de página con permisos: instagram_basic, instagram_manage_insights, pages_read_engagement' },
                { n: 4, text: 'Copia el token y pégalo aquí' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7c3aed20', border: '1px solid #7c3aed40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#a78bfa', flexShrink: 0 }}>
                    {s.n}
                  </div>
                  <p style={{ fontSize: 13, color: '#9494aa', margin: 0, lineHeight: 1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 12, background: '#7c3aed10', border: '1px solid #7c3aed20', borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: '#a78bfa', margin: 0 }}>
                💡 <strong>Tip:</strong> Como agencia con acceso a las cuentas de tus clientes, puedes generar tokens desde Meta Business Manager sin que el cliente tenga que hacer nada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select account */}
      {step === 'select' && (
        <div className="card-dark" style={{ padding: 28, maxWidth: 600 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>✅ Conectado — Selecciona la cuenta de Instagram</h3>
          <p style={{ fontSize: 13, color: '#9494aa', margin: '0 0 20px' }}>Encontramos {pages.length} página(s) vinculadas a este token.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {pages.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setSelectedIgId(p.instagram_business_account?.id || p.id)}
                style={{
                  padding: '14px 16px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                  background: selectedIgId === (p.instagram_business_account?.id || p.id) ? '#e1306c15' : '#0f0f1a',
                  border: `1px solid ${selectedIgId === (p.instagram_business_account?.id || p.id) ? '#e1306c50' : '#1e1e30'}`,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9494aa', marginTop: 2 }}>
                  {p.instagram_business_account ? '📱 Instagram conectado' : '📄 Solo Facebook Page'} · {p.fan_count?.toLocaleString() || 0} fans
                </div>
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ justifyContent: 'center', width: '100%' }} onClick={loadInstagramData} disabled={loading || !selectedIgId}>
            {loading ? <><Loader2 size={14} /> {loadingMsg}</> : <><Instagram size={14} /> Cargar datos de Instagram</>}
          </button>
        </div>
      )}

      {/* Step 3: Data overview */}
      {step === 'data' && profile && (
        <div>
          {/* Profile summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Seguidores', value: profile.followers_count?.toLocaleString() || '—' },
              { label: 'Siguiendo', value: profile.follows_count?.toLocaleString() || '—' },
              { label: 'Posts totales', value: profile.media_count?.toLocaleString() || '—' },
              { label: '@usuario', value: `@${profile.username || '—'}` },
            ].map(stat => (
              <div key={stat.label} className="card-dark" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#e1306c' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#9494aa', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Top posts */}
          {topPosts.length > 0 && (
            <div className="card-dark" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={15} color="#e1306c" /> Top Posts por Engagement
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {topPosts.map((post: any) => (
                  <a key={post.id} href={post.permalink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: 14, background: '#0a0a12', border: '1px solid #1e1e30', borderRadius: 10, cursor: 'pointer' }}>
                      <div style={{ fontSize: 11, color: '#9494aa', marginBottom: 6 }}>{post.media_type}</div>
                      <p style={{ fontSize: 12, color: '#d8d8f0', margin: '0 0 10px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {post.caption || '[Sin caption]'}
                      </p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 11, color: '#e1306c' }}>❤️ {post.like_count || 0}</span>
                        <span style={{ fontSize: 11, color: '#9494aa' }}>💬 {post.comments_count || 0}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Competitor research */}
          <div className="card-dark" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={15} color="#f59e0b" /> Analizar Competencia (Meta Ads Library)
            </h3>
            <p style={{ fontSize: 13, color: '#9494aa', margin: '0 0 14px' }}>
              Escribe los nombres de 1-3 competidores separados por coma. Buscaremos sus anuncios activos.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="Ej: The Money Lab, Business Coach Miami, Emprendedor Latino..."
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn-ghost" onClick={searchCompetitors} disabled={loading || !competitors}>
                {loading ? <Loader2 size={14} /> : <Search size={14} />} Buscar
              </button>
            </div>
            {competitorResults.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#10b981' }}>
                ✅ {competitorResults.length} anuncios de competidores encontrados — incluidos en el análisis
              </div>
            )}
          </div>

          {/* Run analysis */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? <><Loader2 size={16} /> {loadingMsg}</> : <><Sparkles size={16} /> Generar Análisis Estratégico Completo con IA</>}
          </button>
        </div>
      )}

      {/* Step 4: Analysis result */}
      {step === 'analyze' && (
        <div>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 60, gap: 16 }}>
              <Loader2 size={32} color="#e1306c" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#9494aa', fontSize: 14 }}>{loadingMsg}</p>
            </div>
          )}
          {analysis && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Seguidores', value: profile?.followers_count?.toLocaleString() || '—' },
                  { label: 'Posts analizados', value: media?.data?.length || '—' },
                  { label: 'Ads competencia', value: competitorResults.length },
                  { label: 'Cuenta', value: `@${profile?.username || '—'}` },
                ].map(stat => (
                  <div key={stat.label} className="card-dark" style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#e1306c' }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: '#9494aa', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="card-dark" style={{ padding: 24 }}>
                <AIOutputPanel output={analysis} loading={false} title={`Análisis Meta — ${clients.find(c => c.id === clientId)?.name || 'Cliente'}`} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn-ghost" onClick={() => { setStep('data'); setAnalysis('') }}>
                  ← Volver a los datos
                </button>
                <button className="btn-primary" onClick={() => { setStep('connect'); setProfile(null); setMedia(null); setAnalysis(''); setAccessToken(''); setTokenInput('') }}>
                  Analizar otro cliente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
