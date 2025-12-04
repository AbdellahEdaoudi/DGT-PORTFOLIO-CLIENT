import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dgtportfolio.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ru`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

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
      const customDomains: Array<{username: string, customDomain: string}> = data.customDomains || []
      
      // Add subdomain URLs for all users
      userPages = usernames.map((username) => ({
        url: `https://${username}.dgtportfolio.com`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))

      // Add custom domain URLs for users with verified custom domains
      const customDomainPages: MetadataRoute.Sitemap = customDomains.map((item) => ({
        url: `https://${item.customDomain}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95,
      }))

      userPages = [...userPages, ...customDomainPages]
    }
  } catch (error) {
    console.error('Error fetching users for sitemap:', error)
  }

  return [...staticPages, ...userPages]
}
