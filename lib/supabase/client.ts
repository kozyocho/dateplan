'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // 環境変数未設定（ビルド時等）はダミーを返す（操作は実行されない）
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
  return createBrowserClient(url, key)
}
