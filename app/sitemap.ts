import type { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dateplan.app'

const SCENES = ['rainy', 'anniversary', 'first-date', 'night', 'cheap', 'outdoor'] as const
const AREAS = ['nagoya', 'tokyo'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const scenePages: MetadataRoute.Sitemap = AREAS.flatMap((area) =>
    SCENES.map((scene) => ({
      url: `${APP_URL}/plans/${area}/${scene}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/generate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/plans/nagoya`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/plans/tokyo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...scenePages,
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
