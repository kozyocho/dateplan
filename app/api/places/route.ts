import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ place: null })

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return NextResponse.json({ place: null })

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.rating,places.userRatingCount,places.photos,places.currentOpeningHours,places.websiteUri',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'ja', maxResultCount: 1 }),
  })

  if (!res.ok) return NextResponse.json({ place: null })

  const data = await res.json()
  const place = data.places?.[0]
  if (!place) return NextResponse.json({ place: null })

  const photos = ((place.photos ?? []) as { name: string }[])
    .slice(0, 5)
    .map((p) => `https://places.googleapis.com/v1/${p.name}/media?maxHeightPx=500&maxWidthPx=800&key=${apiKey}`)

  return NextResponse.json({
    place: {
      rating: place.rating ?? null,
      ratingCount: place.userRatingCount ?? null,
      photos,
      isOpen: place.currentOpeningHours?.openNow ?? null,
      website: place.websiteUri ?? null,
    },
  })
}
