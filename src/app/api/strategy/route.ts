import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres el estratega de comunicación de marca más experimentado del mundo hispano.
Combinas análisis de datos, psicología del consumidor, StoryBrand y las mejores prácticas de las agencias top mundiales.
Tu análisis es honesto, específico y accionable. No das recomendaciones genéricas — das planes concretos con fechas y métricas.
Escribes en español con autoridad y claridad.`

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const prompt = `Genera el Informe de Estrategia Mensual completo.

CLIENTE: ${data.brand_name}
PERÍODO: ${data.period}
INDUSTRIA: ${data.industry}

MÉTRICAS DEL MES:
${data.metrics_summary}

CONTEXTO DE LA MARCA:
- StoryBrand definido: ${data.has_storybrand ? 'Sí' : 'No/Pendiente'}
- Brand Voice definida: ${data.has_voice ? 'Sí' : 'No/Pendiente'}
- Objetivo principal: ${data.main_objective}
- Desafíos actuales: ${data.challenges}

HISTORIAL (mes anterior):
${data.previous_month || 'Sin datos del mes anterior'}

GENERA EL INFORME ESTRATÉGICO COMPLETO:

# INFORME DE ESTRATEGIA — ${data.brand_name}
## ${data.period}

---

## 📊 DIAGNÓSTICO EJECUTIVO

### Score de Salud de Marca: [X/100]
[Justificación en 2-3 líneas]

### Semáforo de Áreas:
- 🟢 Comunicación y Mensaje:
- 🟡 Crecimiento de Audiencia:
- 🔴 Conversión:
- [otras áreas relevantes]

---

## 💪 QUÉ ESTÁ FUNCIONANDO (mantener y amplificar)
[3-5 puntos específicos con datos]

## ⚠️ BRECHAS DETECTADAS (gaps críticos)
[3-5 problemas concretos, con impacto estimado]

## 🚫 LO QUE DEBE PARAR AHORA
[1-3 cosas que se están haciendo y están drenando recursos sin retorno]

---

## 🗺️ PLAN DE ACCIÓN — PRÓXIMOS 30 DÍAS

### SEMANA 1 — PRIORIDAD ALTA:
| Acción | Responsable | Métrica de éxito | Fecha límite |
|--------|-------------|------------------|--------------|
| [acción específica] | | | |

### SEMANA 2:
[mismo formato]

### SEMANA 3-4:
[mismo formato]

---

## 📱 RECOMENDACIONES POR RED SOCIAL

Para cada red activa del cliente:
**[Red]:**
- Frecuencia recomendada: X posts/semana
- Tipos de contenido que funcionan:
- Tipos que no funcionan:
- Ajuste de tono necesario:

---

## 🎯 AJUSTES DE COMUNICACIÓN

### ¿El mensaje está alineado con el StoryBrand? [Sí/Parcial/No]
[Análisis y correcciones específicas]

### ¿La voz de marca es consistente? [Sí/Parcial/No]
[Análisis y correcciones específicas]

---

## 📈 OBJETIVOS PARA EL MES QUE VIENE

| KPI | Actual | Meta Próximo Mes | Estrategia |
|-----|--------|------------------|------------|
| [métrica] | | | |

---

## 💬 RESUMEN PARA PRESENTAR AL CLIENTE
[Párrafo de 100 palabras para compartir con el cliente — positivo pero honesto]`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 4000)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando informe' }, { status: 500 })
  }
}
