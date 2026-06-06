import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres un investigador experto en psicología del consumidor, comportamiento del comprador y análisis de audiencias.
Combinas metodologías de Jobs-to-be-Done, Voice of Customer Research, Customer Avatar Canvas y psicografía avanzada.
Tu análisis de audiencias es tan profundo que permite crear mensajes que hacen que el cliente ideal sienta "esto fue escrito para mí".
Escribes en español con precisión científica y aplicación práctica.`

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const prompt = `Crea el perfil de audiencia más completo posible para esta marca.

DATOS:
- Marca/Producto: ${data.brand_name}
- Industria: ${data.industry}
- Descripción del negocio: ${data.description}
- Datos demográficos base: ${data.demographics || 'Por investigar'}
- Mercado objetivo: ${data.market || 'Latinoamérica'}

GENERA EL PERFIL DE AUDIENCIA COMPLETO:

## 1. AVATAR PRINCIPAL — "${data.avatar_name || 'Cliente Ideal'}"

### DATOS DEMOGRÁFICOS PROFUNDOS
- Edad exacta (no rango):
- Género predominante:
- Ubicación principal:
- Nivel de ingresos:
- Educación:
- Ocupación:
- Estado civil/familiar:

### PSICOGRAFÍA — LO QUE NO SE VE EN NINGÚN FORMULARIO

**Valores centrales** (qué le importa en la vida):

**Identidad** (cómo se ve a sí mismo):

**Aspiraciones** (en qué persona quiere convertirse):

**Miedos profundos** (lo que le quita el sueño a las 3am):

**Frustraciones** (lo que le molesta a diario relacionado con tu nicho):

**Deseos** (resultados tangibles que quiere):

## 2. MAPA DE DOLOR — LOS 3 NIVELES

### Dolor EXTERNO (observable):

### Dolor INTERNO (cómo se siente por eso):

### Dolor FILOSÓFICO (qué cree que está mal en el mundo):

## 3. VOZ DEL CLIENTE — FRASES EXACTAS
Escribe las frases que TU CLIENTE IDEAL diría exactamente. Estas son las frases que deben aparecer en el copy.

Cuando describe su problema:
- "..."
- "..."
- "..."

Cuando describe lo que quiere:
- "..."
- "..."
- "..."

Cuando justifica la compra:
- "..."

Cuando da excusas para no comprar:
- "..."
- "..."

## 4. COMPORTAMIENTO DIGITAL

**Plataformas que usa y cómo:**
**Tipo de contenido que consume:**
**Influencers/referentes que sigue:**
**Palabras clave que googlea:**
**Horas de mayor actividad:**

## 5. OBJECIONES DE COMPRA — CON RESPUESTAS

Para cada objeción: [Objeción exacta] → [Respuesta que convierte] → [Emoción que activa]

Objeción 1 (precio):
Objeción 2 (tiempo):
Objeción 3 (confianza):
Objeción 4 (resultados):
Objeción 5 (urgencia/ahora):

## 6. EL MOMENTO DE COMPRA
¿Qué situación específica lo empuja a buscar una solución? ¿Cuál es el "evento gatillo"?

## 7. MENSAJES QUE CONECTAN vs. MENSAJES QUE DESCONECTAN

✅ Di esto:
❌ Nunca digas esto:`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 3500)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando investigación' }, { status: 500 })
  }
}
