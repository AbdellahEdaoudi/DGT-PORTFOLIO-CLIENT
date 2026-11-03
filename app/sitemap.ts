import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mylio.site'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://mylio-server.vercel.app'

  // Static pages
  const languages = ['ar', 'es', 'fr', 'ru', 'ja', 'zh', 'de', 'nl', 'pt', 'it', 'hi', 'tr', 'ko', 'en', 'id', 'pl', 'sv', 'vi']

  const basePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const languagePages: MetadataRoute.Sitemap = languages.map(lang => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  let userPages: MetadataRoute.Sitemap = []

  try {
    let res = await fetch(`${serverUrl}/api/users/sitemap-users`, {
      next: { revalidate: 3600 },
    }).catch(() => null)

    // Fallback to production URL if local server is unreachable
    if ((!res || !res.ok) && serverUrl !== 'https://mylio-server.vercel.app') {
      res = await fetch('https://mylio-server.vercel.app/api/users/sitemap-users', {
        next: { revalidate: 3600 },
      }).catch(() => null)
    }

    if (res && res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.users)) {
        userPages = data.users
          .filter((u: { username: string }) => Boolean(u?.username))
          .map((u: { username: string; lastModified?: string | Date }) => ({
            url: `https://${u.username.toLowerCase().trim()}.mylio.site`,
            lastModified: u.lastModified ? new Date(u.lastModified) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
      }
    }
  } catch (error) {
    console.error('Error fetching users for sitemap:', error)
  }

  return [...basePages, ...languagePages, ...userPages]
}
