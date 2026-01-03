import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dgtportfolio.com'
  
  // Static pages
  const languages = ['ar', 'es', 'fr', 'ru', 'ja', 'zh', 'de', 'nl', 'pt', 'it', 'hi', 'tr', 'ko', 'en', 'id', 'pl']
  
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
      url: `${baseUrl}/subscription`,
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

  const staticPages = [...basePages, ...languagePages]

  // Fetch all active users with subscriptions
  let userPages: MetadataRoute.Sitemap = []
  
  try {
    const backendUrl = process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app'
    const response = await fetch(`${backendUrl}/users/active-usernames`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (response.ok) {
      const data = await response.json()
      const usernames: string[] = data.usernames || []
      
      // Add subdomain URLs for all users
      userPages = usernames.map((username) => ({
        url: `https://${username}.dgtportfolio.com`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    }
  } catch (error) {
    console.error('Error fetching users for sitemap:', error)
  }

  return [...staticPages, ...userPages]
}
