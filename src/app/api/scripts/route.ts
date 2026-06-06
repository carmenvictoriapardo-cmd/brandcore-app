import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres el mejor guionista de contenido viral de habla hispana.
Tu especialidad es crear guiones que detienen el scroll, generan conversación y convierten espectadores en clientes.
Conoces los patrones virales de TikTok, Instagram Reels y YouTube. Entiendes neurociencia del entretenimiento,
storytelling de alta conversión y los ganchos psicológicos que obligan a seguir viendo.
Escribes en español con un ritmo natural, conversacional y magnético.
Cada guión que creas tiene un hook irresistible, un cuerpo que engancha y un CTA que convierte.`

const FORMATS: Record<string, string> = {
  hook_story_cta: 'Hook (3 seg) → Historia/Problema → Solución → CTA',
  problem_agitation_solution: 'Problema → Agitación (por qué duele más de lo que creen) → Solución',
  before_after: 'Situación anterior → El punto de quiebre → Transformación → Tu papel',
  storytelling: 'Historia personal/de cliente → Lección → Aplicación → CTA',
  educational: 'Promesa de valor → 3-5 puntos clave → Recapitulación → CTA',
  testimonial: 'Hook de resultado → Historia del cliente → Proceso → Resultado + CTA',
}

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const durationNote = data.duration_seconds
    ? `Duración objetivo: ${data.duration_seconds} segundos (aprox ${Math.round(data.duration_seconds * 2.5)} palabras)`
    : 'Duración: 30-60 segundos'

  const prompt = `Crea un guión viral completo para ${data.platform}.

DATOS:
- Marca/Persona: ${data.brand_name}
- Industria/Nicho: ${data.industry}
- Tema del guión: ${data.topic}
- Formato: ${data.format} → ${FORMATS[data.format] || data.format}
- ${durationNote}
- Voz/Tono de la marca: ${data.tone_notes || 'Natural, auténtico, empático'}
- Audiencia objetivo: ${data.target_audience || 'Emprendedores y profesionales'}

INSTRUCCIONES ESPECIALES:
${data.special_instructions || 'Ninguna'}

ENTREGA EL GUIÓN EN ESTE FORMATO:

🎯 GANCHO (primeros 3 segundos):
[El texto exacto que abre el video — debe detener el scroll INMEDIATAMENTE]

📱 TEXTO EN PANTALLA (gancho visual):
[El texto que aparece en el video como overlay — máx 7 palabras impactantes]

🎬 GUIÓN COMPLETO:
[El guión hablado, línea por línea, con [PAUSA] y [ÉNFASIS] donde corresponda]

🎵 DIRECCIÓN DE PRODUCCIÓN:
- Ritmo: [rápido/medio/lento]
- Mood: [energético/íntimo/educativo/inspiracional]
- Tipo de toma: [selfie/b-roll/texto/mixto]
- Música sugerida: [mood de la música]

📌 CALL TO ACTION:
[La CTA exacta al final — específica y con urgencia]

🔁 VARIACIÓN A/B:
[Un gancho alternativo diferente para probar]

#️⃣ HASHTAGS SUGERIDOS:
[10-15 hashtags relevantes para ${data.platform}]

IMPORTANTE: El guión debe sentirse HUMANO, no robótico. Que suene como alguien que habla con pasión, no como un comercial.`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 2500)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando guión' }, { status: 500 })
  }
}
