import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import { API_URL, SITE_URL } from '@/shared/config/site'
import { getProductPath } from '@/shared/utils/productRoute'
import type { ProductApi } from '@/shared/types/product'

export type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

type BasicPost = {
  slug: string
  modified?: string
}

type BasicCategory = {
  slug: string
  modified?: string
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>'
const API_PAGE_SIZE = 100

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const xmlResponse = (body: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })

export const buildUrlset = (entries: SitemapEntry[]) => {
  const urls = entries
    .map((entry) => {
      const parts = [
        `<loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
        entry.changefreq
          ? `<changefreq>${escapeXml(entry.changefreq)}</changefreq>`
          : '',
        typeof entry.priority === 'number'
          ? `<priority>${entry.priority.toFixed(1)}</priority>`
          : '',
      ].filter(Boolean)

      return `<url>${parts.join('')}</url>`
    })
    .join('')

  return `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

export const buildSitemapIndex = (paths: string[]) => {
  const body = paths
    .map((path) => {
      const loc = `${SITE_URL}${path}`
      return `<sitemap><loc>${escapeXml(loc)}</loc></sitemap>`
    })
    .join('')

  return `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}

const safeFetch = async <T,>(url: string): Promise<T[]> => {
  const items: T[] = []
  let page = 1

  while (page < 100) {
    try {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}page=${page}`, {
        next: { revalidate: 3600 },
      })

      if (!res.ok) break

      const data = (await res.json()) as T[]
      items.push(...data)

      if (data.length < API_PAGE_SIZE) break
      page += 1
    } catch {
      break
    }
  }

  return items
}

export const fetchAllNews = () =>
  safeFetch<BasicPost>(`${API_URL}/wp/v2/news?per_page=${API_PAGE_SIZE}`)

export const fetchAllPromos = () =>
  safeFetch<BasicPost>(`${API_URL}/wp/v2/promo?per_page=${API_PAGE_SIZE}`)

export const fetchAllCategories = () =>
  safeFetch<BasicCategory>(`${API_URL}/wp/v2/product_cat?per_page=${API_PAGE_SIZE}`)

export const fetchAllProducts = async (): Promise<ProductApi[]> => {
  const items: ProductApi[] = []
  let page = 1

  while (page < 100) {
    try {
      const result = await axiosInstance.get<ProductApi[]>(
        `${API.getProducts}&page=${page}`
      )
      const data = result.data ?? []
      items.push(...data)

      if (data.length < API_PAGE_SIZE) break
      page += 1
    } catch {
      break
    }
  }

  return items
}

const nowIso = () => new Date().toISOString()

export const getStaticEntries = (): SitemapEntry[] => {
  const now = nowIso()

  return [
    {
      loc: `${SITE_URL}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1,
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/buyout`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/how-to-pass`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${SITE_URL}/news`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/promos`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/privacy-policy`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: `${SITE_URL}/terms-of-use`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: `${SITE_URL}/delivery`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: `${SITE_URL}/warranty-and-refund`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5,
    },
  ]
}

export const getNewsEntries = async (): Promise<SitemapEntry[]> => {
  const items = await fetchAllNews()

  return items.map((item) => ({
    loc: `${SITE_URL}/news/${item.slug}`,
    lastmod: item.modified
      ? new Date(item.modified).toISOString()
      : nowIso(),
    changefreq: 'weekly',
    priority: 0.7,
  }))
}

export const getPromoEntries = async (): Promise<SitemapEntry[]> => {
  const items = await fetchAllPromos()

  return items.map((item) => ({
    loc: `${SITE_URL}/promos/${item.slug}`,
    lastmod: item.modified
      ? new Date(item.modified).toISOString()
      : nowIso(),
    changefreq: 'weekly',
    priority: 0.7,
  }))
}

export const getCategoryEntries = async (): Promise<SitemapEntry[]> => {
  const items = await fetchAllCategories()

  return items.map((item) => ({
    loc: `${SITE_URL}/catalog/${item.slug}`,
    lastmod: item.modified
      ? new Date(item.modified).toISOString()
      : nowIso(),
    changefreq: 'daily',
    priority: 0.9,
  }))
}

export const getProductEntries = async (): Promise<SitemapEntry[]> => {
  const items = await fetchAllProducts()

  return items.map((item) => ({
    loc: `${SITE_URL}${getProductPath(item)}`,
    lastmod: item.date_modified
      ? new Date(item.date_modified).toISOString()
      : nowIso(),
    changefreq: 'daily',
    priority: 0.8,
  }))
}
