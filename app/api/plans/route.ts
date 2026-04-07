import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const isBypassAuth = () => process.env.DEV_BYPASS_AUTH === 'true' && process.env.NODE_ENV !== 'production'
const mockUserId = () => process.env.DEV_MOCK_USER_ID ?? 'dev-user'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ALLOWED_AREAS = new Set(['nagoya', 'tokyo'])

async function resolveUserId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string | null> {
  if (isBypassAuth()) return mockUserId()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function GET() {
  const supabase = await createClient()
  const userId = await resolveUserId(supabase)
  if (!userId) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { data, error } = await supabase
    .from('date_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: 'データの取得に失敗しました' }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const userId = await resolveUserId(supabase)
  if (!userId) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { title, conditions, plan_content, area } = await request.json()

  // 入力バリデーション
  if (!title || typeof title !== 'string' || title.length > 200) {
    return Response.json({ error: '無効なタイトルです' }, { status: 400 })
  }
  if (!ALLOWED_AREAS.has(area)) {
    return Response.json({ error: '無効なエリアです' }, { status: 400 })
  }
  if (!plan_content || typeof plan_content !== 'string') {
    return Response.json({ error: '無効なプランデータです' }, { status: 400 })
  }
  try {
    JSON.parse(plan_content)
  } catch {
    return Response.json({ error: '無効なプランデータです' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('date_plans')
    .insert({ user_id: userId, title, conditions, plan_content, area })
    .select()
    .single()

  if (error) {
    return Response.json({ error: 'プランの保存に失敗しました' }, { status: 500 })
  }

  return Response.json(data, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const userId = await resolveUserId(supabase)
  if (!userId) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { id } = await request.json()

  // UUID形式バリデーション
  if (!id || typeof id !== 'string' || !UUID_RE.test(id)) {
    return Response.json({ error: '無効なIDです' }, { status: 400 })
  }

  const { error } = await supabase
    .from('date_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return Response.json({ error: '削除に失敗しました' }, { status: 500 })
  }

  return Response.json({ success: true })
}
