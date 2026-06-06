import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'
import { StoryBrand } from '@/types'

const SYSTEM_PROMPT = `Eres un experto en el framework StoryBrand de Donald Miller y en copywriting persuasivo de alto nivel.
Tu especialidad es crear mensajes de marca que conectan profundamente con el cliente ideal, donde la MARCA es el GUÍA y el CLIENTE es el HÉROE.
Siempre escribes en español a menos que se indique lo contrario. Tu tono es profesional, directo y persuasivo.
Basas todo en psicología del consumidor, neurociencia del marketing y los principios probados de StoryBrand.`

export async function POST(req: NextRequest) {
  const { action, data } = await req.json()

  try {
    if (action === 'generate_one_liner') {
      const sb: Partial<StoryBrand> = data
      const prompt = `Basándote en este StoryBrand, crea el One-Liner perfecto para esta marca.
El One-Liner debe ser máximo 2 oraciones que expliquen: qué hace la marca, a quién ayuda, y cuál es el resultado.

Datos del StoryBrand:
- Héroe/Cliente ideal: ${sb.hero_name} que quiere: ${sb.hero_wants}
- Problema externo: ${sb.external_problem}
- Problema interno: ${sb.internal_problem}
- Solución/Guía: ${sb.empathy_statement}
- Resultado/Éxito: ${sb.success_vision}
- CTA directa: ${sb.direct_cta}

Genera el One-Liner. Que sea memorable, claro y que haga que el cliente ideal diga "eso es exactamente lo que necesito".
Solo devuelve el One-Liner, sin explicaciones adicionales.`

      const result = await generateWithClaude(SYSTEM_PROMPT, prompt, 200)
      return NextResponse.json({ result })
    }

    if (action === 'generate_brandscript') {
      const sb: Partial<StoryBrand> = data
      const prompt = `Escribe el BrandScript completo para esta marca.
Es una narrativa de 1 página que sigue los 7 elementos de StoryBrand.

Datos:
1. HÉROE: ${sb.hero_name} — quiere: ${sb.hero_wants}
2. PROBLEMA:
   - Villano: ${sb.villain}
   - Externo: ${sb.external_problem}
   - Interno: ${sb.internal_problem}
   - Filosófico: ${sb.philosophical_problem}
3. GUÍA:
   - Empatía: ${sb.empathy_statement}
   - Autoridad: ${sb.authority_proof}
4. PLAN:
   - Paso 1: ${sb.plan_step_1}
   - Paso 2: ${sb.plan_step_2}
   - Paso 3: ${sb.plan_step_3}
5. LLAMADA A LA ACCIÓN:
   - Directa: ${sb.direct_cta}
   - Transitional: ${sb.transitional_cta}
6. FRACASO si no actúa: ${sb.failure_stakes}
7. ÉXITO: ${sb.success_vision}

Escribe el BrandScript como una narrativa fluida, poderosa y persuasiva que podría aparecer en la página web principal.
Usa los 7 elementos pero hazlo sonar natural, no como una lista. Máximo 400 palabras.`

      const result = await generateWithClaude(SYSTEM_PROMPT, prompt, 1000)
      return NextResponse.json({ result })
    }

    if (action === 'generate_website_copy') {
      const sb: Partial<StoryBrand> = data
      const prompt = `Crea el copy completo para una página web basado en este StoryBrand.
Incluye:
1. HERO SECTION: Headline (máx 7 palabras), subheadline (1-2 oraciones), CTA button text
2. PROBLEMA: Sección que describe el dolor del cliente (3 bullets)
3. GUÍA: Por qué esta marca/persona es el guía perfecto
4. PLAN: Los 3 pasos simples
5. TESTIMONIAL PLACEHOLDER: Texto ejemplo de qué tipo de testimonio buscar
6. FAILURE: Sección "¿Qué pasa si no actúas?" — 2-3 líneas
7. SUCCESS: Visión del éxito — lo que el cliente logra
8. CIERRE + CTA: Párrafo final + botón CTA

StoryBrand datos:
- Héroe: ${sb.hero_name} — quiere: ${sb.hero_wants}
- Villano: ${sb.villain}
- Problema externo: ${sb.external_problem}
- Problema interno: ${sb.internal_problem}
- Filosófico: ${sb.philosophical_problem}
- Empatía: ${sb.empathy_statement}
- Autoridad: ${sb.authority_proof}
- Pasos: ${sb.plan_step_1} / ${sb.plan_step_2} / ${sb.plan_step_3}
- CTA directa: ${sb.direct_cta}
- Fracaso: ${sb.failure_stakes}
- Éxito: ${sb.success_vision}

Sé específico, poderoso y orientado a conversión. Usa la voz del cliente ideal.`

      const result = await generateWithClaude(SYSTEM_PROMPT, prompt, 2000)
      return NextResponse.json({ result })
    }

    if (action === 'generate_email_sequence') {
      const sb: Partial<StoryBrand> = data
      const prompt = `Crea una secuencia de 5 emails de nurturing basada en este StoryBrand.

StoryBrand:
- Héroe: ${sb.hero_name} — quiere: ${sb.hero_wants}
- Problema principal: ${sb.external_problem} / ${sb.internal_problem}
- Solución: ${sb.empathy_statement}
- Plan: ${sb.plan_step_1}, ${sb.plan_step_2}, ${sb.plan_step_3}
- CTA: ${sb.direct_cta}
- Éxito: ${sb.success_vision}

Emails:
1. BIENVENIDA: Empatía + quiénes somos (el guía) — NO vender
2. EL PROBLEMA: Nombrar el dolor profundo que el héroe siente
3. EL PLAN: Presentar los 3 pasos de forma simple
4. PRUEBA SOCIAL: Historia de transformación (placeholder real)
5. CTA DIRECTA: El momento de actuar — con urgencia y visión de éxito

Cada email: Subject line + Preheader + Cuerpo (150-200 palabras) + CTA button text.
Formato claro, separado por email.`

      const result = await generateWithClaude(SYSTEM_PROMPT, prompt, 3000)
      return NextResponse.json({ result })
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error generando contenido' }, { status: 500 })
  }
}
