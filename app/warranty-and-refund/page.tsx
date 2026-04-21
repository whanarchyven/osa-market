import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/shared/api/pages/getPageBySlug'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { WordpressLegalPage } from '@/shared/ui/WordpressLegalPage'

export const revalidate = 604800

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('warranty-and-refund')

  if (!page) {
    return {
      title: 'Гарантия и возврат - OSA-MARKET',
      description: 'Условия гарантии и возврата в OSA-MARKET.',
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
    canonicalPath: '/warranty-and-refund',
  })
}

export default async function WarrantyAndRefundPage() {
  const page = await getPageBySlug('warranty-and-refund')

  if (!page) {
    notFound()
  }

  return <WordpressLegalPage html={page.acf?.text || page.content.rendered} />
}
