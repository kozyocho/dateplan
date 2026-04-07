'use client'

import { useRouter } from 'next/navigation'
import { type PlanConditions } from '@/types'

interface Props {
  conditions: PlanConditions
}

export function ReplanButton({ conditions }: Props) {
  const router = useRouter()

  const handleReplan = () => {
    sessionStorage.setItem('reuse_conditions', JSON.stringify(conditions))
    router.push('/generate')
  }

  return (
    <button
      onClick={handleReplan}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors bg-white/80 border border-rose-100 text-rose-500 hover:bg-rose-50"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
      同じ条件で再作成
    </button>
  )
}
