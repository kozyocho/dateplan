export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { type DatePlan, type GeneratedPlan } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

type PlanWithFavorite = DatePlan & { is_favorite: boolean }

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: plans } = await supabase
    .from('date_plans')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-dvh bg-white text-[#222222]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#c1c1c1]/50 px-5 py-4 flex items-center justify-between" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <Link href="/" className="flex items-center gap-1.5 text-base font-bold text-[#222222]">
          <Heart className="w-3.5 h-3.5 fill-[#ff385c] text-[#ff385c]" />
          dateplan
        </Link>
        <div>
          <h1 className="text-sm font-semibold text-[#222222]">保存済みプラン</h1>
          {plans && plans.length > 0 && (
            <p className="text-xs text-[#929292] text-right">{plans.length}件</p>
          )}
        </div>
        <Link href="/generate">
          <Button size="sm" className="rounded-full text-xs font-bold text-white bg-[#222222] hover:bg-[#444444]">
            新しいプランを作る
          </Button>
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {!plans || plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-[#fff0f2]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <p className="font-bold text-[#222222] mb-1">まだプランがありません</p>
            <p className="text-sm text-[#6a6a6a] mb-8">最初のデートプランを作ってみましょう</p>
            <Link href="/generate">
              <Button className="rounded-full px-6 text-white font-bold bg-[#ff385c] hover:bg-[#e00b41]">プランを作る</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(plans as PlanWithFavorite[]).map((plan) => {
              let parsedPlan: GeneratedPlan | null = null
              try { parsedPlan = JSON.parse(plan.plan_content) } catch { /* ignore */ }
              const spotCount = parsedPlan?.timeline?.length ?? 0
              const totalCost = parsedPlan?.total_estimated_cost ?? 0
              const areaLabel = plan.area === 'nagoya' ? '名古屋' : '東京'

              return (
                <Link key={plan.id} href={`/result/${plan.id}`}>
                  <div className="bg-white rounded-[14px] p-5 border border-[#c1c1c1]/40 shadow-sm hover:shadow-md hover:border-[#c1c1c1] transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {plan.is_favorite && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff385c" className="shrink-0">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        )}
                        <p className="font-bold text-[#222222] leading-snug truncate">{plan.title}</p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-[#ff385c] bg-[#fff0f2] border border-[#ff385c]/20 px-2 py-0.5 rounded-full">
                        {areaLabel}
                      </span>
                    </div>

                    {parsedPlan && (
                      <p className="text-xs text-[#6a6a6a] line-clamp-2 mb-3 leading-relaxed">{parsedPlan.summary}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#929292]">
                        {spotCount > 0 && <span>{spotCount}スポット</span>}
                        {totalCost > 0 && <span className="text-[#ff385c] font-medium">¥{totalCost.toLocaleString()}/人</span>}
                      </div>
                      <span className="text-xs text-[#929292]">
                        {new Date(plan.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
