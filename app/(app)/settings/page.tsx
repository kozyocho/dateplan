export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { type Profile } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { redirect } from 'next/navigation'
import { UpgradeButton } from '@/components/plan/UpgradeButton'

interface Props {
  searchParams: Promise<{ upgraded?: string }>
}

export default async function SettingsPage({ searchParams }: Props) {
  const { upgraded } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const p = profile as Profile | null
  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ?? ''

  return (
    <div className="min-h-dvh bg-white text-[#222222]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#c1c1c1]/50 px-5 py-4 flex items-center gap-3" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <Link href="/generate" className="text-[#6a6a6a] hover:text-[#222222] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-[#222222]">
          <Heart className="w-3 h-3 fill-[#ff385c] text-[#ff385c]" />
          dateplan
        </Link>
        <h1 className="font-semibold text-[#222222] text-sm">アカウント設定</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {upgraded === 'true' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-5 text-center space-y-1">
            <p className="text-sm font-semibold text-emerald-700">Proプランへのアップグレードが完了しました！</p>
            <p className="text-xs text-emerald-600">これから無制限でプランを生成できます。</p>
          </div>
        )}

        {/* アカウント */}
        <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#222222]">アカウント</h2>
          <p className="text-sm text-[#6a6a6a]">{user.email}</p>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" size="sm" className="border-[#c1c1c1] text-[#222222] hover:bg-[#f2f2f2] rounded-[8px] text-xs">
              ログアウト
            </Button>
          </form>
        </div>

        {/* プラン情報 */}
        <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#222222]">現在のプラン</h2>
            {p?.is_pro ? (
              <span className="text-xs font-bold text-[#ff385c] bg-[#fff0f2] border border-[#ff385c]/20 px-3 py-1 rounded-full">✦ Pro</span>
            ) : (
              <span className="text-xs font-medium text-[#6a6a6a] bg-[#f2f2f2] border border-[#c1c1c1]/40 px-3 py-1 rounded-full">無料プラン</span>
            )}
          </div>

          {!p?.is_pro && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6a6a6a]">今月の生成回数</span>
                  <span className="font-bold text-[#222222]">{p?.plan_count ?? 0} / 3回</span>
                </div>
                <div className="w-full h-1.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-[#ff385c]"
                    style={{ width: `${Math.min(100, ((p?.plan_count ?? 0) / 3) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#f2f2f2] rounded-[14px] border border-[#c1c1c1]/40 p-4 space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#222222]">¥480</span>
                  <span className="text-xs text-[#929292]">/月</span>
                  <span className="ml-auto text-xs text-[#6a6a6a] font-medium bg-white border border-[#c1c1c1]/40 px-2 py-0.5 rounded-full">いつでも解約可</span>
                </div>
                <ul className="text-xs text-[#222222] space-y-1.5">
                  <li className="flex items-center gap-1.5"><span className="text-[#ff385c]">✓</span> 月間無制限でプラン生成</li>
                  <li className="flex items-center gap-1.5"><span className="text-[#ff385c]">✓</span> プランの保存・履歴管理</li>
                  <li className="flex items-center gap-1.5"><span className="text-[#ff385c]">✓</span> スポット個別差し替え機能</li>
                  <li className="flex items-center gap-1.5"><span className="text-[#ff385c]">✓</span> 雨天プラン自動変換</li>
                </ul>
                <UpgradeButton priceId={monthlyPriceId} />
              </div>
            </>
          )}

          {p?.is_pro && (
            <div className="text-center py-4 space-y-1">
              <p className="text-sm font-bold text-[#222222]">無制限でプランを生成できます</p>
              <p className="text-xs text-[#6a6a6a]">いつでも設定から解約できます</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
