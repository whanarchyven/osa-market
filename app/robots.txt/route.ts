import { SITE_URL } from '@/shared/config/site'

const DISALLOW_PATHS = ['/cart', '/account', '/login', '/favorites', '/order-success']

export async function GET() {
  const host = new URL(SITE_URL).host
  const disallowLines = DISALLOW_PATHS.map((path) => `Disallow: ${path}`).join('\n')

  const body = `User-agent: *
Allow: /
${disallowLines}

User-agent: Googlebot
Allow: /
${disallowLines}

User-agent: Yandex
Allow: /
${disallowLines}
Clean-param: page&sort /catalog/
Clean-param: page /news/
Clean-param: page /promos/
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&fbclid /

Host: ${host}
Sitemap: ${SITE_URL}/sitemap.xml
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
