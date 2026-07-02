'use client'

import { useState } from 'react'
import { Plus, ChevronRight, Zap, BookOpen, Mic2, FileText, Lightbulb, Search, Megaphone, Flame, BarChart3, TrendingUp, X, ArrowRight, Link2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

type BranchType = 'program' | 'product' | 'brand' | 'agency' | 'book' | 'podcast' | 'other'

interface Branch {
  id: string
  name: string
  type: BranchType
  tagline?: string
  description?: string
  color: string
  modules: ModuleStatus[]
  coherenceScore?: number
}

interface ModuleStatus {
  id: string
  label: string
  status: 'done' | 'partial' | 'pending'
  href: string
}

const TYPE_CONFIG: Record<BranchType, { label: string; color: string; emoji: string }> = {
  program:  { label: 'Programa',      color: '#7c3aed', emoji: '🎓' },
  product:  { label: 'Producto/Ropa', color: '#ec4899', emoji: '👗' },
  brand:    { label: 'Marca',         color: '#0ea5e9', emoji: '✨' },
  agency:   { label: 'Agencia',       color: '#f59e0b', emoji: '🏢' },
  book:     { label: 'Libro',         color: '#10b981', emoji: '📚' },
  podcast:  { label: 'Podcast',       color: '#f97316', emoji: '🎙️' },
  other:    { label: 'Otro',          color: '#64748b', emoji: '💡' },
}

const DEFAULT_MODULES = (name: string): ModuleStatus[] => [
  { id: 'tagline',    label: 'Tagline',         status: 'pending', href: `/tagline` },
  { id: 'storybrand', label: 'StoryBrand',       status: 'pending', href: `/storybrand` },
  { id: 'voice',      label: 'Brand Voice',      status: 'pending', href: `/voice` },
  { id: 'offers',     label: 'Oferta',           status: 'pending', href: `/offers` },
  { id: 'research',   label: 'Audiencia',        status: 'pending', href: `/research` },
  { id: 'scripts',    label: 'Guiones',          status: 'pending', href: `/scripts` },
  { id: 'campaigns',  label: 'Campañas',         status: 'pending', href: `/campaigns` },
]

const INITIAL_ROOT = {
  name: 'Carmen Victoria Pardo',
  tagline: 'Beyond the possible.',
  description: 'Empresaria, autora y estratega. Marca raíz del ecosistema.',
  color: '#a78bfa',
}

const INITIAL_BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'The Money Lab™',
    type: 'program',
    tagline: 'Beyond the possible.',
    description: 'Acompañamiento total 3 meses. High ticket. MVP + facturación garantizada.',
    color: '#7c3aed',
    coherenceScore: 92,
    modules: DEFAULT_MODULES('The Money Lab™').map(m =>
      m.id === 'tagline' ? { ...m, status: 'partial' } : m
    ),
  },
  {
    id: '2',
    name: 'The Reminder',
    type: 'product',
    description: 'Línea de ropa. Por lanzar. Identidad y StoryBrand pendientes.',
    color: '#ec4899',
    coherenceScore: undefined,
    modules: DEFAULT_MODULES('The Reminder'),
  },
  {
    id: '3',
    name: 'North Factory LLC',
    type: 'agency',
    description: 'Agencia de comunicación y marketing digital. 7 clientes activos.',
    color: '#f59e0b',
    coherenceScore: 78,
    modules: DEFAULT_MODULES('North Factory LLC').map(m =>
      ['storybrand', 'voice'].includes(m.id) ? { ...m, status: 'partial' } : m
    ),
  },
  {
    id: '4',
    name: 'Sin Plan B',
    type: 'podcast',
    description: 'Podcast en Apple Podcasts y Spotify. Estrategia de contenido activa.',
    color: '#f97316',
    coherenceScore: 85,
    modules: DEFAULT_MODULES('Sin Plan B').map(m =>
      ['voice', 'research'].includes(m.id) ? { ...m, status: 'partial' } : m
    ),
  },
  {
    id: '5',
    name: 'Atrévete Sin Excusas',
    type: 'book',
    description: 'Libro publicado. Amazon Bestseller en lanzamiento.',
    color: '#10b981',
    coherenceScore: 88,
    modules: DEFAULT_MODULES('Atrévete Sin Excusas').map(m =>
      ['voice', 'research', 'storybrand'].includes(m.id) ? { ...m, status: 'partial' } : m
    ),
  },
]

export default function EcosystemPage() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [selected, setSelected] = useState<Branch | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newBranch, setNewBranch] = useState({ name: '', type: 'program' as BranchType, description: '' })

  const addBranch = () => {
    if (!newBranch.name) return
    const cfg = TYPE_CONFIG[newBranch.type]
    setBranches(b => [...b, {
      id: Date.now().toString(),
      name: newBranch.name,
      type: newBranch.type,
      description: newBranch.description,
      color: cfg.color,
      modules: DEFAULT_MODULES(newBranch.name),
    }])
    setNewBranch({ name: '', type: 'program', description: '' })
    setShowAdd(false)
  }

  const doneCount = (b: Branch) => b.modules.filter(m => m.status === 'done').length
  const partialCount = (b: Branch) => b.modules.filter(m => m.status === 'partial').length
  const progress = (b: Branch) => Math.round(((doneCount(b) + partialCount(b) * 0.5) / b.modules.length) * 100)

  const StatusIcon = ({ status }: { status: 'done' | 'partial' | 'pending' }) => {
    if (status === 'done') return <CheckCircle size={12} color="#10b981" />
    if (status === 'partial') return <Clock size={12} color="#f59e0b" />
    return <AlertCircle size={12} color="#2a2a3a" />
  }

  const CoherenceBadge = ({ score }: { score?: number }) => {
    if (score === undefined) return (
      <span style={{ fontSize: 10, color: '#64748b', padding: '2px 8px', borderRadius: 99, background: '#eff4ff', border: '1px solid #e2e8f0' }}>
        Sin evaluar
      </span>
    )
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f87171'
    return (
      <span style={{ fontSize: 10, fontWeight: 700, color, padding: '2px 8px', borderRadius: 99, background: `${color}15`, border: `1px solid ${color}30` }}>
        {score}% coherencia
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7c3aed20, #ec487920)', border: '1px solid #7c3aed30', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link2 size={18} color="#a78bfa" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ecosistema de Marca</h1>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Todas tus marcas y sub-marcas en un solo mapa. La raíz alimenta cada rama.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Nueva rama
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 24 }}>
        {/* Main map */}
        <div>
          {/* ROOT NODE */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed15, #ec487915)',
            border: '2px solid #7c3aed40',
            borderRadius: 16, padding: 24, marginBottom: 32, position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0
              }}>✨</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{INITIAL_ROOT.name}</h2>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#7c3aed20', color: '#a78bfa', border: '1px solid #7c3aed30', fontWeight: 600 }}>MARCA RAÍZ</span>
                </div>
                {INITIAL_ROOT.tagline && (
                  <div style={{ fontSize: 16, fontStyle: 'italic', color: '#a78bfa', marginTop: 2 }}>"{INITIAL_ROOT.tagline}"</div>
                )}
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{INITIAL_ROOT.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href="/tagline" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                    <Flame size={12} /> Tagline
                  </button>
                </Link>
                <Link href="/storybrand" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                    <BookOpen size={12} /> StoryBrand
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Connection line */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ width: 2, height: 24, background: 'linear-gradient(to bottom, #7c3aed50, #e2e8f0)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ height: 2, background: 'linear-gradient(to right, #e2e8f0, #7c3aed50, #e2e8f0)', width: `${Math.min(branches.length * 180, 800)}px` }} />
          </div>

          {/* BRANCH NODES */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(branches.length + 1, 4)}, 1fr)`, gap: 16 }}>
            {branches.map(branch => {
              const cfg = TYPE_CONFIG[branch.type]
              const pct = progress(branch)
              const isSelected = selected?.id === branch.id

              return (
                <div
                  key={branch.id}
                  onClick={() => setSelected(isSelected ? null : branch)}
                  style={{
                    background: isSelected ? `${branch.color}15` : '#ffffff',
                    border: `2px solid ${isSelected ? branch.color + '60' : '#e2e8f0'}`,
                    borderRadius: 14, padding: 20, cursor: 'pointer',
                    transition: 'all 0.2s', position: 'relative'
                  }}
                >
                  {/* Top connector */}
                  <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 2, height: 16, background: `${branch.color}40` }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${branch.color}20`, border: `1px solid ${branch.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18
                    }}>
                      {cfg.emoji}
                    </div>
                    <CoherenceBadge score={branch.coherenceScore} />
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, color: '#0b1c30' }}>{branch.name}</div>
                  {branch.tagline && (
                    <div style={{ fontSize: 11, fontStyle: 'italic', color: branch.color, marginBottom: 4 }}>"{branch.tagline}"</div>
                  )}
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, lineHeight: 1.4 }}>{branch.description}</div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: '#64748b' }}>Módulos completados</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: branch.color }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                      <div style={{ height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${branch.color}, ${branch.color}80)`, width: `${pct}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: branch.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Ver módulos <ArrowRight size={10} />
                  </div>
                </div>
              )
            })}

            {/* Add branch card */}
            <div
              onClick={() => setShowAdd(true)}
              style={{
                background: 'transparent', border: '2px dashed #e2e8f0',
                borderRadius: 14, padding: 20, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, minHeight: 160, transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 2, height: 16, background: '#e2e8f0' }} />
              <Plus size={20} color="#2a2a3a" />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Nueva rama</span>
            </div>
          </div>

          {/* Coherence legend */}
          <div style={{ marginTop: 32, padding: 16, background: '#f8f9ff', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Score de coherencia:</div>
            {[
              { color: '#10b981', label: '80-100% — Alineada con la raíz' },
              { color: '#f59e0b', label: '60-79% — Ajustes recomendados' },
              { color: '#f87171', label: '0-59% — Desconexión crítica' },
              { color: '#64748b', label: 'Sin evaluar — Módulos pendientes' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ position: 'sticky', top: 20 }}>
            <div className="card-dark" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{TYPE_CONFIG[selected.type].emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: TYPE_CONFIG[selected.type].color }}>{TYPE_CONFIG[selected.type].label}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>

              {selected.tagline && (
                <div style={{ padding: '10px 14px', background: `${selected.color}10`, border: `1px solid ${selected.color}20`, borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Tagline</div>
                  <div style={{ fontSize: 14, fontStyle: 'italic', color: selected.color }}>"{selected.tagline}"</div>
                </div>
              )}

              <CoherenceBadge score={selected.coherenceScore} />

              <div style={{ margin: '20px 0 12px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>MÓDULOS</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.modules.map(mod => (
                  <Link key={mod.id} href={mod.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 8,
                      background: mod.status === 'done' ? '#10b98110' : mod.status === 'partial' ? '#f59e0b10' : '#f8f9ff',
                      border: `1px solid ${mod.status === 'done' ? '#10b98125' : mod.status === 'partial' ? '#f59e0b25' : '#e2e8f0'}`,
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StatusIcon status={mod.status} />
                        <span style={{ fontSize: 13, color: mod.status === 'pending' ? '#64748b' : '#0b1c30' }}>{mod.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, color: mod.status === 'done' ? '#10b981' : mod.status === 'partial' ? '#f59e0b' : '#94a3b8' }}>
                          {mod.status === 'done' ? 'Completo' : mod.status === 'partial' ? 'En progreso' : 'Pendiente'}
                        </span>
                        <ArrowRight size={10} color="#94a3b8" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {selected.coherenceScore === undefined && (
                <div style={{ marginTop: 16, padding: 12, background: '#7c3aed10', border: '1px solid #7c3aed20', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: '#a78bfa' }}>
                    Completa el StoryBrand y la Brand Voice para calcular la coherencia con la marca raíz.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add branch modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card-dark" style={{ padding: 32, width: 480, borderColor: '#7c3aed40' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Nueva rama del ecosistema</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label>Nombre</label>
                <input placeholder="Atrévete Sin Excusas, The Reminder, Mastermind Elite..." value={newBranch.name} onChange={e => setNewBranch(b => ({ ...b, name: e.target.value }))} autoFocus />
              </div>

              <div>
                <label>Tipo</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                  {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                    <button
                      key={type}
                      onClick={() => setNewBranch(b => ({ ...b, type: type as BranchType }))}
                      style={{
                        padding: '10px 8px', borderRadius: 8, textAlign: 'center',
                        background: newBranch.type === type ? `${cfg.color}20` : 'transparent',
                        border: `1px solid ${newBranch.type === type ? cfg.color + '50' : '#e2e8f0'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{cfg.emoji}</div>
                      <div style={{ fontSize: 11, color: newBranch.type === type ? cfg.color : '#64748b', fontWeight: 500 }}>{cfg.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Descripción breve</label>
                <textarea placeholder="Qué es esta rama, a quién sirve..." value={newBranch.description} onChange={e => setNewBranch(b => ({ ...b, description: e.target.value }))} rows={3} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={addBranch} disabled={!newBranch.name}>
                  <Plus size={14} /> Agregar al ecosistema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
