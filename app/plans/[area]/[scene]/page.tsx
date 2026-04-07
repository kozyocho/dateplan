import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-static'

const AREAS = {
  nagoya: { label: '名古屋', slug: 'nagoya' },
  tokyo: { label: '東京', slug: 'tokyo' },
} as const

type AreaKey = keyof typeof AREAS

type SceneData = {
  label: string
  title: (areaLabel: string) => string
  description: (areaLabel: string) => string
  subtext: (areaLabel: string) => string
  spots: {
    nagoya: Array<{ name: string; desc: string; tags: string[] }>
    tokyo: Array<{ name: string; desc: string; tags: string[] }>
  }
  steps: Array<{ step: string; title: string; desc: string }>
  faqs: {
    nagoya: Array<{ q: string; a: string }>
    tokyo: Array<{ q: string; a: string }>
  }
  seoTitle: (areaLabel: string) => string
  seoDescription: (areaLabel: string) => string
  keywords: (areaLabel: string) => string[]
}

const SCENE_DATA: Record<string, SceneData> = {
  rainy: {
    label: '雨の日',
    title: (area) => `${area}の雨の日デート、AIが提案`,
    description: (area) => `${area}の雨の日でも楽しめるデートプランをAIが提案。屋内スポット・カフェ・水族館など雨でも快適に過ごせるコースをタイムライン形式で生成します。`,
    subtext: (area) => `天気が悪くても大丈夫。AIが${area}の屋内スポットを組み合わせた最適なプランを提案します。`,
    spots: {
      nagoya: [
        { name: '名古屋港水族館', desc: 'シャチのパフォーマンスが人気。雨の日でも一日楽しめる大型水族館。', tags: ['屋内', 'アクティビティ', '観光'] },
        { name: 'リニア・鉄道館', desc: '日本最大級の鉄道博物館。乗り物好きはもちろん、カップルにも人気。', tags: ['屋内', '観光', '博物館'] },
        { name: '名古屋市科学館プラネタリウム', desc: '世界最大級のドームで星空を楽しむ。デートにぴったりの没入体験。', tags: ['屋内', 'プラネタリウム', 'デート'] },
        { name: '大須商店街（アーケード）', desc: 'アーケード完備で雨でも快適な食べ歩き。独特の雰囲気が楽しめる。', tags: ['屋内', 'グルメ', '食べ歩き'] },
      ],
      tokyo: [
        { name: '国立新美術館', desc: '建築も美しい大型美術館。企画展が充実しており、雨の日のデートに最適。', tags: ['屋内', 'アート', '観光'] },
        { name: '東京スカイツリー', desc: '雨の日でも展望台から景色を楽しめる。カフェやショッピングも充実。', tags: ['屋内', '展望台', 'デート'] },
        { name: '六本木ヒルズ', desc: '映画・アート・レストランが揃う複合施設。雨の日でも一日過ごせる。', tags: ['屋内', '観光', 'グルメ'] },
        { name: '渋谷スクランブルスクエア', desc: '展望施設・カフェ・ショッピングが一棟に。雨でも快適なデートスポット。', tags: ['屋内', 'ショッピング', 'カフェ'] },
      ],
    },
    steps: [
      { step: '01', title: '天候で「雨」を選択', desc: 'AIが自動的に屋内スポットと雨でも快適なルートを優先提案します。' },
      { step: '02', title: 'エリア・予算・移動手段を設定', desc: '徒歩圏内でまとめるか、電車移動かなど細かく設定できます。' },
      { step: '03', title: '30秒で雨の日プラン完成', desc: '雨でも充実した一日になるタイムラインが自動生成されます。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋の雨の日デートでおすすめのスポットは？', a: '名古屋港水族館・リニア鉄道館・科学館プラネタリウムが定番。大須商店街はアーケードがあるので食べ歩きも可能。栄周辺のショッピングモールも雨でも快適に過ごせます。' },
        { q: '名古屋の雨の日デートの予算は？', a: '水族館（大人2,030円）・科学館（800円）など比較的リーズナブル。一人あたり5,000〜10,000円で充実した一日が過ごせます。AIプランで予算を設定すれば自動で最適化されます。' },
        { q: '名古屋の雨の日デートで移動はどうする？', a: '名古屋は地下鉄が充実しており、主要な屋内スポットはほとんど電車でアクセス可能。タクシーを使えばさらに快適です。AIプランで移動手段を設定すると雨でも楽なルートを提案します。' },
      ],
      tokyo: [
        { q: '東京の雨の日デートでおすすめのスポットは？', a: '六本木の美術館・スカイツリー・渋谷スクランブルスクエアなどの複合施設が人気。映画鑑賞→カフェ→ディナーの流れも雨の日定番コースです。' },
        { q: '東京の雨の日デートの予算は？', a: 'スカイツリー展望台（2,100円〜）や美術館（1,500円〜）など。ランチ・カフェと組み合わせて一人8,000〜15,000円が目安。AIプランで細かく予算設定できます。' },
        { q: '東京の雨の日デートで子供と行けるスポットは？', a: '上野の国立科学博物館・お台場の科学未来館・品川水族館などが人気。AIプランで「ファミリー」条件を選択するとお子さん向けスポットを優先提案します。' },
      ],
    },
    seoTitle: (area) => `${area}の雨の日デートプラン | 屋内スポット・コースをAIが提案`,
    seoDescription: (area) => `${area}の雨の日でも楽しめるデートプランをAIが自動生成。水族館・美術館・プラネタリウムなど屋内スポットをタイムライン形式で提案。無料で月3プランまで。`,
    keywords: (area) => [`${area} 雨の日 デート`, `${area} 雨 デートプラン`, `${area} 屋内 デート`, `${area} 雨 カップル`, `${area} 雨の日 おでかけ`],
  },

  anniversary: {
    label: '記念日',
    title: (area) => `${area}の記念日デート、AIが特別プランを提案`,
    description: (area) => `${area}での記念日・誕生日・クリスマスなど特別な日のデートプランをAIが提案。サプライズ演出からディナー予約まで、忘れられない一日をプランニング。`,
    subtext: (area) => `記念日は失敗できない。AIが${area}の特別なスポットとサプライズ演出を組み合わせたプランを提案します。`,
    spots: {
      nagoya: [
        { name: '覚王山 La Bonne Table', desc: 'フランス料理の名店。特別な記念日ディナーに最適なロマンティックな雰囲気。', tags: ['ディナー', 'フレンチ', '記念日'] },
        { name: '名古屋城ライトアップ', desc: '夜の名古屋城は幻想的。特別な夜のデートに最適なフォトスポット。', tags: ['夜景', '観光', 'フォト'] },
        { name: 'ヒルトン名古屋 スカイラウンジ', desc: '名古屋の夜景を一望できるラウンジ。記念日の乾杯に最高の空間。', tags: ['夜景', 'バー', '記念日'] },
        { name: '栄の花屋でブーケ購入', desc: '記念日に手渡すフラワーブーケ。栄周辺には素敵な花屋が揃っています。', tags: ['サプライズ', 'フラワー', 'ギフト'] },
      ],
      tokyo: [
        { name: '恵比寿ガーデンプレイス', desc: 'バカラのシャンデリアで有名な冬のイルミネーション。記念日に欠かせないスポット。', tags: ['夜景', 'イルミネーション', '記念日'] },
        { name: '六本木ヒルズ展望台 東京シティビュー', desc: '東京の夜景を360度一望。サプライズプロポーズにも人気の場所。', tags: ['夜景', '展望台', 'デート'] },
        { name: '表参道 ロブション', desc: 'ミシュラン星付きフランス料理。特別な記念日に相応しい最高峰のディナー。', tags: ['ディナー', 'フレンチ', '高級'] },
        { name: 'お台場 夜景クルーズ', desc: 'レインボーブリッジを水上から楽しむクルーズ。非日常の記念日体験。', tags: ['クルーズ', '夜景', 'ロマンティック'] },
      ],
    },
    steps: [
      { step: '01', title: '記念日・特別な日を選択', desc: '誕生日・付き合った記念日・クリスマスなど、シーンに合わせたプランに。' },
      { step: '02', title: '予算・こだわりを設定', desc: '高級ディナー重視・フォトスポット巡り・サプライズ演出ありなど細かく設定。' },
      { step: '03', title: '特別な一日のプラン完成', desc: '忘れられない記念日になるタイムラインをAIが自動生成します。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋で記念日デートにおすすめのレストランは？', a: '覚王山エリアのフレンチ・イタリアン、栄の高層レストラン、名古屋駅周辺のホテルダイニングが人気。予算10,000円〜20,000円で特別な夜が過ごせます。AIプランで「記念日」設定すると自動でおすすめを提案します。' },
        { q: '名古屋での記念日デートの流れは？', a: 'ランチ→観光・カフェ巡り→夕暮れのフォトスポット→特別ディナーが定番コース。AIプランでは時間・移動・予算を考慮した最適な流れを自動生成します。' },
        { q: '名古屋でサプライズ演出をするには？', a: 'レストランへの事前連絡（バースデープレート・花束手配）や夜景スポットでのサプライズが定番。AIプランで「サプライズあり」を設定すると演出のタイミングも提案します。' },
      ],
      tokyo: [
        { q: '東京で記念日デートにおすすめのコースは？', a: '昼間は表参道・銀座でショッピング、夕方から六本木や恵比寿で夜景＋ディナーが人気の記念日コース。AIプランで「記念日」を選ぶとロマンティックな動線を提案します。' },
        { q: '東京での記念日デートの予算は？', a: 'ランチ・カフェ・ディナー・交通費合わせて一人15,000〜30,000円が目安。特別感を出すにはディナーに多めの予算を配分するのがおすすめです。' },
        { q: '東京でプロポーズするのにおすすめのスポットは？', a: '六本木ヒルズ展望台・東京タワー展望台・お台場夜景クルーズが人気プロポーズスポット。AIプランで「プロポーズ」と設定するとサプライズ演出のタイミングも含めたプランを提案します。' },
      ],
    },
    seoTitle: (area) => `${area}の記念日デートプラン | サプライズ演出・特別ディナーをAIが提案`,
    seoDescription: (area) => `${area}の記念日・誕生日・クリスマスデートプランをAIが自動生成。サプライズ演出からロマンティックディナーまで、特別な一日をタイムライン形式で提案。`,
    keywords: (area) => [`${area} 記念日 デート`, `${area} 誕生日 デート`, `${area} 記念日 コース`, `${area} 記念日 レストラン`, `${area} プロポーズ スポット`],
  },

  'first-date': {
    label: '初デート',
    title: (area) => `${area}の初デートプラン、AIが提案`,
    description: (area) => `${area}での初デートに最適なプランをAIが提案。緊張をほぐしながら距離が縮まる、鉄板コースをタイムライン形式で提案します。`,
    subtext: (area) => `初デートは雰囲気と距離感が大事。AIが${area}の定番コースで自然に打ち解けるプランを提案します。`,
    spots: {
      nagoya: [
        { name: '覚王山カフェ巡り', desc: 'おしゃれなカフェが揃う覚王山。初デートの会話が弾む落ち着いた雰囲気。', tags: ['カフェ', '初デート', 'おしゃれ'] },
        { name: '大須商店街散策', desc: 'レトロで個性的な大須はネタ豊富。初デートの話題作りに最適。', tags: ['観光', '食べ歩き', '初デート'] },
        { name: '栄・ランチスポット', desc: '選択肢が豊富な栄でのランチ。お互いの好みを探りながら選ぶのも初デートの醍醐味。', tags: ['グルメ', 'ランチ', '初デート'] },
        { name: '名古屋市美術館', desc: '一緒にアートを見る体験は距離が縮まりやすい。感想を言い合えるデートに。', tags: ['アート', '屋内', 'デート'] },
      ],
      tokyo: [
        { name: '表参道・ランチカフェ', desc: 'おしゃれで話しやすい雰囲気。初デートの鉄板スポット。', tags: ['カフェ', 'ランチ', '初デート'] },
        { name: '原宿・竹下通り散策', desc: '個性的なショップを一緒に見て回るだけで会話が弾む初デートに◎。', tags: ['散策', 'ショッピング', '初デート'] },
        { name: '代官山 蔦屋書店', desc: 'おしゃれな本屋でお互いの趣味を探る。自然な会話のきっかけに。', tags: ['カフェ', 'おしゃれ', '初デート'] },
        { name: '恵比寿ガーデンプレイス', desc: '程よい散策距離でプレッシャーなく過ごせる初デートの定番エリア。', tags: ['散策', '観光', '初デート'] },
      ],
    },
    steps: [
      { step: '01', title: '「初デート」シーンを選択', desc: '緊張しにくい動線・適度な距離感のスポットをAIが優先的に提案します。' },
      { step: '02', title: '相手の雰囲気・好みを設定', desc: 'アクティブ系・カフェ派・アート好きなど相手の傾向を入力して最適化。' },
      { step: '03', title: '初デート成功のプラン完成', desc: '自然に距離が縮まるタイムラインをAIが自動生成します。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋で初デートにおすすめのエリアは？', a: '覚王山・大須・栄が初デートの定番エリア。覚王山はおしゃれで落ち着いた雰囲気、大須は話題が尽きない、栄は多彩な選択肢が魅力。AIプランで相手の好みに合わせて最適エリアを選択できます。' },
        { q: '名古屋の初デートの所要時間は？', a: 'ランチから夕方まで4〜6時間が初デートの目安。長すぎず短すぎず、余韻を残して終わるのがポイント。AIプランで「4時間コース」「6時間コース」など時間設定が可能です。' },
        { q: '名古屋の初デートで失敗しないポイントは？', a: '予約が必要なレストランは事前確保・アクセスが便利な場所を選ぶ・次の約束に繋がる話題を用意する。AIプランでは移動の無駄を省き、自然な流れになるよう最適化します。' },
      ],
      tokyo: [
        { q: '東京で初デートにおすすめのエリアは？', a: '表参道・原宿・代官山・恵比寿が初デートで人気のエリア。おしゃれで話しやすい雰囲気が揃っており、会話に困りません。AIプランで相手の好みに合わせて提案します。' },
        { q: '東京の初デートの予算はいくら？', a: '一人5,000〜10,000円が目安。ランチ（1,500〜3,000円）＋カフェ（800〜1,500円）＋散策がスタンダード。AIプランで予算設定すれば最適なスポットを提案します。' },
        { q: '東京の初デートで会話が弾むコツは？', a: 'アートや本屋など「感想を言いやすい場所」を入れると自然に話が続きます。代官山 蔦屋書店・国立新美術館などがおすすめ。AIプランで「会話が弾む場所重視」の設定も可能です。' },
      ],
    },
    seoTitle: (area) => `${area}の初デートプラン | 距離が縮まるコースをAIが提案`,
    seoDescription: (area) => `${area}での初デートに失敗しないプランをAIが自動生成。緊張をほぐし自然に距離が縮まるスポットをタイムライン形式で提案。無料で月3プランまで。`,
    keywords: (area) => [`${area} 初デート`, `${area} 初デート プラン`, `${area} 初デート スポット`, `${area} デート 初めて`, `${area} カップル 初デート`],
  },

  night: {
    label: '夜デート',
    title: (area) => `${area}の夜デート・ナイトデートプラン、AIが提案`,
    description: (area) => `${area}での夜デート・ナイトデートプランをAIが提案。夜景スポット・バー・ディナーをタイムライン形式で提案。特別な夜の時間を演出します。`,
    subtext: (area) => `夜の${area}は昼とは違う魅力がある。AIが夜景・バー・ディナーを組み合わせた最高の夜プランを提案します。`,
    spots: {
      nagoya: [
        { name: '名古屋テレビ塔 スカイデッキ', desc: '栄のシンボルから360度の夜景を楽しめる。夜デートの定番スポット。', tags: ['夜景', '展望台', 'デート'] },
        { name: '錦三丁目バーストリート', desc: 'おしゃれなバーが集まる錦三。二人でバー巡りも夜デートの醍醐味。', tags: ['バー', '夜', 'ナイト'] },
        { name: 'ヒルトン名古屋 スカイラウンジ', desc: '名古屋の夜景を一望しながらカクテルを。特別な夜の雰囲気に。', tags: ['夜景', 'バー', '高級'] },
        { name: '名古屋港 夜景スポット', desc: '港の夜景はロマンティック。ドライブデートにも最適なビュースポット。', tags: ['夜景', 'ドライブ', 'デート'] },
      ],
      tokyo: [
        { name: 'お台場 夜景・レインボーブリッジ', desc: '東京を代表する夜景スポット。夜デートの定番中の定番。', tags: ['夜景', '観光', 'デート'] },
        { name: '六本木ヒルズ 東京シティビュー', desc: '東京の全体を一望できる夜景。特別な夜デートに最高の景色。', tags: ['夜景', '展望台', '高級'] },
        { name: '銀座 Bar巡り', desc: '大人の夜デートなら銀座のバー。洗練された雰囲気の中で特別な夜を。', tags: ['バー', '銀座', '大人'] },
        { name: '恵比寿ガーデンプレイス 夜景', desc: 'バカラのシャンデリアが輝く冬のイルミネーション。夜デートの聖地。', tags: ['夜景', 'イルミネーション', 'デート'] },
      ],
    },
    steps: [
      { step: '01', title: '「夜デート」シーンを選択', desc: '夜景・ナイトスポット・バー・ディナーを優先したプランにAIが最適化。' },
      { step: '02', title: '開始時間・予算を設定', desc: '18時スタートか19時スタートか、ディナー重視かバー巡り重視かなど設定。' },
      { step: '03', title: '特別な夜のプラン完成', desc: '夜景・ディナー・バーを組み合わせた夜デートのタイムラインが完成。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋で夜デートにおすすめのスポットは？', a: '名古屋テレビ塔スカイデッキ・ヒルトン名古屋スカイラウンジ・錦三のバーストリートが夜デートの定番。ディナー後にバーへというコースが人気です。' },
        { q: '名古屋の夜デートの予算は？', a: 'ディナー（一人5,000〜10,000円）＋バー（一人2,000〜4,000円）で合計一人8,000〜15,000円が目安。AIプランで予算設定すると最適なスポットを提案します。' },
        { q: '名古屋で夜景が見られるスポットは？', a: 'テレビ塔スカイデッキ・ヒルトン名古屋・名古屋港ガーデン埠頭・東山スカイタワーなどが代表的。AIプランで「夜景重視」の設定が可能です。' },
      ],
      tokyo: [
        { q: '東京で夜デートにおすすめのスポットは？', a: 'お台場・六本木ヒルズ展望台・恵比寿ガーデンプレイスが東京夜デートの三大定番。銀座のバー巡りや渋谷の夜景スポットも人気です。' },
        { q: '東京の夜デートの予算は？', a: '夜景スポット入場料（1,000〜2,100円）＋ディナー（5,000〜15,000円）＋バー（2,000〜5,000円）で一人10,000〜25,000円が目安。' },
        { q: '東京で夜デートにおすすめの移動手段は？', a: '電車が基本ですが、お台場や夜景スポットを複数まわるならタクシーが便利。AIプランで移動手段を設定すれば夜の移動も最適化されます。' },
      ],
    },
    seoTitle: (area) => `${area}の夜デート・ナイトデートプラン | 夜景スポットをAIが提案`,
    seoDescription: (area) => `${area}の夜デートプランをAIが自動生成。夜景スポット・バー・特別ディナーをタイムライン形式で提案。特別な夜のデートコースが30秒で完成。`,
    keywords: (area) => [`${area} 夜デート`, `${area} ナイトデート`, `${area} 夜景 デート`, `${area} バー デート`, `${area} 夜 カップル`],
  },

  cheap: {
    label: '節約・コスパ',
    title: (area) => `${area}の節約デート・コスパデートプラン、AIが提案`,
    description: (area) => `${area}でのお財布に優しい節約デートプランをAIが提案。無料スポット・コスパ抜群のグルメを組み合わせたタイムラインで、少ない予算でも充実したデートを。`,
    subtext: (area) => `お金をかけなくても楽しいデートはできる。AIが${area}の無料・格安スポットを組み合わせた最高のコスパプランを提案します。`,
    spots: {
      nagoya: [
        { name: '名古屋城 無料外観見学', desc: '入場しなくても外観からシャチホコを拝める。無料で楽しめる名古屋観光。', tags: ['無料', '観光', 'フォト'] },
        { name: '熱田神宮', desc: '日本三大神宮のひとつ。広大な境内を二人で散策。入場無料。', tags: ['無料', '観光', '散策'] },
        { name: '大須商店街グルメ食べ歩き', desc: '100〜300円の食べ歩きグルメが充実。少額で満喫できる名古屋らしいデート。', tags: ['グルメ', '食べ歩き', 'コスパ'] },
        { name: '鶴舞公園', desc: '無料の広大な公園。お花見・ピクニック・散策が楽しめる。', tags: ['無料', '公園', 'ピクニック'] },
      ],
      tokyo: [
        { name: '新宿御苑（一般500円）', desc: '広大な国民公園でピクニック。一人500円で半日楽しめる超コスパスポット。', tags: ['公園', 'ピクニック', 'コスパ'] },
        { name: '浅草・仲見世通り', desc: '食べ歩き・観光がコスパ抜群。150〜400円の和スイーツで楽しめる。', tags: ['食べ歩き', '観光', 'コスパ'] },
        { name: '上野公園（無料）', desc: '広大な公園で美術館・動物園・ランチピクニックが全部楽しめる。', tags: ['無料', '公園', '観光'] },
        { name: '谷根千散策', desc: '下町の雰囲気を楽しむ無料散策コース。レトロなカフェも500〜800円で楽しめる。', tags: ['無料', '散策', 'コスパ'] },
      ],
    },
    steps: [
      { step: '01', title: '「節約デート」または予算を設定', desc: '「一人3,000円以内」など細かく予算設定するとAIが最適なプランを提案。' },
      { step: '02', title: '無料・格安スポットを優先設定', desc: '入場無料の公園・神社・無料展示などを組み合わせた充実プランに。' },
      { step: '03', title: 'コスパ最強プランが完成', desc: '少ない予算でも楽しい一日になるタイムラインをAIが自動生成します。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋で節約デートをするには？', a: '熱田神宮・鶴舞公園などの無料スポット＋大須の食べ歩きで一人2,000〜3,000円でも充実したデートが可能。AIプランで予算を設定すると無料・格安スポットを優先提案します。' },
        { q: '名古屋で一人3,000円以内のデートは可能？', a: '可能です。無料の公園・神社の散策＋大須食べ歩き（1,000円）＋格安カフェ（500円）＋コンビニランチなら3,000円以内で十分楽しめます。AIプランで細かく予算設定できます。' },
        { q: '名古屋のコスパ最強のデートスポットは？', a: '熱田神宮（無料）・鶴舞公園（無料）・大須商店街の食べ歩き（〜1,000円）・名古屋市科学館のプラネタリウム（800円）などがコスパ抜群。' },
      ],
      tokyo: [
        { q: '東京で節約デートをするには？', a: '新宿御苑・上野公園・谷根千散策など無料〜格安スポットが充実。一人3,000〜5,000円でも十分楽しいデートができます。AIプランで低予算設定が可能です。' },
        { q: '東京で一人5,000円以内のデートは可能？', a: '可能です。上野公園散策（無料）＋浅草食べ歩き（1,000円）＋カフェ（800円）＋格安ランチ（1,200円）で5,000円以内に収まります。' },
        { q: '東京のコスパ最強のデートスポットは？', a: '新宿御苑（500円）・上野公園（無料）・浅草仲見世（食べ歩き300〜500円）・谷根千（無料散策）が東京のコスパ最強デートスポット。' },
      ],
    },
    seoTitle: (area) => `${area}の節約デート・コスパデートプラン | 格安コースをAIが提案`,
    seoDescription: (area) => `${area}での節約デート・コスパデートプランをAIが自動生成。無料スポット・格安グルメを組み合わせた充実プランをタイムライン形式で提案。`,
    keywords: (area) => [`${area} 節約デート`, `${area} コスパ デート`, `${area} 安い デート`, `${area} 格安 デートプラン`, `${area} 無料 デートスポット`],
  },

  outdoor: {
    label: 'アウトドア・外デート',
    title: (area) => `${area}のアウトドアデート・外デートプラン、AIが提案`,
    description: (area) => `${area}でのアウトドアデート・外デートプランをAIが提案。公園・ハイキング・ピクニックなど自然の中で楽しめるデートコースをタイムライン形式で提案します。`,
    subtext: (area) => `晴れた日は外に出よう。AIが${area}の公園・自然スポットを組み合わせた最高のアウトドアプランを提案します。`,
    spots: {
      nagoya: [
        { name: '東山動植物園', desc: '動物園＋植物園の複合施設。広大な敷地でのんびり過ごせる定番デートスポット。', tags: ['公園', '自然', 'アウトドア'] },
        { name: '庄内緑地公園', desc: 'バーベキューができる大型公園。ピクニックデートに最適。', tags: ['公園', 'ピクニック', 'BBQ'] },
        { name: '名城公園', desc: '名古屋城を望む広大な公園。桜・新緑・紅葉と季節ごとに表情が変わる。', tags: ['公園', '自然', '散策'] },
        { name: '矢作川河川敷ウォーキング', desc: '自然の中を二人で歩くだけで特別なデートに。気軽なアウトドア体験。', tags: ['散策', '自然', 'ウォーキング'] },
      ],
      tokyo: [
        { name: '高尾山ハイキング', desc: '東京から1時間でアクセスできる本格ハイキング。自然の中で距離が縮まる。', tags: ['ハイキング', '自然', 'アウトドア'] },
        { name: '代々木公園ピクニック', desc: '都心にある広大な公園でピクニック。ブルーシートを広げてのんびり過ごす。', tags: ['公園', 'ピクニック', '無料'] },
        { name: '昭和記念公園（立川）', desc: '広大な国営公園。サイクリング・ピクニック・バーベキューが楽しめる。', tags: ['公園', 'BBQ', 'サイクリング'] },
        { name: '江の島・鎌倉デート', desc: '東京から日帰りで行ける海デート。江ノ電でのんびり移動も楽しい。', tags: ['海', '観光', 'アウトドア'] },
      ],
    },
    steps: [
      { step: '01', title: '「アウトドア」シーンを選択', desc: '公園・ハイキング・ピクニック・BBQなどアウトドア系スポットをAIが優先提案。' },
      { step: '02', title: 'アクティビティ・季節を設定', desc: '春の花見・夏の海・秋のハイキングなど季節に合わせた設定が可能。' },
      { step: '03', title: '外デートのプラン完成', desc: '自然の中で充実した一日になるタイムラインをAIが自動生成します。' },
    ],
    faqs: {
      nagoya: [
        { q: '名古屋でアウトドアデートにおすすめのスポットは？', a: '東山動植物園・庄内緑地公園・名城公園が定番。BBQがしたいなら庄内緑地公園が設備充実でおすすめ。AIプランで季節・アクティビティを設定して最適なスポットを提案します。' },
        { q: '名古屋でピクニックデートができる場所は？', a: '名城公園・庄内緑地公園・白川公園などが人気のピクニックスポット。持参するお弁当の調達場所もAIプランで提案できます。' },
        { q: '名古屋近郊でハイキングデートはできる？', a: '猿投山・東海自然歩道など名古屋近郊でも手軽なハイキングが楽しめます。AIプランで「ハイキング」を設定すれば近郊エリアも提案します。' },
      ],
      tokyo: [
        { q: '東京でアウトドアデートにおすすめのスポットは？', a: '高尾山・代々木公園・昭和記念公園・江の島が東京アウトドアデートの定番。電車でアクセスできるスポットも多く便利。AIプランでアクティビティを設定して提案します。' },
        { q: '東京で日帰りアウトドアデートはできる？', a: '高尾山（電車1時間）・江の島・鎌倉（電車1時間〜）などへの日帰りアウトドアデートが人気。AIプランで「日帰り遠出」設定も可能です。' },
        { q: '東京でBBQデートができる場所は？', a: '昭和記念公園（立川）・江戸川区BBQ場・葛西臨海公園などが東京近郊のBBQデートスポット。AIプランで「BBQあり」を設定すれば食材調達から含めたプランを提案します。' },
      ],
    },
    seoTitle: (area) => `${area}のアウトドアデートプラン | 公園・ハイキング・ピクニックをAIが提案`,
    seoDescription: (area) => `${area}のアウトドアデート・外デートプランをAIが自動生成。公園ピクニック・ハイキング・BBQなど自然を楽しむデートコースをタイムライン形式で提案。`,
    keywords: (area) => [`${area} アウトドアデート`, `${area} 外 デート`, `${area} ピクニック デート`, `${area} ハイキング デート`, `${area} 公園 デート`],
  },
}

type Scene = keyof typeof SCENE_DATA

type Props = {
  params: Promise<{ area: string; scene: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area, scene } = await params
  const areaData = AREAS[area as AreaKey]
  const sceneData = SCENE_DATA[scene as Scene]
  if (!areaData || !sceneData) return {}

  const areaLabel = areaData.label

  return {
    title: sceneData.seoTitle(areaLabel),
    description: sceneData.seoDescription(areaLabel),
    keywords: sceneData.keywords(areaLabel),
    openGraph: {
      type: 'website',
      title: sceneData.seoTitle(areaLabel),
      description: sceneData.seoDescription(areaLabel),
    },
    alternates: {
      canonical: `/plans/${area}/${scene}`,
    },
  }
}

export function generateStaticParams() {
  const areas = Object.keys(AREAS)
  const scenes = Object.keys(SCENE_DATA)
  return areas.flatMap((area) => scenes.map((scene) => ({ area, scene })))
}

export default async function AreaScenePlanPage({ params }: Props) {
  const { area, scene } = await params
  const areaData = AREAS[area as AreaKey]
  const sceneData = SCENE_DATA[scene as Scene]
  if (!areaData || !sceneData) notFound()

  const areaLabel = areaData.label
  const spots = sceneData.spots[area as AreaKey]
  const faqs = sceneData.faqs[area as AreaKey]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FDF2F8 0%, #FCE7F3 40%, #FFF1F2 100%)' }}>
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between max-w-5xl mx-auto border-b border-pink-100 bg-white/70 backdrop-blur-sm">
        <Link href="/" className="text-lg font-semibold text-rose-800" style={{ fontFamily: 'var(--font-heading), serif', letterSpacing: '0.02em' }}>
          dateplan
        </Link>
        <Link href="/login">
          <Button variant="outline" size="sm" className="border-pink-200 text-rose-700 hover:bg-pink-50">
            ログイン
          </Button>
        </Link>
      </header>

      {/* Breadcrumb */}
      <nav className="px-5 py-3 max-w-5xl mx-auto">
        <ol className="flex items-center gap-2 text-xs text-rose-400">
          <li><Link href="/" className="hover:text-rose-500 transition-colors">トップ</Link></li>
          <li>/</li>
          <li><Link href={`/plans/${area}`} className="hover:text-rose-500 transition-colors">{areaLabel}のデートプラン</Link></li>
          <li>/</li>
          <li className="text-rose-600">{sceneData.label}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="px-5 py-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-rose-600 text-xs font-medium px-4 py-1.5 rounded-full mb-5 border border-pink-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
          {areaLabel} × {sceneData.label}
        </div>
        <h1 className="text-4xl font-semibold text-rose-900 leading-tight mb-4" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {sceneData.title(areaLabel)}
        </h1>
        <p className="text-rose-700/70 mb-8 text-base leading-relaxed">{sceneData.subtext(areaLabel)}</p>
        <Link href="/generate">
          <Button size="lg" className="px-10 py-6 text-base border-0 shadow-lg text-white" style={{ background: 'linear-gradient(135deg, #DB2777, #be185d)', boxShadow: '0 8px 24px rgba(219,39,119,0.3)' }}>
            無料で{areaLabel}の{sceneData.label}プランを作る
          </Button>
        </Link>
        <p className="text-xs text-rose-400 mt-3">無料で月3プランまで · カード登録不要</p>
      </section>

      {/* Spots */}
      <section className="px-5 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-rose-900 mb-2" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {areaLabel}の{sceneData.label}おすすめスポット
        </h2>
        <p className="text-center text-rose-500/70 text-sm mb-8">AIがシーン特性を踏まえて最適なスポットを組み合わせます。</p>
        <div className="grid md:grid-cols-2 gap-4">
          {spots.map((spot) => (
            <div key={spot.name} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-100 p-5 hover:shadow-md transition-all duration-200">
              <h3 className="font-semibold text-rose-900 mb-1.5" style={{ fontFamily: 'var(--font-heading), serif' }}>{spot.name}</h3>
              <p className="text-sm text-rose-600/70 mb-3">{spot.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {spot.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-pink-50 text-rose-500 border border-pink-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-rose-900 mb-8" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {areaLabel}の{sceneData.label}プランの作り方
        </h2>
        <div className="space-y-4">
          {sceneData.steps.map((s) => (
            <div key={s.step} className="flex gap-5 items-start bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-pink-100">
              <div className="w-10 h-10 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center text-sm font-bold text-amber-600 shrink-0" style={{ fontFamily: 'var(--font-heading), serif' }}>
                {s.step}
              </div>
              <div className="pt-1">
                <p className="font-semibold text-rose-900 mb-0.5" style={{ fontFamily: 'var(--font-heading), serif' }}>{s.title}</p>
                <p className="text-sm text-rose-600/70">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-rose-900 mb-8" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {areaLabel}の{sceneData.label}に関するよくある質問
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-100 p-6">
              <h3 className="font-semibold text-rose-900 mb-2" style={{ fontFamily: 'var(--font-heading), serif' }}>
                Q. {faq.q}
              </h3>
              <p className="text-sm text-rose-600/80 leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center" style={{ background: 'linear-gradient(160deg, #FCE7F3 0%, #FFF1F2 100%)' }}>
        <h2 className="text-2xl font-semibold text-rose-900 mb-3" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {areaLabel}の{sceneData.label}、AIにプランを作ってもらいませんか？
        </h2>
        <p className="text-rose-500/70 text-sm mb-8">登録無料・カード不要。30秒でプランが完成します。</p>
        <Link href="/generate">
          <Button size="lg" className="px-10 py-6 text-base border-0 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #DB2777, #be185d)', boxShadow: '0 8px 24px rgba(219,39,119,0.3)' }}>
            無料で{areaLabel}の{sceneData.label}プランを作る
          </Button>
        </Link>
      </section>

      {/* Related scenes */}
      <section className="px-5 py-8 max-w-3xl mx-auto border-t border-pink-100">
        <p className="text-xs text-center text-rose-400 mb-4">他のシーンのデートプランを見る</p>
        <div className="flex flex-wrap justify-center gap-2">
          {(Object.keys(SCENE_DATA) as Scene[]).filter((s) => s !== scene).map((s) => (
            <Link key={s} href={`/plans/${area}/${s}`}>
              <Button variant="outline" size="sm" className="border-pink-200 text-rose-600 hover:bg-pink-50">
                {areaLabel}の{SCENE_DATA[s].label}プラン
              </Button>
            </Link>
          ))}
        </div>
        <p className="text-xs text-center text-rose-400 mt-4 mb-2">他のエリアを見る</p>
        <div className="flex justify-center gap-3">
          {(Object.keys(AREAS) as AreaKey[]).filter((a) => a !== area).map((a) => (
            <Link key={a} href={`/plans/${a}/${scene}`}>
              <Button variant="outline" size="sm" className="border-pink-200 text-rose-600 hover:bg-pink-50">
                {AREAS[a].label}の{sceneData.label}プラン
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-100 px-5 py-6 text-center text-xs text-rose-300">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <Link href="/" className="hover:text-rose-400 transition-colors">トップ</Link>
          <Link href="/generate" className="hover:text-rose-400 transition-colors">プランを作る</Link>
          <Link href="/plans/nagoya" className="hover:text-rose-400 transition-colors">名古屋</Link>
          <Link href="/plans/tokyo" className="hover:text-rose-400 transition-colors">東京</Link>
          <Link href="/plans/nagoya/rainy" className="hover:text-rose-400 transition-colors">名古屋 雨の日</Link>
          <Link href="/plans/tokyo/rainy" className="hover:text-rose-400 transition-colors">東京 雨の日</Link>
          <Link href="/plans/nagoya/anniversary" className="hover:text-rose-400 transition-colors">名古屋 記念日</Link>
          <Link href="/plans/tokyo/anniversary" className="hover:text-rose-400 transition-colors">東京 記念日</Link>
        </div>
        © 2026 AIデートプラン
      </footer>

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://dateplan.app' },
              { '@type': 'ListItem', position: 2, name: `${areaLabel}のデートプラン`, item: `https://dateplan.app/plans/${area}` },
              { '@type': 'ListItem', position: 3, name: `${areaLabel}の${sceneData.label}`, item: `https://dateplan.app/plans/${area}/${scene}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: sceneData.seoTitle(areaLabel),
            description: sceneData.seoDescription(areaLabel),
            url: `https://dateplan.app/plans/${area}/${scene}`,
            inLanguage: 'ja',
          }),
        }}
      />
    </div>
  )
}
