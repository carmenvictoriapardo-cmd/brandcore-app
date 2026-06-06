import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres un experto en performance marketing y publicidad digital de alto nivel.
Combinas el framework StoryBrand con las mejores prácticas de Meta Ads, TikTok Ads, LinkedIn Ads y Google Ads.
Creas campañas que no solo generan clicks sino que convierten porque entienden la psicología del comprador.
Conoces a fondo la metodología de Alex Hormozi para ofertas, la psicología de Eugene Schwartz para copy de ads,
y los principios de Gary Halbert para headlines. Escribes en español con poder de conversión máximo.`

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const prompt = `Crea una campaña publicitaria completa y lista para lanzar.

DATOS DE LA CAMPAÑA:
- Marca/Persona: ${data.brand_name}
- Industria: ${data.industry}
- Objetivo: ${data.objective}
- Plataformas: ${data.platforms?.join(', ')}
- Audiencia objetivo: ${data.target_audience}
- Presupuesto estimado: ${data.budget_range || 'No especificado'}
- Duración: ${data.duration_days || 30} días
- Oferta/Producto: ${data.offer}
- Tono de marca: ${data.tone_notes}
- StoryBrand (héroe quiere): ${data.hero_wants || 'No especificado'}
- Problema principal: ${data.main_problem || 'No especificado'}
- Resultado prometido: ${data.success_vision || 'No especificado'}

ENTREGA LA CAMPAÑA COMPLETA:

## 🎯 ESTRATEGIA DE CAMPAÑA
Nombre de la campaña, ángulo principal y por qué va a funcionar.

## 📊 ESTRUCTURA DE ADS (3 conjuntos)

### AD SET A — Conciencia del Problema
Objetivo: Hacer que el prospecto reconozca su dolor
- Formato: [imagen/video/carrusel]
- Headline (máx 40 chars):
- Texto principal (125 chars para móvil):
- Descripción:
- CTA button:
- Dirección visual para diseñador:
- Notas de tono:

[Variación A] Headline alternativo:
[Variación B] Texto alternativo:

### AD SET B — Presentación de Solución
Objetivo: Posicionar la marca como el guía ideal
- Formato:
- Headline:
- Texto principal:
- Descripción:
- CTA button:
- Dirección visual:
- Notas de tono:

[Variación A] Headline alternativo:
[Variación B] Texto alternativo:

### AD SET C — CONVERSIÓN DIRECTA
Objetivo: El prospecto que ya conoce la marca toma acción
- Formato:
- Headline:
- Texto principal:
- Descripción:
- CTA button:
- Dirección visual:
- Notas de tono:

[Variación A] Headline alternativo:
[Variación B] Texto alternativo:

## 📱 ADAPTACIONES POR PLATAFORMA

Para cada plataforma en ${data.platforms?.join(', ')}:
- Ajustes de copy específicos
- Formato recomendado
- Tip de segmentación
- Bid strategy

## 🔄 FLUJO DE RETARGETING (7 días)
Día 1-2: [acción]
Día 3-4: [acción]
Día 5-7: [acción]

## 📈 KPIs A MEDIR
- CTR objetivo:
- CPL objetivo:
- ROAS objetivo:
- Qué métricas revisar en qué día

## ✅ CHECKLIST DE LANZAMIENTO
Lista de verificación antes de activar la campaña.`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 4000)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando campaña' }, { status: 500 })
  }
}
