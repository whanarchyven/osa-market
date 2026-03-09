import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/account', '/login', '/favorites', '/order-success'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
