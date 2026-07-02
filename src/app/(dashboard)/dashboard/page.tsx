import Link from 'next/link'
import {
  Users, BookOpen, Mic2, FileText, Lightbulb,
  Search, BarChart3, TrendingUp, Megaphone, ArrowRight,
  Star, Zap
} from 'lucide-react'

const modules = [
  {
    href: '/storybrand',
    icon: BookOpen,
    title: 'StoryBrand Builder',
    desc: 'Framework de 7 elementos. Genera BrandScript, One-Liner, copy de web y secuencia de emails.',
    color: '#7c3aed',
    badge: 'Core'
  },
  {
    href: '/voice',
    icon: Mic2,
    title: 'Brand Voice & Tono',
    desc: 'Define arquetipos, escala de tonos, palabras SÍ/NO. Genera guía de estilo completa.',
    color: '#0ea5e9',
    badge: 'Core'
  },
  {
    href: '/scripts',
    icon: FileText,
    title: 'Guionista Viral',
    desc: 'Guiones para Reels, TikTok, YouTube, Podcast y Ads con formatos probados.',
    color: '#f59e0b',
    badge: 'IA'
  },
  {
    href: '/offers',
    icon: Lightbulb,
    title: 'Ofertas Irresistibles',
    desc: 'Constructor de ofertas de alto valor. Stack, garantía, precio y copy de venta.',
    color: '#10b981',
    badge: 'IA'
  },
  {
    href: '/research',
    icon: Search,
    title: 'Investigador de Clientes',
    desc: 'Avatar profundo, mapa de dolor, voz del cliente, objeciones y respuestas.',
    color: '#8b5cf6',
    badge: 'IA'
  },
  {
    href: '/campaigns',
    icon: Megaphone,
    title: 'Campañas & ADS',
    desc: 'Genera campañas completas con variaciones A/B, copy por red y dirección visual.',
    color: '#ec4899',
    badge: 'IA'
  },
  {
    href: '/analytics',
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Métricas mensuales por red social. Score de salud. Comparativa histórica.',
    color: '#06b6d4',
    badge: 'Data'
  },
  {
    href: '/strategy',
    icon: TrendingUp,
    title: 'Asesor de Estrategia',
    desc: 'Evaluación mensual IA. Detecta gaps, genera plan de acción. Informe para cliente.',
    color: '#f97316',
    badge: 'IA'
  },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={20} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Bienvenida, <span className="gradient-text">Carmen</span>
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>
          BRANDCORE™ — Tu sistema de comunicación de marca con IA. 8 módulos para transformar cada cliente.
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Clientes Activos', value: '7', icon: Users, color: '#7c3aed' },
          { label: 'StoryBrands', value: '2', icon: BookOpen, color: '#0ea5e9' },
          { label: 'Guiones Creados', value: '0', icon: FileText, color: '#f59e0b' },
          { label: 'Campañas', value: '0', icon: Megaphone, color: '#ec4899' },
        ].map(stat => (
          <div key={stat.label} className="card-dark" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</span>
              <stat.icon size={16} color={stat.color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Módulos de IA</h2>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Selecciona un cliente y trabaja con cada módulo</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {modules.map(mod => (
          <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
            <div className="module-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${mod.color}20`,
                  border: `1px solid ${mod.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <mod.icon size={20} color={mod.color} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
                  padding: '3px 8px', borderRadius: 99,
                  background: `${mod.color}20`, color: mod.color,
                  border: `1px solid ${mod.color}30`
                }}>
                  {mod.badge}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: '#0b1c30' }}>
                {mod.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                {mod.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: mod.color }}>
                Abrir módulo <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick access to clients */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Clientes Recientes</h2>
          <Link href="/clients" style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>
        <div className="card-dark" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'North Factory LLC', type: 'Agencia', color: '#7c3aed' },
              { name: 'Carmen Victoria Pardo', type: 'Marca Personal', color: '#ec4899' },
              { name: 'Cliente 3', type: 'Por configurar', color: '#64748b' },
            ].map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${c.color}20`, border: `1px solid ${c.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: c.color, flexShrink: 0
                }}>
                  {c.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{c.type}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Star size={14} color="#64748b" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
