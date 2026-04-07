import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'

// サービスロールキーで直接DB更新（RLSをバイパス）
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function POST(request: NextRequest) {
  // ⚠️ RAWボディを先に取得（JSON parseより前）
  const text = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(text, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (!userId) {
          console.error('[Stripe webhook] checkout.session.completed: userId missing from metadata', { sessionId: session.id })
          return Response.json({ error: 'userId missing from metadata' }, { status: 400 })
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId)

        if (error) {
          console.error('[Stripe webhook] Failed to update profile:', error)
          return Response.json({ error: 'DB update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabase
          .from('profiles')
          .update({ is_pro: false, stripe_subscription_id: null })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('[Stripe webhook] Failed to revoke pro status:', error)
          return Response.json({ error: 'DB update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const isActive = subscription.status === 'active'
        const { error } = await supabase
          .from('profiles')
          .update({ is_pro: isActive })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('[Stripe webhook] Failed to update subscription status:', error)
          return Response.json({ error: 'DB update failed' }, { status: 500 })
        }
        break
      }
    }
  } catch (error) {
    console.error('[Stripe webhook] Unexpected error:', error)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }

  return Response.json({ received: true })
}
