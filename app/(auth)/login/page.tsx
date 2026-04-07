'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setMessage({ type: 'error', text: 'メール送信に失敗しました。再度お試しください。' })
    } else {
      setMessage({ type: 'success', text: 'ログインリンクをメールに送信しました。メールを確認してください。' })
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="flex items-center justify-center gap-2 text-2xl font-bold text-[#222222]">
            <Heart className="w-5 h-5 fill-[#ff385c] text-[#ff385c]" />
            dateplan
          </span>
          <p className="text-sm text-[#6a6a6a] mt-1">AIデートプラン</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#c1c1c1]/50 shadow-sm p-8">
          <h1 className="text-xl font-bold text-[#222222] mb-1 text-center">ログイン</h1>
          <p className="text-sm text-[#6a6a6a] text-center mb-7">プランを生成・保存するにはログインが必要です</p>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11 border-[#c1c1c1] text-[#222222] hover:bg-[#f2f2f2] rounded-[8px]"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Googleでログイン
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-[#c1c1c1]/40" />
              <span className="text-xs text-[#929292]">または</span>
              <Separator className="flex-1 bg-[#c1c1c1]/40" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3" suppressHydrationWarning>
              <div>
                <label className="text-xs font-medium text-[#6a6a6a] mb-1.5 block">メールアドレス</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-[#c1c1c1] rounded-[8px] h-11 bg-white"
                  suppressHydrationWarning
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-[8px] text-white font-bold bg-[#ff385c] hover:bg-[#e00b41]"
                disabled={isLoading}
              >
                {isLoading ? '送信中...' : 'メールでログイン'}
              </Button>
            </form>

            {message && (
              <p className={`text-sm text-center rounded-[8px] px-4 py-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#929292] mt-6">
          ログインすることで利用規約に同意したものとみなします
        </p>
      </div>
    </div>
  )
}
