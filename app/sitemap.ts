import type { MetadataRoute } from 'next'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi } from '@/shared/types/product'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'
const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL || 'https://api.osa-market.ru/wp-json'

type BasicPost = {
  slug: string
  modified?: string
}

type BasicCategory = {
  slug: string
  modified?: string
}

const safeFetch = async <T,>(url: string): Promise<T[]> => {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return (await res.json()) as T[]
  } catch {
    return []
  }
}

const safeFetchProducts = async (): Promise<ProductApi[]> => {
  try {
    const result = await axiosInstance.get<ProductApi[]>(API.getProducts)
    return result.data ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/about',
    '/buyout',
    '/how-to-pass',
    '/news',
    '/promos',
  ]

  const [news, promos, categories, products] = await Promise.all([
    safeFetch<BasicPost>(`${API_URL}/wp/v2/news?per_page=100`),
    safeFetch<BasicPost>(`${API_URL}/wp/v2/promo?per_page=100`),
    safeFetch<BasicCategory>(`${API_URL}/wp/v2/product_cat?per_page=100`),
    safeFetchProducts(),
  ])

  const now = new Date()

  const staticUrls = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }))

  const newsUrls = news.map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.modified ? new Date(item.modified) : now,
  }))

  const promoUrls = promos.map((item) => ({
    url: `${SITE_URL}/promos/${item.slug}`,
    lastModified: item.modified ? new Date(item.modified) : now,
  }))

  const categoryUrls = categories.map((item) => ({
    url: `${SITE_URL}/catalog/${item.slug}`,
    lastModified: item.modified ? new Date(item.modified) : now,
  }))

  const productUrls = products.map((item) => ({
    url: `${SITE_URL}/product/${item.id}`,
    lastModified: item.date_modified ? new Date(item.date_modified) : now,
  }))

  return [
    ...staticUrls,
    ...newsUrls,
    ...promoUrls,
    ...categoryUrls,
    ...productUrls,
  ]
}
