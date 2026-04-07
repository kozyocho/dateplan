import { type PlanConditions, type PlanSpot } from '@/types'

const AREA_LABELS: Record<string, string> = {
  nagoya: '名古屋',
  tokyo: '東京',
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  first_date: '初めてのデート',
  new_couple: '付き合いたて（3ヶ月以内）',
  couple: 'カップル',
  married: '夫婦・パートナー',
  friends: '友達',
  family: '家族',
}

const SCENE_LABELS: Record<string, string> = {
  anniversary: '記念日（特別な演出が必要）',
  casual: '普通の休日',
  surprise: 'サプライズ（相手が喜ぶ仕掛けを含める）',
  first_date: '初デート（程よい距離感で自然に打ち解けられる）',
  holiday: '祝日・特別な日',
}

const TRANSPORT_LABELS: Record<string, string> = {
  train: '電車・地下鉄',
  taxi: 'タクシー',
  car: '車',
  walk: '徒歩',
}

const WEATHER_LABELS: Record<string, string> = {
  sunny: '晴れ（屋外スポット優先）',
  cloudy: '曇り（屋内・屋外どちらも可）',
  rainy: '雨（屋内スポット中心、移動最小化）',
  any: '天候問わず',
}

const GENRE_LABELS: Record<string, string> = {
  gourmet: 'グルメ',
  cafe: 'カフェ',
  nature: '自然・公園',
  art: 'アート・美術館',
  shopping: 'ショッピング',
  activity: 'アクティビティ',
  movie: '映画',
  amusement: '遊園地・アミューズメント',
  sightseeing: '観光・歴史',
  night_view: '夜景',
}

const AGE_LABELS: Record<string, string> = {
  teens: '10代',
  twenties: '20代',
  thirties: '30代',
  forties_plus: '40代以上',
}

const GENDER_LABELS: Record<string, string> = {
  male_female: '男女',
  male_male: '男性同士',
  female_female: '女性同士',
  mixed: '混合',
}

/** プロンプトインジェクション対策：ユーザー入力の改行・制御文字を除去して長さ制限 */
function sanitizeForPrompt(input: string, maxLength = 100): string {
  return input
    .replace(/[\n\r\t]/g, ' ')
    .replace(/[<>]/g, '')
    .slice(0, maxLength)
    .trim()
}

export function buildDatePlanPrompt(conditions: PlanConditions): string {
  const safeLocation = sanitizeForPrompt(conditions.location, 50)
  const transportList = conditions.transport
    .map((t) => TRANSPORT_LABELS[t])
    .join('・')
  const genrePrefs = conditions.genre_preferences
    .map((g) => GENRE_LABELS[g])
    .join('・')
  const genreNG = conditions.genre_ng.map((g) => GENRE_LABELS[g]).join('・')

  const totalBudget = conditions.budget_per_person * conditions.people_count

  return `あなたは${AREA_LABELS[conditions.area]}の地元事情に精通したデートプランナーです。
実際に存在する人気店・スポットを使って、記憶に残るデートプランをJSON形式で作成してください。

【基本条件】
エリア: ${AREA_LABELS[conditions.area]}（出発地点・希望エリア: ${safeLocation}）
人数: ${conditions.people_count}人 / 年齢層: ${AGE_LABELS[conditions.age_group]} / 性別: ${GENDER_LABELS[conditions.gender_combo]}
関係性: ${RELATIONSHIP_LABELS[conditions.relationship]}
シーン: ${SCENE_LABELS[conditions.scene]}
開始時間: ${conditions.time_start} / 所要時間: ${conditions.duration_hours}時間
移動手段: ${transportList}
天候: ${WEATHER_LABELS[conditions.weather]}
予算: 一人あたり${conditions.budget_per_person.toLocaleString()}円（総額${totalBudget.toLocaleString()}円以内）
${genrePrefs ? `希望ジャンル: ${genrePrefs}` : ''}
${genreNG ? `NGジャンル: ${genreNG}` : ''}

【必須ルール】
1. 実在するスポット・店舗のみ使用（架空の場所・閉店済みの可能性が高い店は禁止）
2. 指定した移動手段のみ使用
3. 全スポットの合計費用が予算（一人${conditions.budget_per_person.toLocaleString()}円）以内に収まること
4. 移動時間を含めた時間配分を現実的にすること（移動10〜20分なら所要時間に含める）
5. 天候条件に合ったスポットを選ぶこと（雨なら屋内中心）
6. 関係性・シーンに合った雰囲気のスポットを選ぶこと

【質の高いプランの条件】
- タイトルは具体的で魅力的に（例:「栄レトロ喫茶から夜の納屋橋まで、大人の名古屋デート」）
- 各スポットの説明は、なぜそこがこの二人に合っているかを含める（雰囲気・特徴・おすすめポイント）
- スポット同士の流れが自然でストーリー性があること（午前→ランチ→午後→夜など）
- tipsはデートをより特別にする具体的なアドバイス（予約方法・おすすめメニュー・ベストな時間帯など）

【出力形式】
JSONのみを出力してください（説明文・コードブロック・マークダウン不要）:
{
  "title": "プランのタイトル（30文字以内）",
  "summary": "このプランの魅力を伝える概要（2〜3文・読んでワクワクする内容に）",
  "timeline": [
    {
      "time": "10:00",
      "duration": "90分",
      "place": "スポット名（正式名称）",
      "category": "食事|カフェ|観光|ショッピング|アクティビティ|夜景",
      "description": "場所の説明・雰囲気・この二人におすすめの理由（2〜3文）",
      "transport_to_next": "次の場所への移動手段と所要時間（例: 地下鉄で約10分）。最後のスポットは空文字",
      "estimated_cost": 1500
    }
  ],
  "total_estimated_cost": 8500,
  "tips": [
    "具体的で実用的なアドバイス（予約・ベストシーズン・隠れたポイントなど）"
  ]
}
`
}

export function buildSpotReplacePrompt(
  conditions: PlanConditions,
  timeline: PlanSpot[],
  spotIndex: number
): string {
  const transportList = conditions.transport.map((t) => TRANSPORT_LABELS[t]).join('・')
  const currentSpot = timeline[spotIndex]
  const prevSpot = spotIndex > 0 ? timeline[spotIndex - 1] : null
  const nextSpot = spotIndex < timeline.length - 1 ? timeline[spotIndex + 1] : null

  const timelineContext = timeline
    .map((s, i) => {
      const marker = i === spotIndex ? '[差し替え対象]' : ''
      return '  ' + marker + ' ' + s.time + ' ' + s.place + '(' + s.category + ')'
    })
    .join('\n')

  const prevLine = prevSpot ? ('前のスポット: ' + prevSpot.place) : 'プランの最初'
  const nextLine = nextSpot ? ('次のスポット: ' + nextSpot.place) : 'プランの最後'
  const transportToNext = nextSpot ? ('次の' + nextSpot.place + 'への移動手段と所要時間') : ''

  const lines = [
    'あなたは' + AREA_LABELS[conditions.area] + 'の地元事情に精通したデートプランナーです。',
    '以下のデートプランの中の1スポットを、より良い別のスポットに差し替えてください。',
    '',
    '【元のプランの流れ】',
    timelineContext,
    '',
    '【差し替え対象スポット】',
    '時間: ' + currentSpot.time + ' (' + currentSpot.duration + ')',
    '場所: ' + currentSpot.place + ' (' + currentSpot.category + ')',
    prevLine,
    nextLine,
    '',
    '【条件】',
    'エリア: ' + AREA_LABELS[conditions.area],
    '関係性: ' + RELATIONSHIP_LABELS[conditions.relationship],
    '移動手段: ' + transportList,
    '天候: ' + WEATHER_LABELS[conditions.weather],
    '予算(一人): ' + conditions.budget_per_person.toLocaleString() + '円',
    '',
    '【ルール】',
    '- ' + currentSpot.place + 'とは異なるスポットを提案すること（同カテゴリでも別スポット）',
    '- 同じ時間帯・時刻を維持すること(' + currentSpot.time + '開始)',
    '- 前後のスポットとの流れを自然につなぐこと',
    '- 実在するスポット・店舗のみ使用すること',
    '- なぜこのスポットがこの二人に合っているかを説明に含めること',
    '',
    '【出力形式】',
    '以下のJSONのみを出力してください(説明文・コードブロック不要):',
    '{',
    '  "time": "' + currentSpot.time + '",',
    '  "duration": "XX分",',
    '  "place": "スポット名（正式名称）",',
    '  "category": "食事|カフェ|観光|ショッピング|アクティビティ|夜景",',
    '  "description": "場所の説明・雰囲気・この二人におすすめの理由(2〜3文)",',
    '  "transport_to_next": "' + transportToNext + '",',
    '  "estimated_cost": 0',
    '}',
  ]
  return lines.join('\n')
}
