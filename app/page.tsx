import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Heart,
  Compass,
  Wand2,
  Clock,
  SlidersHorizontal,
  Brain,
  GlassWater,
  MapPin,
  ChevronDown,
  ArrowRight,
  Check,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIデートプラン | 名古屋・東京のデートをAIが提案',
  description: '人数・天候・予算・移動手段まで細かく設定できるAIデートプランジェネレーター。名古屋・東京のおすすめデートコースを瞬時に生成。無料で月3プランまで。',
  keywords: ['デートプラン', '名古屋 デート', '東京 デート', 'AIデート', 'カップル', 'デートコース'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'AIデートプラン — 条件を設定してAIがプランを作成',
    description: '名古屋・東京のデートをAIが提案。天候・交通手段・関係性など細かい設定が可能。',
    images: [{ url: '/api/og?title=AIデートプラン&area=名古屋・東京', width: 1200, height: 630 }],
  },
}

const CARD_SHADOW = 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'

const FEATURES = [
  {
    icon: Compass,
    iconBg: '#f2f2f2',
    iconColor: '#222222',
    title: '隠れ家スポットの発見',
    description: 'SNSでまだバズっていない雰囲気の良いカフェや、静かな公園など、二人だけの穴場をご提案します。',
  },
  {
    icon: Wand2,
    iconBg: '#fff0f2',
    iconColor: '#ff385c',
    title: '好みに合わせた完全最適化',
    description: '「歩くのは少なめ」「ワインが飲みたい」「予算は1万円」など、細かな条件から最適なルートを構築。',
  },
  {
    icon: Clock,
    iconBg: '#f2f2f2',
    iconColor: '#222222',
    title: '完璧なタイムマネジメント',
    description: '移動時間や滞在予想時間を計算し、スムーズなスケジュールを作成。「次どうする？」の気まずい時間ゼロへ。',
  },
]

const TIMELINE = [
  {
    time: '11:00',
    dot: 'bg-blue-400',
    tag: '待ち合わせ',
    name: '蔦屋書店でゆったり合流',
    desc: 'お互い少し早く着いたら本を読みながら待てる安心のスポット。',
    sub: '代官山駅 徒歩5分',
  },
  {
    time: '12:30',
    dot: 'bg-[#ff385c]',
    tag: 'ランチ',
    name: '緑に囲まれた隠れ家イタリアン',
    desc: '広々としたテラス席で、リラックスしながらランチコースを。',
    sub: '1人 3,500円目安',
  },
  {
    time: '15:00',
    dot: 'bg-teal-400',
    tag: 'アクティビティ',
    name: '目黒川沿いを散策 & ギャラリー巡り',
    desc: 'お腹を満たした後は、川沿いを歩きながら小さなアートギャラリーへ。自然と会話が弾む構成です。',
    sub: null,
  },
]

const STEPS = [
  {
    num: '1',
    icon: SlidersHorizontal,
    title: '条件を入力',
    desc: 'エリア、時間帯、予算、二人の気分をタップして選択。',
  },
  {
    num: '2',
    icon: Brain,
    title: 'AIが即座に生成',
    desc: '数万件のスポットデータから最適なルートを数秒で組み立てます。',
  },
  {
    num: '3',
    icon: GlassWater,
    title: 'デートへ出発！',
    desc: 'プランは共有リンクで相手に送ることも可能。あとは楽しむだけです。',
  },
]

const FREE_ITEMS = ['月3回までのプラン生成', '基本スポットデータの利用', 'プランのURL共有']
const PRO_ITEMS = [
  'プラン生成 無制限',
  '隠れ家・予約困難店データの優先表示',
  'リアルタイムの混雑状況予測',
  '雨天時の代替ルート自動提案',
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-[#222222]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#c1c1c1]/50" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-lg font-bold" style={{ fontFamily: 'var(--font-sans)', color: '#222222' }}>
            <Heart className="w-4 h-4 fill-[#ff385c] text-[#ff385c]" />
            dateplan
          </span>
          <nav className="hidden md:flex gap-7 text-sm font-medium text-[#222222]">
            <a href="#features" className="hover:text-[#ff385c] transition-colors">特徴</a>
            <a href="#timeline" className="hover:text-[#ff385c] transition-colors">プラン例</a>
            <a href="#how-it-works" className="hover:text-[#ff385c] transition-colors">使い方</a>
            <a href="#pricing" className="hover:text-[#ff385c] transition-colors">料金</a>
          </nav>
          <Link
            href="/generate"
            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-px"
            style={{ background: '#222222' }}
          >
            はじめる
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-20 px-6 md:pt-28 md:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Copy */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[#ff385c]/30" style={{ background: '#fff0f2', color: '#ff385c' }}>
              NEW: 最新のAIモデルを搭載
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#222222', letterSpacing: '-0.44px' }}>
              完璧なデートを、<br />
              <span className="relative inline-block">
                <span className="relative z-10" style={{ color: '#ff385c' }}>AIが数秒で</span>
                <span className="absolute bottom-1 left-0 w-full h-3 -z-10 rounded-full" style={{ background: '#fff0f2' }} />
              </span>
              デザイン。
            </h1>
            <p className="text-base md:text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed text-[#6a6a6a]">
              いつも同じプランになっていませんか？<br className="hidden md:block" />
              予算、雰囲気、二人の趣味を入力するだけ。<br className="hidden md:block" />
              会話が弾む隠れ家カフェから、ロマンチックなディナーまで、あなたに最適な一日をご提案します。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/generate"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: '#ff385c', borderRadius: '8px' }}
              >
                無料でプランを作成
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-[#929292]">クレジットカード登録不要</span>
            </div>
          </div>

          {/* AI output mockup */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none mx-auto">
            <div className="rounded-[20px] overflow-hidden bg-white shadow-card-static">
              {/* Label bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#c1c1c1]/30" style={{ background: '#fff0f2' }}>
                <span className="w-2 h-2 rounded-full bg-[#ff385c]" />
                <span className="text-xs font-bold tracking-widest text-[#ff385c]" style={{ fontFamily: 'var(--font-montserrat)' }}>AI GENERATED PLAN</span>
              </div>
              {/* Plan title */}
              <div className="px-5 pt-4 pb-2">
                <p className="font-bold text-base text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>代官山 大人の休日プラン</p>
                <p className="text-xs mt-0.5 text-[#929292]">名古屋 / 20代カップル / 晴れ / 予算¥15,000</p>
              </div>
              {/* Timeline items */}
              <div className="px-5 pb-5 space-y-2 mt-2">
                {[
                  { time: '11:00', name: '蔦屋書店でゆったり合流', tag: '待ち合わせ' },
                  { time: '12:30', name: '緑に囲まれた隠れ家イタリアン', tag: 'ランチ' },
                  { time: '15:00', name: '目黒川沿いを散策', tag: 'アクティビティ' },
                ].map((item) => (
                  <div key={item.time} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f2f2f2]">
                    <span className="text-xs font-bold shrink-0 w-10 text-[#ff385c]" style={{ fontFamily: 'var(--font-montserrat)' }}>{item.time}</span>
                    <span className="text-sm font-medium flex-1 truncate text-[#222222]">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 bg-white text-[#6a6a6a]">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#222222]" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.44px' }}>
              なぜ dateplan なのか？
            </h2>
            <p className="text-[#6a6a6a]">あなたのデートをアップグレードする3つの理由</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`group p-8 rounded-[20px] transition-all duration-300 shadow-card bg-white${i === 1 ? ' md:-translate-y-4' : ''}`}
              >
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: f.iconBg }}>
                  <f.icon className="w-7 h-7" style={{ color: f.iconColor }} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#6a6a6a]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Timeline */}
      <section id="timeline" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-bold tracking-widest block mb-2 text-[#ff385c]" style={{ fontFamily: 'var(--font-montserrat)' }}>PREVIEW</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#222222]" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.44px' }}>ある日のデートプラン例</h2>
            <p className="text-sm text-[#6a6a6a]">テーマ：「代官山でちょっと大人な休日」 / 予算：1.5万円</p>
          </div>

          <div className="relative rounded-[20px] overflow-hidden bg-white shadow-card-static">
            <div className="px-6 md:px-10 py-8 space-y-7">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex gap-5">
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5" style={{ width: '24px' }}>
                    <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm shrink-0 ${item.dot}`} />
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 mt-2 bg-[#c1c1c1]/40" style={{ minHeight: '32px' }} />
                    )}
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-[14px] p-5 mb-2 bg-[#f2f2f2] hover:bg-[#f8f8f8] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>{item.time}</span>
                      <span className="text-[10px] px-2 py-1 rounded font-medium bg-white text-[#6a6a6a]">{item.tag}</span>
                    </div>
                    <h4 className="font-bold mb-1.5 text-[#222222]">{item.name}</h4>
                    <p className="text-sm mb-2 leading-relaxed text-[#6a6a6a]">{item.desc}</p>
                    {item.sub && (
                      <div className="flex items-center gap-1.5 text-xs text-[#929292]">
                        <MapPin className="w-3 h-3" />
                        {item.sub}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Fade + CTA */}
            <div className="absolute bottom-0 left-0 w-full h-20 flex items-end justify-center pb-4" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)' }}>
              <Link href="/generate" className="flex items-center gap-1 text-sm font-bold transition-colors text-[#ff385c] hover:text-[#e00b41]">
                実際のプランを生成する <ChevronDown className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>
            使い方はとてもシンプル
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-[#c1c1c1]/50" />

            {STEPS.map((s, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center text-center${i === 1 ? ' md:translate-y-8' : ''}`}>
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white shadow-card-static">
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm bg-[#ff385c]">{s.num}</span>
                  <s.icon className="w-9 h-9 text-[#222222]" strokeWidth={1.25} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#222222]">{s.title}</h3>
                <p className="text-sm max-w-[180px] text-[#6a6a6a]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3 text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>料金プラン</h2>
            <p className="text-[#6a6a6a]">まずは無料で、次回のデートプランを作ってみませんか？</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="flex flex-col p-8 rounded-[20px] bg-white shadow-card-static">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#222222]" style={{ fontFamily: 'var(--font-montserrat)' }}>¥0</span>
                  <span className="text-sm text-[#929292]">/ 月</span>
                </div>
                <p className="text-sm mt-3 text-[#929292]">基本的なデートプラン作成に。</p>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                {FREE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#6a6a6a]">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="w-full py-3 text-center font-bold transition-colors hover:bg-[#f2f2f2] border border-[#c1c1c1] text-[#222222]"
                style={{ borderRadius: '8px' }}
              >
                無料で始める
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col p-8 rounded-[20px] bg-white" style={{ boxShadow: `${CARD_SHADOW}, 0 0 0 2px #ff385c` }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider bg-[#222222]">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-[#222222]" style={{ fontFamily: 'var(--font-sans)' }}>Premium</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#222222]" style={{ fontFamily: 'var(--font-montserrat)' }}>¥480</span>
                  <span className="text-sm text-[#929292]">/ 月</span>
                </div>
                <p className="text-sm mt-1 font-medium text-[#ff385c]">年払いなら ¥3,800（¥317/月・34%OFF）</p>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                {PRO_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-[#222222]">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="w-full py-3 text-center font-bold text-white transition-all hover:-translate-y-0.5 bg-[#ff385c] hover:bg-[#e00b41]"
                style={{ borderRadius: '8px' }}
              >
                Proプランを始める
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-24 pb-12 px-6 bg-[#222222]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.44px' }}>
            二人だけの特別な時間を。
          </h2>
          <p className="mb-10 max-w-lg mx-auto leading-relaxed text-[#929292]">
            計画のストレスをなくし、目の前の相手との時間を100%楽しむために。<br />
            今すぐ最初のデートプランを作りましょう。
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-white mb-20 transition-all hover:-translate-y-0.5 bg-[#ff385c] hover:bg-[#e00b41]"
            style={{ borderRadius: '8px' }}
          >
            無料でプランを作成する
          </Link>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-white/10">
            <span className="flex items-center gap-2 text-xl font-bold tracking-wider text-white/80" style={{ fontFamily: 'var(--font-sans)' }}>
              <Heart className="w-4 h-4 fill-[#ff385c] text-[#ff385c]" />
              dateplan
            </span>
            <div className="flex gap-6 text-sm text-[#6a6a6a]">
              <Link href="#" className="hover:text-white transition-colors">利用規約</Link>
              <Link href="#" className="hover:text-white transition-colors">プライバシーポリシー</Link>
              <Link href="/generate" className="hover:text-white transition-colors">プランを作る</Link>
            </div>
            <span className="text-sm text-[#6a6a6a]">© 2026 dateplan</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
