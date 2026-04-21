import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/shared/api/pages/getPageBySlug'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { WordpressLegalPage } from '@/shared/ui/WordpressLegalPage'

export const revalidate = 604800

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('terms-of-use')

  if (!page) {
    return {
      title: 'Условия использования - OSA-MARKET',
      description: 'Условия использования сайта OSA-MARKET.',
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
    canonicalPath: '/terms-of-use',
  })
}

export default async function TermsOfUsePage() {
  const page = await getPageBySlug('terms-of-use')

  if (!page) {
    notFound()
  }

  return <WordpressLegalPage html={page.acf?.text || page.content.rendered} />
}
