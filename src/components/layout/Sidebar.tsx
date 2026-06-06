'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users, BookOpen, Mic2, FileText, Lightbulb,
  Search, BarChart3, TrendingUp, Megaphone, LayoutDashboard,
  Zap, Flame
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { divider: true, label: 'Módulos de IA' },
  { href: '/tagline', label: 'Posicionamiento & Tagline', icon: Flame },
  { href: '/storybrand', label: 'StoryBrand Builder', icon: BookOpen },
  { href: '/voice', label: 'Brand Voice & Tono', icon: Mic2 },
  { href: '/scripts', label: 'Guionista Viral', icon: FileText },
  { href: '/offers', label: 'Ofertas Irresistibles', icon: Lightbulb },
  { href: '/research', label: 'Investigador de Clientes', icon: Search },
  { href: '/campaigns', label: 'Campañas & ADS', icon: Megaphone },
  { divider: true, label: 'Evaluación' },
  { href: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
  { href: '/strategy', label: 'Asesor de Estrategia', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#0a0a12',
      borderRight: '1px solid #1e1e30',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 12px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>
              BRANDCORE™
            </div>
            <div style={{ fontSize: 10, color: '#9494aa', marginTop: -2 }}>
              North Factory LLC
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item, i) => {
          if ('divider' in item && item.divider) {
            return (
              <div key={i} style={{ padding: '16px 12px 6px', fontSize: 10, fontWeight: 600, color: '#5a5a7a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid #1e1e30', marginTop: 16 }}>
        <div style={{ fontSize: 11, color: '#5a5a7a' }}>
          BRANDCORE™ v1.0<br />
          <span style={{ color: '#9494aa' }}>Sistema de Agencia</span>
        </div>
      </div>
    </aside>
  )
}
