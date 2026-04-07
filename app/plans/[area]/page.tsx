import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-static'

const AREAS = {
  nagoya: {
    label: '名古屋',
    description: '名古屋のデートプランをAIが提案。栄・名駅・大須・覚王山など人気エリアのカフェ、グルメ、観光スポットをタイムライン形式で提案します。',
    hero: '名古屋でのデートをAIが提案',
    subtext: '栄・名駅・大須・覚王山など名古屋の人気エリアに特化したAIデートプランジェネレーター。',
    spots: [
      { name: '栄・錦エリア', desc: 'ランチ・カフェ・ショッピングが揃う名古屋最大の繁華街。', tags: ['カフェ', 'グルメ', 'ショッピング'] },
      { name: '大須商店街', desc: 'レトロな雰囲気とサブカルが混在。食べ歩きも楽しい人気スポット。', tags: ['観光', 'グルメ', '食べ歩き'] },
      { name: '覚王山エリア', desc: 'おしゃれなカフェと日泰寺が共存する大人のデートスポット。', tags: ['カフェ', '観光'] },
      { name: '名古屋港水族館', desc: 'シャチのパフォーマンスが人気。カップルに大人気のスポット。', tags: ['アクティビティ', '観光'] },
      { name: 'ナゴヤドーム周辺', desc: 'イオンモール・レストランが充実。一日遊べるエリア。', tags: ['ショッピング', 'グルメ'] },
      { name: '名古屋城周辺', desc: '日本三名城のひとつ。金のシャチホコで有名。歴史好きカップルに。', tags: ['観光', '歴史'] },
    ],
    faqs: [
      {
        q: '名古屋でのデートでおすすめのエリアは？',
        a: '栄・錦エリアはアクセス抜群でカフェ・グルメ・ショッピングが充実。初デートにも人気です。大須は食べ歩きや独特の雰囲気が楽しめ、少し慣れたカップルにも◎。覚王山はおしゃれなカフェが多く落ち着いた雰囲気でデートできます。',
      },
      {
        q: '名古屋のデートは予算どのくらいかかる？',
        a: '昼間のデートなら一人あたり3,000〜8,000円が目安。ランチ（1,000〜2,000円）＋カフェ（500〜1,000円）＋アクティビティ（1,000〜3,000円）が一般的です。AIデートプランでは予算を設定して自動計算できます。',
      },
      {
        q: '雨の日でも楽しめる名古屋のデートスポットは？',
        a: 'リニア・鉄道館、名古屋港水族館、大須商店街（アーケードあり）、名古屋市科学館のプラネタリウム、栄周辺のショッピングモールなどが雨でも楽しめます。AIプランで天候条件を「雨」に設定するとこれらのスポットを優先的に提案します。',
      },
      {
        q: '車なしでも名古屋デートを楽しめる？',
        a: 'はい。名古屋は地下鉄が充実しており、栄・名駅・大須・覚王山などの人気エリアはすべて電車でアクセス可能です。AIプランで移動手段を「電車・地下鉄」に設定すると、電車移動に最適化したプランを提案します。',
      },
    ],
    keywords: ['名古屋 デート', '名古屋 デートプラン', '名古屋 カップル', '名古屋 デートスポット', '栄 デート', '大須 デート'],
    seoTitle: '名古屋のデートプランをAIが提案 | 栄・大須・覚王山などエリア別コース',
    seoDescription: '名古屋のデートプランをAIが自動生成。栄・大須・覚王山など人気エリアから、天候・予算・移動手段に合わせたプランをタイムライン形式で提案。無料で月3プランまで。',
  },
  tokyo: {
    label: '東京',
    description: '東京のデートプランをAIが提案。渋谷・新宿・表参道・下北沢など人気エリアのカフェ、グルメ、観光スポットをタイムライン形式で提案します。',
    hero: '東京でのデートをAIが提案',
    subtext: '渋谷・新宿・表参道・下北沢など東京の人気エリアに特化したAIデートプランジェネレーター。',
    spots: [
      { name: '表参道・原宿エリア', desc: 'ハイセンスなカフェとショッピングが集まる。おしゃれカップルに人気。', tags: ['カフェ', 'ショッピング', 'グルメ'] },
      { name: '下北沢', desc: 'サブカル・古着・ライブハウスが集まる個性派エリア。ユニークなデートに。', tags: ['観光', 'カフェ', 'グルメ'] },
      { name: '恵比寿・代官山エリア', desc: '落ち着いた大人のデートに最適。おしゃれなレストランが充実。', tags: ['グルメ', 'カフェ', 'ショッピング'] },
      { name: '浅草・上野エリア', desc: '雷門・仲見世通りなど東京の歴史文化が楽しめる観光スポット。', tags: ['観光', '歴史', 'グルメ'] },
      { name: 'お台場エリア', desc: '海と夜景が楽しめるデートスポット。ユニコーンガンダムも人気。', tags: ['夜景', '観光', 'アクティビティ'] },
      { name: '新宿御苑', desc: '広大な緑と花が楽しめる公園。ピクニックデートに人気。', tags: ['自然', '観光'] },
    ],
    faqs: [
      {
        q: '東京でのデートでおすすめのエリアは？',
        a: '初デートには表参道・原宿がおすすめ。カフェやショッピングが充実していて、話のネタにも困りません。落ち着いた雰囲気なら恵比寿・代官山、雰囲気重視なら下北沢が人気です。夜景デートにはお台場や六本木エリアも◎。',
      },
      {
        q: '東京のデートは予算どのくらいかかる？',
        a: '一人あたり5,000〜15,000円が目安です。エリアや選ぶ店によって大きく変わります。AIデートプランでは予算を細かく設定できるので、3,000円〜のカジュアルなデートから特別な日のプレミアムプランまで対応できます。',
      },
      {
        q: '雨の日でも楽しめる東京のデートスポットは？',
        a: '国立新美術館・東京都現代美術館などの美術館、東京スカイツリーや東京タワーなどの展望台、六本木ヒルズ・渋谷スクランブルスクエアなどの複合施設がおすすめです。AIプランで天候を「雨」に設定すると屋内スポットを優先提案します。',
      },
      {
        q: '電車でも楽しめる東京のデートスポットは？',
        a: '東京は電車・地下鉄網が充実しているので、ほぼすべての人気エリアにアクセスできます。表参道・渋谷・新宿・浅草・お台場はすべて電車でアクセス可能。AIプランで移動手段を「電車・地下鉄」に設定するだけで最適なプランを提案します。',
      },
    ],
    keywords: ['東京 デート', '東京 デートプラン', '東京 カップル', '東京 デートスポット', '渋谷 デート', '表参道 デート'],
    seoTitle: '東京のデートプランをAIが提案 | 渋谷・表参道・下北沢など人気エリア別コース',
    seoDescription: '東京のデートプランをAIが自動生成。渋谷・表参道・下北沢・浅草など人気エリアから、天候・予算・移動手段に合わせたプランをタイムライン形式で提案。無料で月3プランまで。',
  },
} as const

type Area = keyof typeof AREAS

type Props = {
  params: Promise<{ area: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params
  const data = AREAS[area as Area]
  if (!data) return {}

  return {
    title: data.seoTitle,
    description: data.seoDescription,
    keywords: [...data.keywords],
    openGraph: {
      type: 'website',
      title: data.seoTitle,
      description: data.seoDescription,
    },
    alternates: {
      canonical: `/plans/${area}`,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(AREAS).map((area) => ({ area }))
}

export default async function AreaPlanPage({ params }: Props) {
  const { area } = await params
  const data = AREAS[area as Area]
  if (!data) notFound()

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

      {/* Hero */}
      <section className="px-5 py-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-rose-600 text-xs font-medium px-4 py-1.5 rounded-full mb-5 border border-pink-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
          {data.label}対応
        </div>
        <h1 className="text-4xl font-semibold text-rose-900 leading-tight mb-4" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {data.hero}
        </h1>
        <p className="text-rose-700/70 mb-8 text-base leading-relaxed">{data.subtext}</p>
        <Link href="/generate">
          <Button size="lg" className="px-10 py-6 text-base border-0 shadow-lg text-white" style={{ background: 'linear-gradient(135deg, #DB2777, #be185d)', boxShadow: '0 8px 24px rgba(219,39,119,0.3)' }}>
            無料で{data.label}のプランを作る
          </Button>
        </Link>
        <p className="text-xs text-rose-400 mt-3">無料で月3プランまで · カード登録不要</p>
      </section>

      {/* Spots */}
      <section className="px-5 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-rose-900 mb-2" style={{ fontFamily: 'var(--font-heading), serif' }}>
          {data.label}の人気デートエリア
        </h2>
        <p className="text-center text-rose-500/70 text-sm mb-8">AIがエリア特性を熟知。地元民も驚くプランを提案します。</p>
        <div className="grid md:grid-cols-2 gap-4">
          {data.spots.map((spot) => (
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
          {data.label}のデートプランの作り方
        </h2>
        <div className="space-y-4">
          {[
            { step: '01', title: `エリアで「${data.label}」を選択`, desc: '出発地点・希望エリアも詳細に設定できます。' },
            { step: '02', title: '天候・予算・移動手段を設定', desc: '雨の日・車なし・低予算など細かい条件を10項目以上設定。' },
            { step: '03', title: 'AIがタイムラインで提案', desc: '30秒でタイムライン形式のプランが完成。そのまま当日使えます。' },
          ].map((s) => (
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
          {data.label}のデートに関するよくある質問
        </h2>
        <div className="space-y-4">
          {data.faqs.map((faq) => (
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
          {data.label}でのデート、AIに任せてみませんか？
        </h2>
        <p className="text-rose-500/70 text-sm mb-8">登録無料・カード不要。30秒でプランが完成します。</p>
        <Link href="/generate">
          <Button size="lg" className="px-10 py-6 text-base border-0 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #DB2777, #be185d)', boxShadow: '0 8px 24px rgba(219,39,119,0.3)' }}>
            無料で{data.label}のプランを作る
          </Button>
        </Link>
      </section>

      {/* Other areas */}
      <section className="px-5 py-8 max-w-3xl mx-auto border-t border-pink-100">
        <p className="text-xs text-center text-rose-400 mb-4">他のエリアのデートプランを見る</p>
        <div className="flex justify-center gap-3">
          {(Object.keys(AREAS) as Area[]).filter((a) => a !== area).map((a) => (
            <Link key={a} href={`/plans/${a}`}>
              <Button variant="outline" size="sm" className="border-pink-200 text-rose-600 hover:bg-pink-50">
                {AREAS[a].label}のデートプラン
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-100 px-5 py-6 text-center text-xs text-rose-300">
        <div className="flex justify-center gap-4 mb-3">
          <Link href="/" className="hover:text-rose-400 transition-colors">トップ</Link>
          <Link href="/generate" className="hover:text-rose-400 transition-colors">プランを作る</Link>
          <Link href="/plans/nagoya" className="hover:text-rose-400 transition-colors">名古屋</Link>
          <Link href="/plans/tokyo" className="hover:text-rose-400 transition-colors">東京</Link>
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
            mainEntity: data.faqs.map((faq) => ({
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
              {
                '@type': 'ListItem',
                position: 1,
                name: 'ホーム',
                item: 'https://dateplan.app',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: `${data.label}のデートプラン`,
                item: `https://dateplan.app/plans/${area}`,
              },
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
            name: data.seoTitle,
            description: data.seoDescription,
            url: `https://dateplan.app/plans/${area}`,
            inLanguage: 'ja',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'ホーム',
                  item: 'https://dateplan.app',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: `${data.label}のデートプラン`,
                  item: `https://dateplan.app/plans/${area}`,
                },
              ],
            },
          }),
        }}
      />
    </div>
  )
}
