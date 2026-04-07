'use client'

interface Props {
  planId: string
  title: string
  area?: string
  spotCount?: number
}

export function ShareButtons({ planId, title, area, spotCount }: Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const planUrl = `${appUrl}/result/${planId}`
  const shareText = `AIがデートプランを作ってくれた！「${title}」 #デートプラン`

  const shareX = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(planUrl)}`,
      '_blank'
    )

  const shareLine = () =>
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(shareText + '\n' + planUrl)}`,
      '_blank'
    )

  const saveImage = () => {
    const ogUrl = `/api/og?title=${encodeURIComponent(title)}&area=${encodeURIComponent(area ?? '')}&spots=${spotCount ?? 0}`
    window.open(ogUrl, '_blank')
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm p-4">
      <p className="text-xs text-center text-rose-400 mb-3 font-medium tracking-wide">
        プランをシェアする
      </p>
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={shareX}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-sm rounded-xl font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X でシェア
        </button>
        <button
          onClick={shareLine}
          className="flex items-center gap-1.5 px-4 py-2.5 text-white text-sm rounded-xl font-medium"
          style={{ background: '#06C755' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v3.771h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          LINE で送る
        </button>
        <button
          onClick={saveImage}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 text-rose-500 text-sm rounded-xl font-medium border border-rose-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          画像を開く
        </button>
      </div>
    </div>
  )
}
