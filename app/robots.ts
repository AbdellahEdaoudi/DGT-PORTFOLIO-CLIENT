import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/admin',
          '/payment',
          '/update-profile',
          '/business-links',
          '/success',
        ],
      },
    ],
    sitemap: 'https://dgtportfolio.com/sitemap.xml',
  }
}
