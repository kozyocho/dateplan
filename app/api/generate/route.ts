import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGoogleAI, GEMMA_MODEL } from '@/lib/google-ai'
import { buildDatePlanPrompt } from '@/lib/prompts/date-plan'
import { checkAndIncrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { type PlanConditions } from '@/types'

export async function POST(request: NextRequest) {
  // IPベースレート制限: 1分間に10リクエストまで
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = rateLimit(`generate:${ip}`, 10, 60_000)
  if (!rl.allowed) {
    return Response.json(
      { error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  const supabase = await createClient()

  // 認証確認
  const isBypassAuth = process.env.DEV_BYPASS_AUTH === 'true' && process.env.NODE_ENV !== 'production'
  let userId: string
  let isGuest = false

  if (isBypassAuth) {
    userId = process.env.DEV_MOCK_USER_ID ?? 'dev-user'
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // ゲストモード: cookie で1回まで許可
      const guestUsed = request.cookies.get('guest_plan_used')?.value
      if (guestUsed === 'true') {
        return Response.json(
          { error: '続けるにはサインアップが必要です', code: 'GUEST_LIMIT' },
          { status: 403 }
        )
      }
      userId = 'guest'
      isGuest = true
    } else {
      userId = user.id

      // 利用制限チェック＋インクリメント（アトミック実行）
      const usage = await checkAndIncrementUsage(userId, supabase)
      if (!usage.allowed) {
        return Response.json(
          { error: '今月の無料プラン生成回数（3回）に達しました。Proプランにアップグレードしてください。', code: 'USAGE_LIMIT' },
          { status: 403 }
        )
      }
    }
  }

  const conditions: PlanConditions = await request.json()
  const prompt = buildDatePlanPrompt(conditions)

  // ストリーミングレスポンス
  const encoder = new TextEncoder()
  const isMockMode = !process.env.GOOGLE_AI_API_KEY

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (isMockMode) {
          const isNagoya = conditions.area === 'nagoya'
          const isRainy = conditions.weather === 'rainy'
          const isAnniversary = conditions.scene === 'anniversary'
          const byTrain = conditions.transport.includes('train')
          const budget = conditions.budget_per_person

          type MockPlan = {
            title: string
            summary: string
            timeline: {
              time: string
              duration: string
              place: string
              category: string
              description: string
              transport_to_next: string
              estimated_cost: number
            }[]
            total_estimated_cost: number
            tips: string[]
          }

          // エリア×天候×シーンで分岐するサンプルプラン
          let mockPlan: MockPlan

          if (isNagoya && isRainy) {
            mockPlan = {
              title: '名古屋 雨の日インドアデートプラン',
              summary: '雨でも全然OK！名古屋の屋内スポットだけで組んだ充実プランです。ミュージアムからレトロ喫茶、夜は絶品ひつまぶしで締めくくり。',
              timeline: [
                { time: conditions.time_start, duration: '90分', place: 'トヨタ産業技術記念館', category: '観光', description: '日本最大級の産業博物館。織機から自動車まで動態展示が充実。知識がなくても圧倒される迫力です。', transport_to_next: byTrain ? '地下鉄で約20分' : 'タクシーで約15分', estimated_cost: Math.round(budget * 0.05) },
                { time: '12:30', duration: '60分', place: '喫茶マウンテン（千種区）', category: 'カフェ', description: '名古屋のB級グルメ聖地。甘口スパゲティや小倉トーストなど独自メニューに二人でびっくり体験。', transport_to_next: byTrain ? '地下鉄で約15分' : 'タクシーで約10分', estimated_cost: Math.round(budget * 0.08) },
                { time: '14:00', duration: '120分', place: '名古屋市美術館（白川公園内）', category: 'アート', description: '国際色豊かなコレクションが揃うアートスポット。雨の日は人が少なくゆっくり鑑賞できます。', transport_to_next: byTrain ? '地下鉄で約10分' : '徒歩約15分', estimated_cost: Math.round(budget * 0.06) },
                { time: '16:30', duration: '60分', place: 'コメダ珈琲 本店（西区）', category: 'カフェ', description: '名古屋発祥のコメダ珈琲で一休み。シロノワールは外せない定番スイーツ。ゆったりソファで雨宿りを楽しんで。', transport_to_next: byTrain ? '地下鉄で約15分' : 'タクシーで約10分', estimated_cost: Math.round(budget * 0.07) },
                { time: '18:30', duration: '90分', place: 'あつた蓬莱軒 本店（ひつまぶし）', category: '食事', description: 'ひつまぶし発祥の老舗。3通りの食べ方で楽しむ名古屋名物。記念日の仕上げにふさわしい格別な一皿。', transport_to_next: '', estimated_cost: Math.round(budget * 0.45) },
              ],
              total_estimated_cost: budget,
              tips: ['トヨタ産業技術記念館は事前ネット予約で並ばず入れます', '名古屋市美術館の常設展は500円とリーズナブル', 'あつた蓬莱軒は予約必須（特に週末は2〜3週前に）'],
            }
          } else if (isNagoya && isAnniversary) {
            mockPlan = {
              title: '名古屋 記念日スペシャルデートプラン',
              summary: '大切な記念日に贈る、名古屋最高の一日。覚王山の隠れ家カフェからスタートし、夜景レストランで感動のフィナーレ。',
              timeline: [
                { time: conditions.time_start, duration: '90分', place: '覚王山 日泰寺とカフェ巡り', category: 'カフェ', description: '大人デートの聖地・覚王山。月替わりの市やおしゃれカフェが並ぶ参道を二人でのんびり散歩。', transport_to_next: byTrain ? '地下鉄で約20分' : 'タクシーで約15分', estimated_cost: Math.round(budget * 0.1) },
                { time: '12:30', duration: '90分', place: 'レストラン エスキス（栄）', category: '食事', description: '記念日ランチに最適なフレンチレストラン。アニバーサリーコースを予約しておくとサプライズ演出も可能。', transport_to_next: byTrain ? '地下鉄で約5分' : '徒歩約10分', estimated_cost: Math.round(budget * 0.3) },
                { time: '14:30', duration: '60分', place: '栄 ラシック・LACHIC', category: 'ショッピング', description: 'ディナーまでのお楽しみショッピング。記念日プレゼントを一緒に選ぶのも思い出に。', transport_to_next: '徒歩すぐ', estimated_cost: Math.round(budget * 0.2) },
                { time: '16:00', duration: '60分', place: 'テレビ塔 スカイデッキ（栄）', category: '観光', description: '名古屋の街を一望できる展望台。夕暮れ時は特に美しく、二人で見る景色は格別。', transport_to_next: '徒歩約5分', estimated_cost: Math.round(budget * 0.03) },
                { time: '19:00', duration: '120分', place: 'THE TOWER SUITES Nagoya スカイラウンジ', category: '食事', description: '名古屋最高層からの夜景ディナー。記念日を伝えると特別なデザートプレートを用意してくれます。', transport_to_next: '', estimated_cost: Math.round(budget * 0.37) },
              ],
              total_estimated_cost: budget,
              tips: ['レストランは必ず記念日であることを予約時に伝えて', '覚王山は毎月21日に弘法縁日の市が立ちます', 'スカイラウンジは窓際席を予約時にリクエストすること'],
            }
          } else if (!isNagoya && isRainy) {
            mockPlan = {
              title: '東京 雨の日アートとグルメデートプラン',
              summary: '雨の東京を最大限に楽しむインドアプラン。世界レベルの美術館と、路地裏の名店グルメで特別な一日に。',
              timeline: [
                { time: conditions.time_start, duration: '120分', place: '国立新美術館（六本木）', category: 'アート', description: '日本最大の展示スペースを誇る美術館。常設展はなく企画展のみなので、常に新しい体験ができます。', transport_to_next: byTrain ? '地下鉄で約5分' : '徒歩約10分', estimated_cost: Math.round(budget * 0.1) },
                { time: '12:30', duration: '90分', place: '六本木ヒルズ 森タワー周辺レストラン', category: '食事', description: '六本木ヒルズのレストラン街でランチ。晴れの日と違って空いているので、人気店にも入りやすい穴場タイミング。', transport_to_next: byTrain ? '地下鉄で約15分' : 'タクシーで約10分', estimated_cost: Math.round(budget * 0.25) },
                { time: '14:30', duration: '90分', place: '渋谷スクランブルスクエア（屋内展望台）', category: '観光', description: '渋谷スカイは雨の日も景色がドラマチック。霧雨の東京もまた美しい。', transport_to_next: byTrain ? '地下鉄で約10分' : 'タクシーで約10分', estimated_cost: Math.round(budget * 0.06) },
                { time: '16:30', duration: '60分', place: '代官山 蔦屋書店', category: 'カフェ', description: 'おしゃれな本屋でゆっくり本を選んだりカフェでくつろいだり。雨の日の代官山はいつもより静かで落ち着きます。', transport_to_next: byTrain ? '電車で約10分' : 'タクシーで約10分', estimated_cost: Math.round(budget * 0.07) },
                { time: '18:30', duration: '120分', place: '恵比寿 YEBISU GARDEN PLACE 近くのフレンチビストロ', category: '食事', description: '路地裏の隠れ家ビストロでディナー。雨の恵比寿の街灯がロマンティックな雰囲気を演出します。', transport_to_next: '', estimated_cost: Math.round(budget * 0.52) },
              ],
              total_estimated_cost: budget,
              tips: ['国立新美術館は水曜休館なので注意', '渋谷スカイは予約制なので事前購入がベター', '雨の日は穴場タイミング。平日なら人気店も狙い目'],
            }
          } else {
            // デフォルト：晴れの日スタンダードプラン
            mockPlan = {
              title: isNagoya ? '名古屋 定番デートコース〜栄・大須散策〜' : '東京 王道デートコース〜表参道・渋谷〜',
              summary: isNagoya
                ? '名古屋の繁華街・栄から始まり、レトロな大須商店街へ。食べ歩きと買い物を楽しんだあとは夜景ディナーで締めくくる定番コース。'
                : '表参道のおしゃれカフェからスタートし、渋谷・代官山を巡る王道東京デート。締めくくりは恵比寿の夜景で。',
              timeline: [
                { time: conditions.time_start, duration: '60分', place: isNagoya ? 'コメダ珈琲 本店（西区）' : '猿田彦珈琲 表参道店', category: 'カフェ', description: isNagoya ? '名古屋の朝はモーニングから。シロノワールとたっぷりトーストで贅沢なスタート。' : '東京の朝をスペシャルティコーヒーで。行列ができる人気店も朝イチなら待ち時間なし。', transport_to_next: byTrain ? '地下鉄で約15分' : '徒歩約20分', estimated_cost: Math.round(budget * 0.07) },
                { time: '12:00', duration: '90分', place: isNagoya ? '矢場とん 矢場町本店（味噌カツ）' : '表参道 根津美術館 カフェ', category: '食事', description: isNagoya ? '名古屋飯の王様・味噌カツを本場で。行列必至の人気店なので少し早めに並ぶのがコツ。' : '緑に囲まれた美術館カフェでおしゃれランチ。静かな庭園を眺めながら会話も弾む。', transport_to_next: byTrain ? '地下鉄で約10分' : '徒歩約15分', estimated_cost: Math.round(budget * 0.15) },
                { time: '14:00', duration: '90分', place: isNagoya ? '大須商店街（食べ歩き）' : '下北沢 古着・雑貨巡り', category: 'ショッピング', description: isNagoya ? 'アーケードが続く大須でぶらぶら食べ歩き。エビフリャーや台湾ラーメンなど名古屋B級グルメも充実。' : '独特の個性が光る下北沢。古着・レコード・雑貨を一緒に選ぶだけで会話が盛り上がる。', transport_to_next: byTrain ? '地下鉄で約20分' : 'タクシーで約15分', estimated_cost: Math.round(budget * 0.18) },
                { time: '16:30', duration: '60分', place: isNagoya ? 'テレビ塔 スカイデッキ（栄）' : '渋谷スカイ（展望台）', category: '観光', description: isNagoya ? '栄のシンボル・テレビ塔から名古屋の街を一望。夕暮れ前の光が街を黄金色に染めます。' : '渋谷スクランブル交差点を上から眺める絶景スポット。夕暮れ時は特に写真映え。', transport_to_next: byTrain ? '電車で約20分' : 'タクシーで約15分', estimated_cost: Math.round(budget * 0.05) },
                { time: '19:00', duration: '120分', place: isNagoya ? 'THE TOWER SUITES Nagoya スカイラウンジ' : '恵比寿ガーデンプレイス 夜景ディナー', category: '食事', description: isAnniversary ? '記念日にふさわしい夜景レストラン。予約時に記念日を伝えるとサプライズ演出をしてくれます。' : '一日の締めくくりは夜景を見ながらのディナー。二人だけの特別な時間を過ごして。', transport_to_next: '', estimated_cost: Math.round(budget * 0.55) },
              ],
              total_estimated_cost: budget,
              tips: [
                '人気店は事前予約がベスト（特に週末）',
                byTrain ? 'ICカードを事前にチャージしておくとスムーズ' : '駐車場は事前にタイムズなどで予約しておくと安心',
                isAnniversary ? 'レストランには予約時に記念日を伝えると特別な演出をしてくれることが多いです' : '夕方以降は混むので、夜景スポットは時間に余裕を持って',
              ],
            }
          }

          const jsonStr = JSON.stringify(mockPlan)
          const chunks = jsonStr.match(/.{1,40}/g) || []
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
            await new Promise(r => setTimeout(r, 15))
          }
        } else {
          const model = getGoogleAI().getGenerativeModel({ model: GEMMA_MODEL })
          const result = await model.generateContentStream(prompt)

          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        console.error('[generate] streaming error:', error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'プランの生成中にエラーが発生しました。もう一度お試しください。' })}\n\n`)
        )
        controller.close()
      }
    },
  })

  const headers: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  }
  if (isGuest) {
    headers['Set-Cookie'] = 'guest_plan_used=true; Path=/; SameSite=Lax; Max-Age=2592000; HttpOnly'
  }

  return new Response(stream, { headers })
}
