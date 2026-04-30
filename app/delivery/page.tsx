import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/shared/api/pages/getPageBySlug'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { WordpressLegalPage } from '@/shared/ui/WordpressLegalPage'

/** Временно: обновление кэша не реже раза в минуту (см. warranty-and-refund, footer). */
export const revalidate = 60

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('delivery')

  if (!page) {
    return {
      title: 'Доставка и оплата - OSA-MARKET',
      description: 'Информация о доставке и оплате в OSA-MARKET.',
    }
  }

  const fallback: Metadata = {
    title: page.title.rendered,
    description: stripHtml(page.excerpt.rendered || page.content.rendered).slice(0, 200),
  }

  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, page.yoast_head_json, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: '/delivery',
  })
}

export default async function DeliveryPage() {
  const page = await getPageBySlug('delivery')

  if (!page) {
    notFound()
  }

  return <WordpressLegalPage html={page.acf?.text || page.content.rendered} />
}
