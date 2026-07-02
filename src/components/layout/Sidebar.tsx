'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users, BookOpen, Mic2, FileText, Lightbulb,
  Search, BarChart3, TrendingUp, Megaphone, LayoutDashboard,
  Zap, Flame, GitBranch, Share2
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/ecosystem', label: 'Ecosistema de Marca', icon: GitBranch },
  { divider: true, label: 'Módulos de IA' },
  { href: '/tagline', label: 'Posicionamiento & Tagline', icon: Flame },
  { href: '/storybrand', label: 'StoryBrand Builder', icon: BookOpen },
  { href: '/voice', label: 'Brand Voice & Tono', icon: Mic2 },
  { href: '/scripts', label: 'Guionista Viral', icon: FileText },
  { href: '/offers', label: 'Ofertas Irresistibles', icon: Lightbulb },
  { href: '/research', label: 'Investigador de Clientes', icon: Search },
  { href: '/campaigns', label: 'Campañas & ADS', icon: Megaphone },
  { href: '/meta', label: 'Meta Intelligence', icon: Share2 },
  { divider: true, label: 'Evaluación' },
  { href: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
  { href: '/strategy', label: 'Asesor de Estrategia', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: 248,
      minHeight: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 12px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #630ed4, #db2777)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,14,212,0.25)',
          }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{
              fontWeight: 700, fontSize: 15,
              letterSpacing: '-0.3px',
              color: '#0b1c30',
              fontFamily: 'var(--font-poppins)',
            }}>
              BRANDCORE™
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1, fontWeight: 500 }}>
              North Factory LLC
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item, i) => {
          if ('divider' in item && item.divider) {
            return (
              <div key={i} style={{
                padding: '18px 12px 6px',
                fontSize: 10,
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-jakarta)',
              }}>
                {item.label}
              </div>
            )
          }
          if (!('href' in item) || !item.href || !item.icon) return null
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href as string}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 12px 4px',
        borderTop: '1px solid #e2e8f0',
        marginTop: 12,
      }}>
        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-jakarta)' }}>
          BRANDCORE™ v1.0 &nbsp;·&nbsp; <span style={{ color: '#630ed4', fontWeight: 600 }}>PRO</span>
        </div>
      </div>
    </aside>
  )
}
