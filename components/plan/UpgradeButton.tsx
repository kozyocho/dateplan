'use client'

import { useState } from 'react'

interface UpgradeButtonProps {
  priceId: string
}

export function UpgradeButton({ priceId }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    if (!priceId) {
      setError('料金プランが設定されていません')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? '決済ページへの移動に失敗しました')
        setLoading(false)
      }
    } catch {
      setError('通信エラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full h-11 rounded-xl border-0 text-white text-sm font-semibold disabled:opacity-60 transition-all"
        style={{ background: 'linear-gradient(135deg, #DB2777, #be185d)', boxShadow: '0 4px 14px rgba(219,39,119,0.3)' }}
      >
        {loading ? '決済ページへ移動中...' : 'Proにアップグレード'}
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  )
}
