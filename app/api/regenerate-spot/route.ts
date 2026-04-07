import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropic } from '@/lib/anthropic'
import { buildSpotReplacePrompt } from '@/lib/prompts/date-plan'
import { rateLimit } from '@/lib/rate-limit'
import { type PlanConditions, type PlanSpot } from '@/types'

export async function POST(request: NextRequest) {
  // IPベースレート制限: 1分間に20リクエストまで
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = rateLimit(`regenerate-spot:${ip}`, 20, 60_000)
  if (!rl.allowed) {
    return Response.json(
      { error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  const supabase = await createClient()

  // 認証確認（ゲストも利用可）
  const isBypassAuth = process.env.DEV_BYPASS_AUTH === 'true' && process.env.NODE_ENV !== 'production'
  if (!isBypassAuth) {
    const { data: { user } } = await supabase.auth.getUser()
    const guestUsed = request.cookies.get('guest_plan_used')?.value
    if (!user && guestUsed !== 'true') {
      return Response.json({ error: '認証が必要です', code: 'UNAUTHORIZED' }, { status: 401 })
    }
  }

  const { conditions, timeline, spot_index } = await request.json() as {
    conditions: PlanConditions
    timeline: PlanSpot[]
    spot_index: number
  }

  if (!Number.isInteger(spot_index) || spot_index < 0 || spot_index >= timeline.length) {
    return Response.json({ error: '無効なスポットインデックスです' }, { status: 400 })
  }

  const isMockMode = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sk-ant-'

  if (isMockMode) {
    const original = timeline[spot_index]
    const mockSpot: PlanSpot = {
      time: original.time,
      duration: original.duration,
      place: original.category === '食事' ? 'みそかつ 矢場とん 矢場町本店' : 'ナゴヤドーム前イオンモール',
      category: original.category,
      description: '地元で人気のスポットです。雰囲気も良く、デートにぴったりです。',
      transport_to_next: original.transport_to_next,
      estimated_cost: original.estimated_cost,
    }
    return Response.json({ spot: mockSpot })
  }

  try {
    const prompt = buildSpotReplacePrompt(conditions, timeline, spot_index)
    const anthropic = getAnthropic()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: '生成に失敗しました' }, { status: 500 })
    }

    // JSON抽出（コードブロックが含まれる場合も対応）
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'レスポンスの解析に失敗しました' }, { status: 500 })
    }

    const spot: PlanSpot = JSON.parse(jsonMatch[0])
    return Response.json({ spot })
  } catch {
    return Response.json({ error: 'スポットの差し替えに失敗しました' }, { status: 500 })
  }
}
