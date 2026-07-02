'use client'

import { useState } from 'react'
import { Copy, Check, Download, Sparkles } from 'lucide-react'

interface Props {
  output: string
  loading: boolean
  title?: string
}

export function AIOutputPanel({ output, loading, title = 'Resultado' }: Props) {
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTxt = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ marginBottom: 12 }}>
          <Sparkles size={24} color="#7c3aed" style={{ animation: 'pulse 2s infinite' }} />
        </div>
        <div style={{ fontSize: 14, color: '#64748b' }}>Generando con IA...</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Esto puede tomar unos segundos</div>
      </div>
    )
  }

  if (!output) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Sparkles size={24} color="#94a3b8" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 14, color: '#94a3b8' }}>Completa el formulario y genera con IA</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={downloadTxt}
            style={{ padding: '4px 10px', borderRadius: 6, background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Download size={12} /> Descargar
          </button>
          <button
            onClick={copyText}
            style={{ padding: '4px 10px', borderRadius: 6, background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
          </button>
        </div>
      </div>
      <div style={{
        background: '#f8f9ff', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: 20, fontSize: 13, lineHeight: 1.8, color: '#1e293b',
        whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: 600,
      }}>
        {output}
      </div>
    </div>
  )
}
