import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPromoBySlug } from '@/shared/api/promo/getPromoBySlug'
import { getProductsByIds } from '@/shared/api/products/getProductsByIds'
import { PromoProductsSlider } from '@/widgets/promo/ui/PromoProductsSlider'
import { PromoSignupForm } from '@/widgets/promo/ui/PromoSignupForm'
import { parseRichTextBlock } from '@/shared/utils/richText'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'

export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata(
  { params }: PromoDetailPageProps
): Promise<Metadata> {
  const { slug } = await params
  const promo = await getPromoBySlug(slug)

  if (!promo) {
    return { title: 'Акция — OSA-MARKET' }
  }

  const title = promo.acf.zagolovok
  const description = stripHtml(promo.acf.opisanie || '').slice(0, 200)
  const url = `${SITE_URL}/promos/${slug}`
  const image = getBackendMediaUrl(promo.acf.oblozhka) || undefined

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

  const yoast = promo.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: `/promos/${slug}`,
  })
}

interface PromoDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function PromoDetailPage({ params }: PromoDetailPageProps) {
  const { slug } = await params
  const promo = await getPromoBySlug(slug)

  if (!promo) return notFound()

  const coverImageUrl = getBackendMediaUrl(promo.acf.oblozhka)
  const coverImageAlt = getBackendMediaAlt(promo.acf.oblozhka, promo.acf.zagolovok)
  const relatedIds = promo.acf.svyazannye_tovary?.map((item) => item.tovar) ?? []
  const relatedProducts = await getProductsByIds(relatedIds)

  return (
    <main className="bg-background">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
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
            <div className="h-full w-full bg-muted/60" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl text-white space-y-4">
            {promo.acf.skidka && (
              <span className="inline-flex rounded-full bg-primary/90 px-4 py-1 text-sm font-semibold text-black">
                {promo.acf.skidka}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-balance">
              {promo.acf.zagolovok}
            </h1>
            <p className="text-sm md:text-base text-white/80">
              Действует до: {promo.acf.srok_dejstviya_do}
            </p>
            <div className="text-base md:text-lg text-white/90">
              {parseRichTextBlock(promo.acf.opisanie)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Товары в акции
          </h2>
          <PromoProductsSlider products={relatedProducts} />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Условия получения
              </h3>
              <div className="text-sm text-muted-foreground">
                {parseRichTextBlock(promo.acf.usloviya_polucheniya)}
              </div>
            </div>
            <PromoSignupForm />
          </div>
        </div>
      </section>
    </main>
  )
}
