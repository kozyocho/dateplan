/**
 * シンプルなインメモリIPベースレートリミッター
 * Vercelのサーバーレス環境では各インスタンスにつき独立したメモリなので、
 * 完全な精度はないが悪用の大半を防ぐのに有効
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// 古いエントリを定期クリーンアップ（メモリリーク防止）
let lastCleanup = Date.now()
function maybeCleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * @param key - IPアドレスなどの識別子
 * @param limit - 期間内の最大リクエスト数
 * @param windowMs - ウィンドウサイズ（ミリ秒）
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  maybeCleanup()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  entry.count++
  store.set(key, entry)

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  }
}
