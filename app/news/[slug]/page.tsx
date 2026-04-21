import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getNewsBySlug } from '@/shared/api/news/getNewsBySlug'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'

export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(
  { params }: NewsDetailPageProps
): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    return { title: 'Новость — OSA-MARKET' }
  }

  const title = news.acf.zagolovok
  const description = stripHtml(news.acf.kontent || '').slice(0, 200)
  const url = `${SITE_URL}/news/${slug}`
  const image = getBackendMediaUrl(news.acf.oblozhka) || undefined

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
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }

  const yoast = news.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: `/news/${slug}`,
  })
}

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) return notFound()

  const coverImageUrl = getBackendMediaUrl(news.acf.oblozhka)
  const coverImageAlt = getBackendMediaAlt(news.acf.oblozhka, news.acf.zagolovok)

  return (
    <main className="bg-background">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted/30" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
            {news.acf.zagolovok}
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            {news.acf.avtor}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div
            className="prose prose-invert whitespace-pre-wrap max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: news.acf.kontent }}
          />
        </div>
      </section>
    </main>
  )
}
