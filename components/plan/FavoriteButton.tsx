'use client'

import { useState } from 'react'

interface Props {
  planId: string
  initialFavorite: boolean
}

export function FavoriteButton({ planId, initialFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    setIsFavorite((prev) => !prev) // optimistic update
    try {
      const res = await fetch(`/api/plans/${planId}/favorite`, { method: 'PATCH' })
      if (!res.ok) setIsFavorite((prev) => !prev) // revert on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors"
      style={{
        background: isFavorite ? '#FFF1F2' : 'rgba(255,255,255,0.8)',
        color: isFavorite ? '#E11D48' : '#9CA3AF',
        border: `1px solid ${isFavorite ? '#FECDD3' : '#E5E7EB'}`,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {isFavorite ? 'お気に入り済み' : 'お気に入り'}
    </button>
  )
}
