'use client'

import { useRef } from 'react'
import { type GeneratedPlan } from '@/types'

interface Props {
  plan: GeneratedPlan
  title: string
  area?: string
}

export function DownloadPlanButton({ plan, title, area }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleDownload = () => {
    const spots = plan.timeline.slice(0, 5).map((s) => ({
      time: s.time,
      place: s.place,
      category: s.category,
    }))

    const url = `/api/plan-card?title=${encodeURIComponent(title)}&area=${encodeURIComponent(area ?? '')}&spots=${encodeURIComponent(JSON.stringify(spots))}`

    if (linkRef.current) {
      linkRef.current.href = url
      linkRef.current.click()
    }
  }

  return (
    <>
      {/* 非表示のダウンロードリンク */}
      <a
        ref={linkRef}
        download="dateplan.png"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden"
        aria-hidden="true"
      />
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 text-rose-500 text-sm rounded-xl font-medium border border-rose-100 hover:bg-rose-100 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        画像を保存
      </button>
    </>
  )
}
