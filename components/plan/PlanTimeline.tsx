'use client'

import { type GeneratedPlan } from '@/types'
import { Button } from '@/components/ui/button'
import { Footprints, Train, Bus, Car, Bike, Ship, Plane, MapPin } from 'lucide-react'

function TransportIcon({ transport }: { transport: string }) {
  const cls = 'w-4 h-4 text-[#6a6a6a]'
  if (/徒歩|歩|walk/i.test(transport)) return <Footprints className={cls} />
  if (/電車|地下鉄|鉄道|電鉄|subway|train/i.test(transport)) return <Train className={cls} />
  if (/バス|bus/i.test(transport)) return <Bus className={cls} />
  if (/タクシー|taxi|cab/i.test(transport)) return <Car className={cls} />
  if (/車|ドライブ|自動車|drive|car/i.test(transport)) return <Car className={cls} />
  if (/自転車|bike|bicycle/i.test(transport)) return <Bike className={cls} />
  if (/船|フェリー|ferry/i.test(transport)) return <Ship className={cls} />
  if (/飛行機|airplane|flight/i.test(transport)) return <Plane className={cls} />
  return <Footprints className={cls} />
}

function getGoogleMapsTravelMode(transport: string): string {
  if (/徒歩|歩|walk/i.test(transport)) return 'walking'
  if (/自転車|bike|bicycle/i.test(transport)) return 'bicycling'
  if (/電車|地下鉄|鉄道|電鉄|バス|subway|train|bus/i.test(transport)) return 'transit'
  return 'driving'
}

function buildGoogleMapsUrl(origin: string, destination: string, transport: string): string {
  const mode = getGoogleMapsTravelMode(transport)
  const params = new URLSearchParams({ api: '1', origin, destination, travelmode: mode })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  食事:           { bg: 'bg-orange-50', text: 'text-orange-600', icon: '✦' },
  カフェ:         { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: '◈' },
  観光:           { bg: 'bg-sky-50',    text: 'text-sky-600',    icon: '◇' },
  ショッピング:   { bg: 'bg-pink-50',   text: 'text-pink-600',   icon: '◆' },
  アクティビティ: { bg: 'bg-emerald-50',text: 'text-emerald-600',icon: '▲' },
  夜景:           { bg: 'bg-violet-50', text: 'text-violet-600', icon: '✧' },
  移動:           { bg: 'bg-[#f2f2f2]', text: 'text-[#6a6a6a]', icon: '→' },
}

interface PlanTimelineProps {
  plan: GeneratedPlan
  onSave?: () => void
  onRegenerate?: () => void
  onRainConvert?: () => void
  onReplaceSpot?: (index: number) => void
  replacingIndex?: number | null
  isSaving?: boolean
}

export function PlanTimeline({ plan, onSave, onRegenerate, onRainConvert, onReplaceSpot, replacingIndex, isSaving }: PlanTimelineProps) {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm p-6">
        <p className="text-xs font-bold tracking-widest text-[#ff385c] uppercase mb-2">Your Date Plan</p>
        <h2 className="text-xl font-bold text-[#222222] leading-snug">{plan.title}</h2>
        <p className="text-sm text-[#6a6a6a] mt-2 leading-relaxed">{plan.summary}</p>
        <div className="mt-4 flex items-center gap-1.5">
          <span className="text-xs text-[#929292]">合計目安費用（一人）</span>
          <span className="text-sm font-bold text-[#ff385c]">¥{plan.total_estimated_cost.toLocaleString()}</span>
        </div>
      </div>

      {/* タイムライン */}
      <div className="space-y-0">
        {plan.timeline.map((spot, index) => {
          const style = CATEGORY_STYLES[spot.category] ?? { bg: 'bg-[#f2f2f2]', text: 'text-[#6a6a6a]', icon: '◎' }
          const isLast = index === plan.timeline.length - 1
          return (
            <div key={index}>
              <div className="relative pl-6">
                <div className="absolute left-[5px] top-3 w-2 h-2 rounded-full border-2 border-[#ff385c] bg-white z-10" />
                <div className={`bg-white rounded-[14px] border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${replacingIndex === index ? 'border-[#c1c1c1] opacity-60' : 'border-[#c1c1c1]/40 hover:border-[#c1c1c1]'}`}>
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-[#ff385c]">{spot.time}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                            {style.icon} {spot.category}
                          </span>
                          <span className="text-xs text-[#929292]">{spot.duration}</span>
                        </div>
                        <p className="font-bold text-[#222222] leading-snug">{spot.place}</p>
                        <p className="text-sm text-[#6a6a6a] mt-1.5 leading-relaxed">{spot.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-sm font-bold text-[#ff385c] whitespace-nowrap">
                          ¥{spot.estimated_cost.toLocaleString()}
                        </div>
                        {onReplaceSpot && (
                          <button
                            onClick={() => onReplaceSpot(index)}
                            disabled={replacingIndex !== null && replacingIndex !== undefined}
                            className="text-xs text-[#6a6a6a] hover:text-[#222222] border border-[#c1c1c1]/40 hover:border-[#c1c1c1] rounded-[6px] px-2 py-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {replacingIndex === index ? '差し替え中...' : '差し替え'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isLast && (
                <div className="relative pl-6 py-1.5">
                  <div className="absolute left-[9px] top-0 bottom-0 w-px bg-[#c1c1c1]/40" />
                  {spot.transport_to_next ? (
                    <a
                      href={buildGoogleMapsUrl(spot.place, plan.timeline[index + 1].place, spot.transport_to_next)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 ml-3 px-3 py-1.5 rounded-full border border-[#ff385c]/30 bg-[#fff0f2] hover:bg-[#ffe0e6] active:scale-95 transition-all"
                    >
                      <TransportIcon transport={spot.transport_to_next} />
                      <span className="text-xs font-medium text-[#ff385c]">{spot.transport_to_next}</span>
                      <MapPin className="w-3 h-3 text-[#ff385c]" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 ml-3 px-3 py-1.5">
                      <Footprints className="w-4 h-4 text-[#929292]" />
                      <span className="text-xs text-[#929292]">徒歩</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* アドバイス */}
      {plan.tips.length > 0 && (
        <div className="bg-[#f2f2f2] rounded-[14px] border border-[#c1c1c1]/40 p-5">
          <h3 className="text-sm font-bold text-[#222222] mb-3">デートをより素敵にするヒント</h3>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-sm text-[#6a6a6a] flex gap-2.5">
                <span className="text-[#ff385c] shrink-0 mt-0.5">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* シェアボタン */}
      <div className="flex gap-2.5">
        <button
          className="flex-1 h-10 rounded-[8px] border text-sm font-medium transition-all hover:shadow-sm flex items-center justify-center gap-2"
          style={{ borderColor: '#06C755', color: '#06C755' }}
          onClick={() => {
            const text = `${plan.title}\n${plan.summary}\n\nAIデートプランで作成`
            window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank')
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#06C755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          LINE でシェア
        </button>
        <button
          className="flex-1 h-10 rounded-[8px] border border-[#c1c1c1] text-[#222222] text-sm font-medium hover:bg-[#f2f2f2] transition-all flex items-center justify-center gap-2"
          onClick={() => {
            const text = `${plan.title}\n${plan.summary}\n\n#デートプラン #AIデート`
            window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          𝕏 でシェア
        </button>
      </div>

      {onRainConvert && (
        <button
          onClick={onRainConvert}
          className="w-full h-10 rounded-[8px] border border-[#c1c1c1] text-[#6a6a6a] text-sm font-medium hover:bg-[#f2f2f2] transition-all flex items-center justify-center gap-2"
        >
          <span>☂</span>
          雨天バージョンに変換
        </button>
      )}

      <div className="flex gap-3">
        {onSave && (
          <Button onClick={onSave} disabled={isSaving} className="flex-1 text-white h-11 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41]">
            {isSaving ? '保存中...' : 'このプランを保存'}
          </Button>
        )}
        {onRegenerate && (
          <Button onClick={onRegenerate} variant="outline" className="border-[#c1c1c1] text-[#222222] hover:bg-[#f2f2f2] h-11 rounded-[8px]">
            再生成
          </Button>
        )}
      </div>
    </div>
  )
}
