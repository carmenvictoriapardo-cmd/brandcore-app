import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres un experto en branding, psicología de marca y comunicación estratégica.
Tienes profundo conocimiento de los 12 arquetipos de marca de Carl Jung aplicados al marketing,
y de cómo la voz de una marca crea conexión emocional con su audiencia ideal.
Siempre escribes en español. Eres preciso, estratégico y práctico.`

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const toneDesc = (value: number, low: string, high: string) =>
    value <= 3 ? `Muy ${low}` : value <= 6 ? 'Neutro/balanceado' : `Muy ${high}`

  const prompt = `Crea una Guía de Voz de Marca completa y profesional basada en estos parámetros:

MARCA: ${data.brand_name || 'La marca'}
INDUSTRIA: ${data.industry || 'No especificada'}
ARQUETIPO: ${data.archetype}
PERSONALIDAD: ${data.brand_personality}
ESTILO DE COMUNICACIÓN: ${data.communication_style}

ESCALAS DE TONO:
- Formalidad: ${data.tone_formal}/10 (${toneDesc(data.tone_formal, 'casual', 'formal')})
- Humor: ${data.tone_humor}/10 (${toneDesc(data.tone_humor, 'serio', 'divertido/ligero')})
- Atrevimiento: ${data.tone_bold}/10 (${toneDesc(data.tone_bold, 'suave/diplomático', 'directo/audaz')})
- Inspiracional: ${data.tone_inspirational}/10 (${toneDesc(data.tone_inspirational, 'neutro/informativo', 'muy inspirador/motivacional')})

PALABRAS SÍ: ${data.yes_words?.join(', ')}
PALABRAS NO: ${data.no_words?.join(', ')}

Genera la Guía de Voz completa con estas secciones:

## 1. ESENCIA DE LA VOZ
Un párrafo que captura el espíritu de la comunicación de esta marca.

## 2. ARQUETIPO EN ACCIÓN
Cómo se manifiesta el arquetipo ${data.archetype} en cada tipo de comunicación.

## 3. ESCALAS DE TONO (con ejemplos)
Para cada escala, muestra con un ejemplo concreto cómo suena la marca:
- En redes sociales
- En emails
- En publicidad

## 4. PALABRAS Y FRASES DE MARCA
Vocabulario clave: las 10 frases que SÍ usa esta marca + las 10 que NUNCA usa.

## 5. EJEMPLOS DE VOZ POR PLATAFORMA
Escribe un ejemplo real (2-3 líneas) de cómo sonaría esta marca en:
- Instagram caption
- Email subject line + preview
- CTA de botón
- Bio de red social (150 palabras)
- Respuesta a comentario negativo

## 6. LO QUE NOS DIFERENCIA EN COMUNICACIÓN
3 elementos únicos de la voz que nadie más tiene en este nicho.

Sé específico, usa ejemplos reales, no genéricos.`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 3000)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando guía de voz' }, { status: 500 })
  }
}
