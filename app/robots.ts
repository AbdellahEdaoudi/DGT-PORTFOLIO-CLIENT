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
          '/success',
        ],
      },
    ],
    sitemap: 'https://mylio.site/sitemap.xml',
  }
}
