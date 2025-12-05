import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/Admin', '/Admin/','/update-profile','/update-profile/','/BusinessLinks'],
    },
    sitemap: `https://dgtportfolio.com/sitemap.xml`,
  }
}
