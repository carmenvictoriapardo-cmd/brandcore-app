import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const SYSTEM = `Eres un experto en diseño de ofertas irresistibles. Combinas la metodología de Alex Hormozi ($100M Offers),
los principios de Robert Cialdini (influencia y persuasión) y el framework StoryBrand.
Sabes que una gran oferta no se vende, se compra. Tu trabajo es aumentar el valor percibido hasta que decir NO
sea una decisión irracional. Escribes en español con precisión estratégica.`

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const prompt = `Diseña una oferta irresistible completa.

DATOS:
- Marca: ${data.brand_name}
- Producto/Servicio: ${data.offer_name}
- Cliente ideal: ${data.target_avatar}
- Problema que resuelve: ${data.core_problem}
- Resultado que entrega: ${data.core_result}
- Precio objetivo: ${data.price} ${data.currency}
- Entregables actuales: ${data.deliverables || 'Por definir'}

CONSTRUYE LA OFERTA IRRESISTIBLE:

## 1. DIAGNÓSTICO DE VALOR
¿Por qué alguien diría NO ahora? Los 4 frenos principales y cómo eliminarlos.

## 2. STACK DE VALOR COMPLETO
El producto principal + todos los bonos organizados por nivel de valor:

### CORE (lo que compran):
- Nombre: [nombre atractivo, no genérico]
- Qué incluye exactamente:
- Valor percibido: $XXX
- Por qué este valor tiene sentido:

### BONO 1 (elimina el obstáculo más grande):
- Nombre:
- Qué es:
- Valor percibido: $XXX

### BONO 2 (acelera el resultado):
[mismo formato]

### BONO 3 (elimina el segundo obstáculo):
[mismo formato]

VALOR TOTAL STACKED: $XXXX
PRECIO DE INVERSIÓN: $${data.price}
RATIO VALOR/PRECIO: X:1

## 3. LA GARANTÍA PERFECTA
Diseña una garantía que elimine el riesgo percibido al 100%.
[Nombre de la garantía] + [Términos exactos] + [Por qué la ofreces con confianza]

## 4. ESCASEZ Y URGENCIA (éticas)
2-3 mecanismos de escasez/urgencia que sean REALES y justificables.

## 5. COPY DE OFERTA
### Headline de la oferta:
### Bullet points de beneficios (no características):
### Párrafo de cierre antes del botón:
### Texto del botón CTA:

## 6. PREGUNTAS FRECUENTES
Las 5 objeciones más comunes con respuestas que convierten.

## 7. PRECIO ANCLADO
Cómo presentar el precio para que parezca la decisión más inteligente.`

  try {
    const result = await generateWithClaude(SYSTEM, prompt, 3000)
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Error generando oferta' }, { status: 500 })
  }
}
