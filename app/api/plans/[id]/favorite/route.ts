import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(_request: NextRequest, { params }: Props) {
  const { id } = await params

  if (!UUID_RE.test(id)) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { data: plan } = await supabase
    .from('date_plans')
    .select('is_favorite')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!plan) return Response.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('date_plans')
    .update({ is_favorite: !(plan as { is_favorite: boolean }).is_favorite })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: '更新に失敗しました' }, { status: 500 })

  return Response.json({ success: true })
}
