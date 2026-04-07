export const dynamic = 'force-dynamic'

import { type Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { type DatePlan, type GeneratedPlan } from '@/types'
import { PlanTimeline } from '@/components/plan/PlanTimeline'
import { ShareButtons } from '@/components/plan/ShareButtons'
import { FavoriteButton } from '@/components/plan/FavoriteButton'
import { ReplanButton } from '@/components/plan/ReplanButton'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: plan } = await supabase.from('date_plans').select('title, area').eq('id', id).single()
  if (!plan) return {}
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const title = (plan as { title: string }).title
  const area = (plan as { area: string }).area
  const ogUrl = `${appUrl}/api/og?title=${encodeURIComponent(title)}&area=${encodeURIComponent(area)}`
  return {
    title,
    openGraph: { title, description: `AIが生成したデートプラン — ${area}エリア`, images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description: `AIが生成したデートプラン — ${area}エリア`, images: [ogUrl] },
  }
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plan, error } = await supabase
    .from('date_plans')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id ?? '')
    .single()

  if (error || !plan) notFound()

  let parsedPlan: GeneratedPlan | null = null
  try { parsedPlan = JSON.parse((plan as DatePlan).plan_content) } catch { /* ignore */ }

  return (
    <div className="min-h-dvh bg-white text-[#222222]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#c1c1c1]/50 px-5 py-4 flex items-center gap-3" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <Link href="/history" className="text-[#6a6a6a] hover:text-[#222222] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-[#222222]">
          <Heart className="w-3 h-3 fill-[#ff385c] text-[#ff385c]" />
          dateplan
        </Link>
        <h1 className="font-semibold text-[#222222] truncate text-sm flex-1">{(plan as DatePlan).title}</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {parsedPlan ? (
          <>
            <PlanTimeline plan={parsedPlan} />
            <div className="flex gap-2 flex-wrap">
              <FavoriteButton planId={id} initialFavorite={(plan as DatePlan & { is_favorite: boolean }).is_favorite ?? false} />
              <ReplanButton conditions={(plan as DatePlan).conditions} />
            </div>
            <ShareButtons planId={id} title={(plan as DatePlan).title} area={(plan as DatePlan).area} spotCount={parsedPlan.timeline.length} />
          </>
        ) : (
          <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-8 text-center">
            <p className="text-[#6a6a6a] mb-5">プランデータを読み込めませんでした</p>
            <Link href="/history" className="text-sm text-[#ff385c] underline underline-offset-4">履歴に戻る</Link>
          </div>
        )}
      </main>
    </div>
  )
}
