import { type SupabaseClient } from '@supabase/supabase-js'
import { type UsageStatus } from '@/types'

/**
 * check_and_increment_plan_count を呼び出してアトミックにチェック＋インクリメントを行う。
 * レースコンディションを防ぐため、チェックとインクリメントを1トランザクションで実行。
 */
export async function checkAndIncrementUsage(
  userId: string,
  supabase: SupabaseClient
): Promise<UsageStatus> {
  const { data, error } = await supabase.rpc('check_and_increment_plan_count', {
    p_user_id: userId,
  })

  if (error || !data) {
    return { allowed: false, is_pro: false }
  }

  return {
    allowed: data.allowed ?? false,
    remaining: data.remaining,
    is_pro: data.is_pro ?? false,
  }
}

/**
 * @deprecated checkAndIncrementUsage を使用してください（レースコンディション対策済み）
 * 後方互換のため残しています。
 */
export async function checkUsageLimit(
  userId: string,
  supabase: SupabaseClient
): Promise<UsageStatus> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_pro, plan_count, plan_reset_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return { allowed: false, is_pro: false }
  }

  if (profile.is_pro) {
    return { allowed: true, is_pro: true }
  }

  const resetDate = new Date(profile.plan_reset_at)
  const now = new Date()
  const needsReset =
    now.getUTCFullYear() > resetDate.getUTCFullYear() ||
    (now.getUTCFullYear() === resetDate.getUTCFullYear() &&
      now.getUTCMonth() > resetDate.getUTCMonth())

  if (needsReset) {
    return { allowed: true, remaining: 3, is_pro: false }
  }

  const remaining = 3 - profile.plan_count
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    is_pro: false,
  }
}

/**
 * @deprecated checkAndIncrementUsage に統合されました
 */
export async function incrementUsageCount(
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  await supabase.rpc('increment_plan_count', { user_id: userId })
}
