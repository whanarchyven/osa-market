import { buildSitemapIndex, xmlResponse } from '@/shared/seo/sitemap'

export async function GET() {
  return xmlResponse(
    buildSitemapIndex([
      '/sitemaps/static.xml',
      '/sitemaps/categories.xml',
      '/sitemaps/products.xml',
      '/sitemaps/news.xml',
      '/sitemaps/promos.xml',
    ])
  )
}
