'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import { Heart } from 'lucide-react'
import { StreamingText } from '@/components/plan/StreamingText'
import { PlanTimeline } from '@/components/plan/PlanTimeline'
import { ShareButtons } from '@/components/plan/ShareButtons'
import { DownloadPlanButton } from '@/components/plan/DownloadPlanButton'
import { type PlanConditions, type GeneratedPlan } from '@/types'

const ConditionForm = nextDynamic(
  () => import('@/components/form/ConditionForm').then(m => m.ConditionForm),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-[#f2f2f2] rounded-[14px] h-96" />,
  }
)

type PageState = 'form' | 'generating' | 'result' | 'error' | 'guest_limit' | 'usage_limit'

export default function GeneratePage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>('form')
  const [conditions, setConditions] = useState<PlanConditions | null>(null)
  const [plan, setPlan] = useState<GeneratedPlan | null>(null)
  const [rawPlan, setRawPlan] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        setIsGuest(!data.user)
      })
    })

    const reuse = sessionStorage.getItem('reuse_conditions')
    if (reuse) {
      try {
        const reuseConditions = JSON.parse(reuse)
        setConditions(reuseConditions)
        setPageState('generating')
      } catch { /* ignore */ }
      sessionStorage.removeItem('reuse_conditions')
    }
  }, [])

  const handleFormSubmit = (cond: PlanConditions) => {
    setConditions(cond)
    setPageState('generating')
    setPlan(null)
    setSaved(false)
    setSavedPlanId(null)
  }

  const handleGenerateComplete = (generatedPlan: GeneratedPlan, raw: string) => {
    setPlan(generatedPlan)
    setRawPlan(raw)
    setPageState('result')
  }

  const handleError = (message: string, code?: string) => {
    if (code === 'GUEST_LIMIT') {
      setPageState('guest_limit')
    } else if (code === 'USAGE_LIMIT') {
      setPageState('usage_limit')
    } else {
      setError(message)
      setPageState('error')
    }
  }

  const handleSave = async () => {
    if (!plan || !conditions || saved) return
    if (isGuest) { router.push('/login?message=save_plan'); return }
    setIsSaving(true)
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: plan.title, conditions, plan_content: rawPlan, area: conditions.area }),
    })
    if (res.ok) {
      const data = await res.json()
      setSaved(true)
      setSavedPlanId(data.id ?? null)
    }
    setIsSaving(false)
  }

  const handleRegenerate = () => {
    setPageState('generating')
    setPlan(null)
    setSaved(false)
    setSavedPlanId(null)
  }

  const handleReplaceSpot = async (index: number) => {
    if (!plan || !conditions || replacingIndex !== null) return
    setReplacingIndex(index)
    try {
      const res = await fetch('/api/regenerate-spot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions, timeline: plan.timeline, spot_index: index }),
      })
      if (res.ok) {
        const { spot } = await res.json()
        const newTimeline = [...plan.timeline]
        newTimeline[index] = spot
        const newCost = newTimeline.reduce((sum, s) => sum + s.estimated_cost, 0)
        setPlan({ ...plan, timeline: newTimeline, total_estimated_cost: newCost })
        setSaved(false)
      }
    } finally {
      setReplacingIndex(null)
    }
  }

  const handleRainConvert = () => {
    if (!conditions) return
    setConditions({ ...conditions, weather: 'rainy' })
    setPageState('generating')
    setPlan(null)
    setSaved(false)
    setSavedPlanId(null)
  }

  return (
    <div className="min-h-dvh bg-white text-[#222222]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#c1c1c1]/50 px-5 py-4 flex items-center justify-between" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <Link href="/" className="flex items-center gap-1.5 text-base font-bold text-[#222222]">
          <Heart className="w-3.5 h-3.5 fill-[#ff385c] text-[#ff385c]" />
          dateplan
        </Link>
        <h1 className="text-sm font-semibold text-[#222222]">プランを作成</h1>
        <div className="w-20" />
      </header>

      {isGuest && pageState !== 'guest_limit' && (
        <div className="bg-[#f2f2f2] border-b border-[#c1c1c1]/40 px-5 py-2.5 flex items-center justify-between text-xs">
          <span className="text-[#6a6a6a]">ゲストモード — 1回まで無料で生成できます</span>
          <Link href="/login" className="text-[#ff385c] font-semibold underline underline-offset-2">サインアップ</Link>
        </div>
      )}

      <main className="max-w-lg mx-auto px-4 py-8">
        {pageState === 'form' && <ConditionForm onSubmit={handleFormSubmit} />}

        {pageState === 'generating' && conditions && (
          <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm">
            <StreamingText conditions={conditions} onComplete={handleGenerateComplete} onError={handleError} />
          </div>
        )}

        {pageState === 'result' && plan && (
          <div className="space-y-4">
            <PlanTimeline
              plan={plan}
              onSave={saved ? undefined : handleSave}
              onRegenerate={handleRegenerate}
              onRainConvert={conditions?.weather !== 'rainy' ? handleRainConvert : undefined}
              onReplaceSpot={handleReplaceSpot}
              replacingIndex={replacingIndex}
              isSaving={isSaving}
            />
            {saved && savedPlanId && (
              <div className="space-y-2">
                <div className="text-center bg-[#f2f2f2] rounded-[14px] py-3 px-4 border border-[#c1c1c1]/40 space-y-1.5">
                  <p className="text-sm text-emerald-600">保存しました</p>
                  <Link href={`/result/${savedPlanId}`} className="text-xs text-[#ff385c] underline underline-offset-4">プランの詳細を見る →</Link>
                </div>
                <ShareButtons planId={savedPlanId} title={plan?.title ?? ''} area={conditions?.area} spotCount={plan?.timeline.length} />
                <div className="flex justify-center">
                  <DownloadPlanButton plan={plan} title={plan.title} area={conditions?.area} />
                </div>
              </div>
            )}
            {isGuest && !saved && (
              <div className="text-center bg-[#f2f2f2] rounded-[14px] py-3 px-4 border border-[#c1c1c1]/40">
                <p className="text-xs text-[#6a6a6a]">
                  プランを保存するには{' '}
                  <Link href="/login" className="font-semibold text-[#ff385c] underline underline-offset-2">サインアップ（無料）</Link>
                  {' '}が必要です
                </p>
              </div>
            )}
          </div>
        )}

        {pageState === 'error' && (
          <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-8 text-center">
            <p className="text-[#6a6a6a] mb-5">{error}</p>
            <button onClick={() => setPageState('form')} className="text-sm text-[#ff385c] underline underline-offset-4">条件入力に戻る</button>
          </div>
        )}

        {pageState === 'guest_limit' && (
          <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[#fff0f2]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#222222] mb-1">もっとプランを作りませんか？</p>
              <p className="text-sm text-[#6a6a6a]">無料登録で月3プランまで生成できます。保存・履歴管理も使えます。</p>
            </div>
            <div className="space-y-2.5">
              <Link href="/login" className="block">
                <button className="w-full h-11 rounded-[8px] text-white text-sm font-bold bg-[#ff385c] hover:bg-[#e00b41] transition-colors">無料でサインアップ</button>
              </Link>
              <button onClick={() => setPageState('form')} className="text-xs text-[#6a6a6a] underline underline-offset-2">条件を変えて再試行</button>
            </div>
          </div>
        )}

        {pageState === 'usage_limit' && (
          <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[#f2f2f2]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#222222] mb-1">今月の無料プランを使い切りました</p>
              <p className="text-sm text-[#6a6a6a]">Proプランなら月額¥480で無制限に生成できます。</p>
            </div>
            <Link href="/settings" className="block">
              <button className="w-full h-11 rounded-[8px] text-white text-sm font-bold bg-[#ff385c] hover:bg-[#e00b41] transition-colors">Proにアップグレード</button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
