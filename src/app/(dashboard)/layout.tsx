import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff' }}>
      <Sidebar />
      <main style={{
        marginLeft: 248,
        flex: 1,
        padding: '36px 40px',
        minHeight: '100vh',
        maxWidth: 'calc(100vw - 248px)',
      }}>
        {children}
      </main>
    </div>
  )
}
