import { type PlanConditions } from '@/types'

export type SpotCandidate = {
  name: string
  rating: number | null
  genreLabel: string
}

const GENRE_QUERY: Record<string, { query: string; label: string }> = {
  gourmet:     { query: 'レストラン 食事',    label: 'グルメ・食事' },
  cafe:        { query: 'カフェ 喫茶店',      label: 'カフェ・喫茶' },
  nature:      { query: '公園 自然スポット',  label: '自然' },
  art:         { query: '美術館 ギャラリー',  label: 'アート' },
  shopping:    { query: 'ショッピング',        label: 'ショッピング' },
  activity:    { query: 'アクティビティ 体験', label: 'アクティビティ' },
  movie:       { query: '映画館',             label: '映画' },
  amusement:   { query: '遊園地',             label: '遊園地' },
  sightseeing: { query: '観光スポット 名所',  label: '観光' },
  night_view:  { query: '夜景 展望台',        label: '夜景' },
}

const AREA_CENTER: Record<string, { latitude: number; longitude: number }> = {
  nagoya: { latitude: 35.1815, longitude: 136.9066 },
  tokyo:  { latitude: 35.6762, longitude: 139.6503 },
}

const AREA_NAME: Record<string, string> = {
  nagoya: '名古屋',
  tokyo: '東京',
}

export async function searchSpotsForPlan(
  conditions: PlanConditions,
  apiKey: string
): Promise<SpotCandidate[]> {
  const areaName = AREA_NAME[conditions.area] ?? conditions.area
  const center = AREA_CENTER[conditions.area]
  const genres = (
    conditions.genre_preferences.length > 0
      ? conditions.genre_preferences.slice(0, 4)
      : ['gourmet', 'cafe', 'sightseeing']
  ).filter((g) => GENRE_QUERY[g])

  const results = await Promise.allSettled(
    genres.map(async (genre) => {
      const g = GENRE_QUERY[genre]
      const textQuery = conditions.location
        ? `${areaName} ${conditions.location} ${g.query}`
        : `${areaName} ${g.query}`

      const body: Record<string, unknown> = {
        textQuery,
        languageCode: 'ja',
        maxResultCount: 5,
      }
      if (center) {
        body.locationBias = { circle: { center, radius: 12000 } }
      }

      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.rating',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) return []

      const data = await res.json()
      return (
        (
          data.places as {
            displayName?: { text?: string }
            rating?: number
          }[]
        ) ?? []
      )
        .map((p) => ({
          name: p.displayName?.text ?? '',
          rating: p.rating ?? null,
          genreLabel: g.label,
        }))
        .filter((p) => p.name) as SpotCandidate[]
    })
  )

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}
