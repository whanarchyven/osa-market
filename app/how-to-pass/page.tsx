import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getHowToPassPageData } from '@/shared/api/pages/how-to-pass/getHowToPassPageData'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'

export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getHowToPassPageData()
  const page = pageData[0]

  if (!page) {
    return {
      title: 'Как добраться — OSA-MARKET',
    }
  }

  const title = page.acf?.zagolovok || page.title?.rendered || 'Как добраться'
  const description = stripHtml(page.acf?.content || '').slice(0, 200)
  const url = `${SITE_URL}/how-to-pass`

  const fallback: Metadata = {
    title: `${title} — OSA-MARKET`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
  }

  const yoast = page.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: '/how-to-pass',
  })
}

export default async function HowToPassPage() {
  const pageData = await getHowToPassPageData()
  const page = pageData[0]

  if (!page) return notFound()

  const title = page.acf?.zagolovok || page.title?.rendered || 'Как добраться'
  const content = page.acf?.content || ''

  return (
    <main className="min-h-screen bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {title}
          </h1>
          <div
            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-img:rounded-lg prose-img:mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </main>
  )
}
