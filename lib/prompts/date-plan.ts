import { type PlanConditions, type PlanSpot } from '@/types'
import { type SpotCandidate } from '@/lib/places-search'

const AREA: Record<string, string> = { nagoya: '名古屋', tokyo: '東京' }
const RELATIONSHIP: Record<string, string> = {
  first_date: '初デート', new_couple: '付き合いたて（3ヶ月以内）', couple: 'カップル',
  married: '夫婦・パートナー', friends: '友達', family: '家族',
}
const SCENE: Record<string, string> = {
  anniversary: '記念日（特別な演出が必要）',
  casual: '普通の休日',
  surprise: 'サプライズ（相手が喜ぶ仕掛けを含める）',
  first_date: '初デート（程よい距離感で自然に打ち解けられる）',
  holiday: '祝日・特別な日',
}
const TRANSPORT: Record<string, string> = {
  train: '電車', taxi: 'タクシー', car: '車', walk: '徒歩',
}
const WEATHER: Record<string, string> = {
  sunny: '晴れ（屋外優先）', cloudy: '曇り（屋内・屋外どちらも可）',
  rainy: '雨（屋内中心・移動最小化）', any: '天候問わず',
}
const GENRE: Record<string, string> = {
  gourmet: 'グルメ', cafe: 'カフェ', nature: '自然', art: 'アート',
  shopping: 'ショッピング', activity: 'アクティビティ', movie: '映画',
  amusement: '遊園地', sightseeing: '観光', night_view: '夜景',
}
const AGE: Record<string, string> = {
  teens: '10代', twenties: '20代', thirties: '30代', forties_plus: '40代以上',
}
const GENDER: Record<string, string> = {
  male_female: '男女', male_male: '男性同士', female_female: '女性同士', mixed: '混合',
}

function buildSpotsSection(spots: SpotCandidate[]): string {
  if (spots.length === 0) return ''
  const grouped = spots.reduce<Record<string, SpotCandidate[]>>((acc, s) => {
    ;(acc[s.genreLabel] ??= []).push(s)
    return acc
  }, {})
  const lines = Object.entries(grouped).map(
    ([label, list]) =>
      `${label}:\n${list.map((s) => `- ${s.name}${s.rating ? `（評価${s.rating.toFixed(1)}）` : ''}`).join('\n')}`
  )
  return `【実在スポット候補（優先的に使用すること）】\n${lines.join('\n\n')}\n\n`
}

function sanitizeForPrompt(input: string, maxLength = 100): string {
  return input.replace(/[\n\r\t<>]/g, ' ').slice(0, maxLength).trim()
}

export function buildDatePlanPrompt(conditions: PlanConditions, spots: SpotCandidate[] = []): string {
  const safeLocation = sanitizeForPrompt(conditions.location, 50)
  const transport = conditions.transport.map((t) => TRANSPORT[t]).join('・')
  const genres = conditions.genre_preferences.map((g) => GENRE[g]).join('・')
  const genreNG = conditions.genre_ng.map((g) => GENRE[g]).join('・')
  const budget = conditions.budget_per_person
  const totalBudget = budget * conditions.people_count

  return `あなたは${AREA[conditions.area]}の地元事情に精通したデートプランナーです。実際に存在する人気店・スポットを使って、記憶に残るデートプランをJSON形式で作成してください。

【条件】
エリア: ${AREA[conditions.area]}（出発地点・希望エリア: ${safeLocation}）
人数: ${conditions.people_count}人 / 年齢層: ${AGE[conditions.age_group]} / 性別: ${GENDER[conditions.gender_combo]}
関係性: ${RELATIONSHIP[conditions.relationship]}
シーン: ${SCENE[conditions.scene]}
開始時間: ${conditions.time_start} / 所要時間: ${conditions.duration_hours}時間
移動手段: ${transport}
天候: ${WEATHER[conditions.weather]}
予算: 一人${budget.toLocaleString()}円（総額${totalBudget.toLocaleString()}円以内）${genres ? `\n希望ジャンル: ${genres}` : ''}${genreNG ? `\nNGジャンル: ${genreNG}` : ''}

${buildSpotsSection(spots)}【ルール】
- 実在するスポット・店舗のみ（架空・閉店済みは禁止）
- 全スポットの合計費用が予算内に収まること
- 移動時間を含めた時間配分を現実的に
- 天候・関係性・シーンに合ったスポットを選ぶこと

【品質指示】
- タイトルは具体的で魅力的に（例:「栄レトロ喫茶から夜の納屋橋まで、大人の名古屋デート」）
- 各スポットの説明に「なぜこの二人に合っているか」を含める
- スポット間のストーリー性・自然な流れを意識する
- tipsはデートをより特別にする実用的なアドバイス（予約方法・おすすめメニュー・ベストな時間帯など）

JSONのみ出力:
{"title":"30文字以内","summary":"概要2〜3文","timeline":[{"time":"HH:MM","duration":"XX分","place":"スポット名","category":"食事|カフェ|観光|ショッピング|アクティビティ|夜景","description":"説明2〜3文","transport_to_next":"移動手段と時間（最後は空文字）","estimated_cost":0}],"total_estimated_cost":0,"tips":["アドバイス"]}
`
}

export function buildSpotReplacePrompt(
  conditions: PlanConditions,
  timeline: PlanSpot[],
  spotIndex: number
): string {
  const transport = conditions.transport.map((t) => TRANSPORT[t]).join('・')
  const currentSpot = timeline[spotIndex]
  const prevSpot = spotIndex > 0 ? timeline[spotIndex - 1] : null
  const nextSpot = spotIndex < timeline.length - 1 ? timeline[spotIndex + 1] : null

  const timelineContext = timeline
    .map((s, i) => `${i === spotIndex ? '[差し替え対象]' : '      '} ${s.time} ${s.place}（${s.category}）`)
    .join('\n')

  return `あなたは${AREA[conditions.area]}の地元事情に精通したデートプランナーです。以下のデートプランの1スポットを、より良い別のスポットに差し替えてください。

【元のプランの流れ】
${timelineContext}

【差し替え対象】
時間: ${currentSpot.time}（${currentSpot.duration}）
場所: ${currentSpot.place}（${currentSpot.category}）
${prevSpot ? `前のスポット: ${prevSpot.place}` : 'プランの最初'}
${nextSpot ? `次のスポット: ${nextSpot.place}` : 'プランの最後'}

【条件】
エリア: ${AREA[conditions.area]} / 関係性: ${RELATIONSHIP[conditions.relationship]}
移動手段: ${transport} / 天候: ${WEATHER[conditions.weather]} / 一人${conditions.budget_per_person.toLocaleString()}円

ルール: ${currentSpot.place}と異なるスポット・同じ時刻(${currentSpot.time})・実在するスポットのみ・なぜこの二人に合っているかを説明に含める

JSONのみ出力:
{"time":"${currentSpot.time}","duration":"XX分","place":"スポット名","category":"食事|カフェ|観光|ショッピング|アクティビティ|夜景","description":"説明2〜3文","transport_to_next":"${nextSpot ? '移動手段と時間' : ''}","estimated_cost":0}
`
}
