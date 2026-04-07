import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

interface Spot {
  time: string
  place: string
  category: string
}

const AREA_LABEL: Record<string, string> = {
  nagoya: '名古屋',
  tokyo: '東京',
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = (searchParams.get('title') ?? 'デートプラン').slice(0, 60)
  const area = searchParams.get('area') ?? ''
  const spotsRaw = searchParams.get('spots') ?? '[]'

  let spots: Spot[] = []
  try {
    const parsed = JSON.parse(spotsRaw)
    if (Array.isArray(parsed)) {
      spots = parsed.slice(0, 5).map((s: Partial<Spot>) => ({
        time: String(s.time ?? ''),
        place: String(s.place ?? ''),
        category: String(s.category ?? ''),
      }))
    }
  } catch {
    // ignore parse errors
  }

  const areaLabel = AREA_LABEL[area] ?? area

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 100%)',
          padding: '80px 60px',
        }}
      >
        {/* ロゴ */}
        <div
          style={{
            fontSize: 28,
            color: '#BE185D',
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 60,
          }}
        >
          💕 AI デートプラン
        </div>

        {/* タイトル */}
        <div
          style={{
            fontSize: title.length > 22 ? 56 : 68,
            fontWeight: 800,
            color: '#1F2937',
            lineHeight: 1.35,
            marginBottom: 32,
          }}
        >
          {title}
        </div>

        {/* エリアバッジ */}
        {areaLabel && (
          <div
            style={{
              display: 'flex',
              marginBottom: 60,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 32,
                padding: '12px 28px',
                fontSize: 26,
                color: '#BE185D',
                border: '1px solid #FBCFE8',
                fontWeight: 600,
              }}
            >
              📍 {areaLabel}
            </div>
          </div>
        )}

        {/* スポット一覧 */}
        {spots.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              flex: 1,
            }}
          >
            {spots.map((spot, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  background: 'rgba(255,255,255,0.75)',
                  borderRadius: 20,
                  padding: '28px 32px',
                  border: '1px solid rgba(251,207,232,0.6)',
                }}
              >
                {/* 時間 */}
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#BE185D',
                    minWidth: 100,
                  }}
                >
                  {spot.time}
                </div>
                {/* 区切り線 */}
                <div
                  style={{
                    width: 2,
                    height: 40,
                    background: '#FBCFE8',
                    borderRadius: 2,
                  }}
                />
                {/* 場所 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: '#1F2937' }}>
                    {spot.place}
                  </div>
                  {spot.category && (
                    <div style={{ fontSize: 22, color: '#9CA3AF' }}>
                      {spot.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ブランディング */}
        <div
          style={{
            marginTop: 60,
            fontSize: 26,
            color: '#D1D5DB',
            letterSpacing: 1,
          }}
        >
          dateplan.app
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  )
}
