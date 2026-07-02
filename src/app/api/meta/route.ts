import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/anthropic'

const META_BASE = 'https://graph.facebook.com/v19.0'

async function metaGet(path: string, token: string, params: Record<string, string> = {}) {
  const url = new URL(`${META_BASE}${path}`)
  url.searchParams.set('access_token', token)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  return res.json()
}

export async function POST(req: NextRequest) {
  const { action, data } = await req.json()

  try {
    // ── 1. Verify token and get pages ──────────────────────────────────────
    if (action === 'get_accounts') {
      const result = await metaGet('/me/accounts', data.access_token, {
        fields: 'id,name,instagram_business_account,access_token,fan_count,followers_count'
      })
      return NextResponse.json({ result })
    }

    // ── 2. Get Instagram insights for a business account ───────────────────
    if (action === 'get_instagram_insights') {
      const { ig_id, access_token } = data
      const [profile, media, insights] = await Promise.all([
        metaGet(`/${ig_id}`, access_token, {
          fields: 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website'
        }),
        metaGet(`/${ig_id}/media`, access_token, {
          fields: 'id,caption,media_type,timestamp,like_count,comments_count,thumbnail_url,media_url,permalink',
          limit: '20'
        }),
        metaGet(`/${ig_id}/insights`, access_token, {
          metric: 'reach,impressions,profile_views,follower_count',
          period: 'month',
        }),
      ])
      return NextResponse.json({ profile, media, insights })
    }

    // ── 3. Search competitor ads (Meta Ads Library — public) ───────────────
    if (action === 'search_competitor_ads') {
      const { competitor_name, country } = data
      const url = new URL(`${META_BASE}/ads_archive`)
      url.searchParams.set('access_token', process.env.META_APP_ID + '|' + process.env.META_APP_SECRET)
      url.searchParams.set('search_terms', competitor_name)
      url.searchParams.set('ad_reached_countries', country || 'US')
      url.searchParams.set('ad_active_status', 'ALL')
      url.searchParams.set('fields', 'id,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,page_name,currency,spend,impressions,ad_snapshot_url')
      url.searchParams.set('limit', '10')
      const res = await fetch(url.toString())
      const result = await res.json()
      return NextResponse.json({ result })
    }

    // ── 4. AI analysis of all data ─────────────────────────────────────────
    if (action === 'analyze') {
      const { client_name, profile, media, insights, competitors } = data

      const topPosts = (media?.data || [])
        .sort((a: any, b: any) => (b.like_count + b.comments_count * 3) - (a.like_count + a.comments_count * 3))
        .slice(0, 5)
        .map((p: any) => `- "${p.caption?.slice(0, 120) || '[sin caption]'}" | ❤️ ${p.like_count || 0} | 💬 ${p.comments_count || 0} | Tipo: ${p.media_type}`)
        .join('\n')

      const competitorText = competitors?.map((c: any) =>
        `Competidor: ${c.page_name}\nAnuncio: ${c.ad_creative_bodies?.[0]?.slice(0, 200) || 'Sin texto'}`
      ).join('\n\n') || 'No se analizaron competidores'

      const prompt = `Analiza la presencia en Meta (Instagram/Facebook) de la marca: ${client_name}

PERFIL INSTAGRAM:
- Seguidores: ${profile?.followers_count || 'N/A'}
- Siguiendo: ${profile?.follows_count || 'N/A'}
- Posts totales: ${profile?.media_count || 'N/A'}
- Bio: ${profile?.biography || 'N/A'}

TOP 5 POSTS CON MÁS ENGAGEMENT:
${topPosts || 'Sin datos de posts'}

INSIGHTS DEL MES:
${JSON.stringify(insights?.data || [], null, 2)}

ANÁLISIS DE COMPETENCIA (Meta Ads Library):
${competitorText}

Genera un análisis estratégico completo con este formato exacto:

## 🎯 DIAGNÓSTICO RÁPIDO
[3 puntos clave sobre el estado actual de la cuenta]

## ✅ LO QUE ESTÁ FUNCIONANDO
[Qué tipos de contenido, formatos o temas generan más engagement. Con datos concretos.]

## ❌ LO QUE NO ESTÁ FUNCIONANDO
[Qué patrones tienen bajo rendimiento y por qué]

## 🕵️ INTELIGENCIA DE COMPETENCIA
[Qué están haciendo los competidores, qué ángulos usan en sus ads, qué podemos aprender]

## 💡 5 OPORTUNIDADES INMEDIATAS
[5 acciones concretas que puedes ejecutar ESTA SEMANA para mejorar resultados]

## 📋 PLAN DE CONTENIDO — PRÓXIMOS 30 DÍAS
[Calendario sugerido: frecuencia, formatos, temas, CTAs recomendados]

## 🚀 ESTRATEGIA DE ADS RECOMENDADA
[Qué tipo de campaña lanzar, audiencia objetivo, presupuesto sugerido, ángulo creativo]

Sé específico, usa los datos reales, habla directamente de ${client_name}.`

      const result = await generateWithClaude(
        'Eres el estratega de marketing digital más agudo del mundo hispano. Analizas datos de Meta y generas insights accionables que transforman marcas. Hablas directo, con datos concretos, sin rodeos.',
        prompt,
        3000
      )
      return NextResponse.json({ result })
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
  } catch (error) {
    console.error('Meta API error:', error)
    return NextResponse.json({ error: 'Error conectando con Meta' }, { status: 500 })
  }
}
