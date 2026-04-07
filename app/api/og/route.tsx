import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = (searchParams.get('title') ?? 'デートプラン').slice(0, 100)
  const area = (searchParams.get('area') ?? '').slice(0, 50)
  const spotsRaw = searchParams.get('spots') ?? '0'
  const spots = /^\d+$/.test(spotsRaw) ? spotsRaw : '0'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 50%, #FFF1F2 100%)',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 26, color: '#BE185D', marginBottom: 20, fontWeight: 700, letterSpacing: 2 }}>
          AI デートプラン
        </div>
        <div
          style={{
            fontSize: title.length > 20 ? 44 : 56,
            fontWeight: 800,
            color: '#1F2937',
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: 36,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {area && (
            <div
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 32,
                padding: '10px 24px',
                fontSize: 22,
                color: '#6B7280',
                border: '1px solid #FCE7F3',
              }}
            >
              {area}
            </div>
          )}
          {spots !== '0' && (
            <div
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 32,
                padding: '10px 24px',
                fontSize: 22,
                color: '#6B7280',
                border: '1px solid #FCE7F3',
              }}
            >
              {spots}スポット
            </div>
          )}
        </div>
        <div style={{ marginTop: 48, fontSize: 18, color: '#D1D5DB' }}>
          dateplan.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
