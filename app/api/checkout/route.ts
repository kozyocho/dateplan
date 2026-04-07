import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { priceId } = await request.json()

  // priceId ホワイトリスト検証（不正な価格IDによる悪用防止）
  const allowedPriceIds = new Set([
    process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
  ].filter(Boolean))

  if (!priceId || !allowedPriceIds.has(priceId)) {
    return Response.json({ error: '無効な価格IDです' }, { status: 400 })
  }

  // 既存のStripe Customer IDを取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      metadata: { userId: user.id },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : '決済セッションの作成に失敗しました'
    return Response.json({ error: message }, { status: 500 })
  }
}
