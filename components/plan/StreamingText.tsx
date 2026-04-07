'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { type PlanConditions, type GeneratedPlan } from '@/types'

interface StreamingTextProps {
  conditions: PlanConditions
  onComplete: (plan: GeneratedPlan, rawText: string) => void
  onError: (error: string, code?: string) => void
}

const LOADING_MESSAGES = [
  'あなたたちのためのエリアを分析しています',
  '特別なスポットをセレクトしています',
  '最適な移動ルートを組み立てています',
  'お店の雰囲気を確かめています',
  '心に残る体験を加えています',
  'プランに最後の仕上げをしています',
]

export function StreamingText({ conditions, onComplete, onError }: StreamingTextProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [dots, setDots] = useState('')
  const textRef = useRef('')

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2200)
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => {
      clearInterval(msgInterval)
      clearInterval(dotInterval)
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    textRef.current = ''

    const fetchStream = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conditions),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const data = await response.json()
          onError(data.error ?? '生成に失敗しました', data.code)
          return
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder('utf-8', { ignoreBOM: true })
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)

            if (data.trim() === '[DONE]') {
              try {
                const plan = JSON.parse(textRef.current) as GeneratedPlan
                onComplete(plan, textRef.current)
              } catch (e) {
                onError(`JSON解析失敗: ${e instanceof Error ? e.message : String(e)}`)
              }
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) { onError(parsed.error, parsed.code); return }
              if (parsed.text) { textRef.current += parsed.text }
            } catch {
              // SSEのパース失敗は無視して継続
            }
          }
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        onError(`通信エラー: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    fetchStream()
    return () => abortController.abort()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-8">
      {/* アイコン */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center bg-[#fff0f2]"
          style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#ffe0e6]">
            <Heart className="w-8 h-8 fill-[#ff385c] text-[#ff385c]" />
          </div>
        </div>
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-[#222222]"
          style={{ animation: 'spin 3s linear infinite' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
        </div>
      </div>

      {/* メッセージ */}
      <div className="space-y-2">
        <p className="text-base font-bold text-[#222222]">
          {LOADING_MESSAGES[messageIndex]}{dots}
        </p>
        <p className="text-sm text-[#6a6a6a]">AIがあなただけのプランを作成中</p>
      </div>

      {/* プログレスバー */}
      <div className="w-52 h-1 bg-[#f2f2f2] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#ff385c]"
          style={{ animation: 'loading-bar 2s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.9; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
