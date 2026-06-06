import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres el estratega de posicionamiento de marca más agudo del mundo hispano.
Tu especialidad es encontrar el tagline que captura la IDENTIDAD de una marca — no lo que vende, sino lo que REPRESENTA en el mundo.

Conoces los grandes taglines de la historia:
- "Think Different" (Apple) — identidad del rebelde creativo
- "Just Do It" (Nike) — identidad del atleta que vive dentro de todos
- "Because You're Worth It" (L'Oreal) — identidad del merecimiento
- "Impossible is Nothing" (Adidas) — identidad del que rompe límites

Un tagline legendario:
1. No describe el producto
2. Activa una identidad — el cliente lo lee y piensa "eso soy yo" o "eso quiero ser"
3. Es universal dentro de su audiencia
4. Incomoda un poco a quien NO es el cliente ideal
5. Es corto, memorable, inevitable

Tu proceso es conversacional y en rondas. En cada ronda propones 6-8 opciones desde ángulos diferentes.
Escuchas el feedback y vas más profundo. Nunca te conformas con lo obvio.
Escribes en español e inglés según lo que pida la marca.`

export async function POST(req: NextRequest) {
  const { action, data } = await req.json()

  try {
    if (action === 'discovery_questions') {
      const prompt = `La marca es: ${data.brand_name}
Industria: ${data.industry}
Descripción: ${data.description}

Basándote en esta información, genera las 6 preguntas de descubrimiento más poderosas para encontrar el tagline de identidad de esta marca.

Las preguntas deben ir de lo superficial a lo profundo:
- Qué creen sobre el mundo
- Qué les indigna de su industria
- Qué separa a sus clientes exitosos de los que no lo son
- En qué se convierte el cliente cuando los elige
- Qué verdad universal define su filosofía

Formato: Devuelve solo las preguntas numeradas, sin explicaciones. Una por línea.`

      const result = await generateWithClaude(SYSTEM, prompt, 500)
      return NextResponse.json({ result })
    }

    if (action === 'generate_round') {
      const round = data.round || 1
      const answers = data.answers || ''
      const previousOptions = data.previous_options || ''
      const feedback = data.feedback || ''

      const prompt = `MARCA: ${data.brand_name}
INDUSTRIA: ${data.industry}
DESCRIPCIÓN: ${data.description}

RESPUESTAS DE DESCUBRIMIENTO:
${answers}

${previousOptions ? `OPCIONES ANTERIORES EVALUADAS:\n${previousOptions}` : ''}
${feedback ? `FEEDBACK DEL CLIENTE:\n${feedback}` : ''}

RONDA ${round} DE TAGLINES.

${round === 1 ? 'Es la primera ronda. Explora ángulos muy diferentes.' : `Es la ronda ${round}. El cliente dio este feedback: "${feedback}". Ve MÁS PROFUNDO en la dirección que resonó. Evita repetir lo que no funcionó.`}

Genera exactamente 8 opciones de tagline desde estos ángulos:
- 2 opciones desde la IDENTIDAD del cliente (quién es o aspira ser)
- 2 opciones desde la FILOSOFÍA de la marca (qué cree sobre el mundo)
- 2 opciones desde la TRANSFORMACIÓN (qué cambia)
- 2 opciones INESPERADAS (las más arriesgadas, las que incomodan)

Para cada opción:
TAGLINE: [el tagline]
ÁNGULO: [en una línea, por qué funciona]

Recuerda: cortos, memorables, que no describan el producto.
Pueden ser en español o inglés según la energía de la marca.`

      const result = await generateWithClaude(SYSTEM, prompt, 1500)
      return NextResponse.json({ result })
    }

    if (action === 'refine') {
      const prompt = `MARCA: ${data.brand_name}
El cliente está entre estas opciones que resuenan:
${data.favorites}

Su feedback: "${data.feedback}"

Lo que sabemos de la marca:
${data.brand_essence}

Genera 8 variaciones y combinaciones de estas opciones.
Juega con:
- Versiones más cortas
- Versiones bilingües
- Versiones que combinan elementos de las favoritas
- Una versión completamente inesperada que capture la misma esencia

Mismo formato: TAGLINE + ÁNGULO`

      const result = await generateWithClaude(SYSTEM, prompt, 1200)
      return NextResponse.json({ result })
    }

    if (action === 'final_analysis') {
      const prompt = `El tagline seleccionado para ${data.brand_name} es:

"${data.tagline}"

Genera el análisis completo de este tagline:

## POR QUÉ FUNCIONA
[3 razones específicas de por qué este tagline es poderoso para esta marca]

## CÓMO USARLO
- En el nombre de la marca: [ejemplo]
- En redes sociales: [cómo aparece en el bio]
- En publicidad: [cómo se usa en ads]
- En presentaciones: [cómo lo presenta el fundador]
- Como hashtag: [versión hashtag]

## FRASES DE APOYO
3 frases secundarias que complementan el tagline principal (como hicimos con "Todo en ti" y "Aquí se ejecuta")

## LO QUE COMUNICA SIN DECIRLO
[Qué entiende el cliente ideal al leerlo — sin que esté escrito]

## A QUIÉN INCLUYE Y A QUIÉN EXCLUYE
[El tagline perfecto no es para todos — define quién se identifica y quién no]`

      const result = await generateWithClaude(SYSTEM, prompt, 1500)
      return NextResponse.json({ result })
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Error generando tagline' }, { status: 500 })
  }
}
