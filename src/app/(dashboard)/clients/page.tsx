'use client'

import { useState } from 'react'
import { Users, Plus, Building2, User, Briefcase, Package, Zap, ArrowRight, X } from 'lucide-react'

const TYPE_ICONS: Record<string, React.ElementType> = {
  agency: Zap,
  personal_brand: User,
  business: Building2,
  service: Briefcase,
  product: Package,
}

const TYPE_LABELS: Record<string, string> = {
  agency: 'Agencia',
  personal_brand: 'Marca Personal',
  business: 'Empresa',
  service: 'Servicio',
  product: 'Producto',
}

const TYPE_COLORS: Record<string, string> = {
  agency: '#7c3aed',
  personal_brand: '#ec4899',
  business: '#0ea5e9',
  service: '#10b981',
  product: '#f59e0b',
}

interface ClientData {
  id: string
  name: string
  industry: string
  type: string
  website?: string
  description?: string
}

const INITIAL_CLIENTS: ClientData[] = [
  { id: '1', name: 'North Factory LLC', industry: 'Agencia de Marketing Digital', type: 'agency', website: 'northfactory.com', description: 'Agencia de comunicación y marketing digital fundada por Carmen Victoria Pardo.' },
  { id: '2', name: 'Carmen Victoria Pardo', industry: 'Marca Personal / Coaching', type: 'personal_brand', website: 'carmenvictoriapardo.com', description: 'Empresaria, autora y estratega de negocios. Método C.R.E.A.R.™ Business.' },
  { id: '3', name: 'Cliente 3', industry: 'Por configurar', type: 'business', description: '' },
  { id: '4', name: 'Cliente 4', industry: 'Por configurar', type: 'business', description: '' },
  { id: '5', name: 'Cliente 5', industry: 'Por configurar', type: 'business', description: '' },
  { id: '6', name: 'Cliente 6', industry: 'Por configurar', type: 'business', description: '' },
  { id: '7', name: 'Cliente 7', industry: 'Por configurar', type: 'business', description: '' },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>(INITIAL_CLIENTS)
  const [showNew, setShowNew] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', industry: '', type: 'business', website: '', description: '' })

  const addClient = () => {
    if (!newClient.name) return
    setClients(c => [...c, { ...newClient, id: Date.now().toString() }])
    setNewClient({ name: '', industry: '', type: 'business', website: '', description: '' })
    setShowNew(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, background: '#7c3aed20', border: '1px solid #7c3aed40', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#7c3aed" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Clientes</h1>
            </div>
            <p style={{ color: '#9494aa', fontSize: 14, margin: 0 }}>
              Gestiona todos tus clientes. Cada uno con su propio workspace de 9 módulos.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={14} /> Nuevo Cliente
          </button>
        </div>
      </div>

      {/* New client form */}
      {showNew && (
        <div className="card-dark" style={{ padding: 24, marginBottom: 24, border: '1px solid #7c3aed40' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Nuevo Cliente</h3>
            <button onClick={() => setShowNew(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9494aa' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label>Nombre</label>
              <input placeholder="Nombre del cliente o marca" value={newClient.name} onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))} />
            </div>
            <div>
              <label>Industria</label>
              <input placeholder="Coaching, e-commerce, salud..." value={newClient.industry} onChange={e => setNewClient(n => ({ ...n, industry: e.target.value }))} />
            </div>
            <div>
              <label>Tipo</label>
              <select value={newClient.type} onChange={e => setNewClient(n => ({ ...n, type: e.target.value }))}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label>Sitio web (opcional)</label>
              <input placeholder="example.com" value={newClient.website} onChange={e => setNewClient(n => ({ ...n, website: e.target.value }))} />
            </div>
            <div>
              <label>Descripción breve</label>
              <input placeholder="Qué hace este cliente..." value={newClient.description} onChange={e => setNewClient(n => ({ ...n, description: e.target.value }))} />
            </div>
          </div>
          <button className="btn-primary" onClick={addClient}>Agregar Cliente</button>
        </div>
      )}

      {/* Clients grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {clients.map(client => {
          const Icon = TYPE_ICONS[client.type] || Building2
          const color = TYPE_COLORS[client.type] || '#7c3aed'
          return (
            <div key={client.id} className="module-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${color}20`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: 16, fontWeight: 700, color
                }}>
                  {client.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{client.name}</div>
                  <div style={{ fontSize: 11, color: '#9494aa' }}>{client.industry}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: `${color}15`, color, border: `1px solid ${color}30`
                }}>
                  {TYPE_LABELS[client.type]}
                </span>
                {client.website && (
                  <span style={{ fontSize: 10, color: '#9494aa' }}>🌐 {client.website}</span>
                )}
              </div>
              {client.description && (
                <p style={{ fontSize: 12, color: '#9494aa', margin: '0 0 14px', lineHeight: 1.5 }}>
                  {client.description}
                </p>
              )}
              <div style={{ borderTop: '1px solid #1e1e30', paddingTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['StoryBrand', 'Voz', 'Guión', 'Campaña'].map(mod => (
                  <span key={mod} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, background: '#1a1a28', color: '#9494aa', border: '1px solid #1e1e30' }}>
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#7c3aed10', border: '1px solid #7c3aed20', borderRadius: 10 }}>
        <p style={{ fontSize: 13, color: '#9494aa', margin: 0 }}>
          💡 <strong style={{ color: '#a78bfa' }}>Tip:</strong> En futuras versiones, cada tarjeta de cliente abrirá su workspace completo con el progreso de los 9 módulos guardado en Supabase. Por ahora, ve directamente a cada módulo e ingresa el nombre del cliente.
        </p>
      </div>
    </div>
  )
}
