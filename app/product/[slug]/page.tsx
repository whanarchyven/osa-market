import { cache } from 'react'
import { ProductGallery, ProductInfo, ProductReviewForm } from '@/widgets/product'
import type { Metadata } from 'next'
import { getProductById } from '@/shared/api/products/getProductById'
import { getProductBySlug } from '@/shared/api/products/getProductBySlug'
import { getProductsByIds } from '@/shared/api/products/getProductsByIds'
import { getProductReviews } from '@/shared/api/products/reviews/getProductReviews'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { PromoProductsSlider } from '@/widgets/promo/ui/PromoProductsSlider'
import { getProductPath } from '@/shared/utils/productRoute'

export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getResolvedProduct = cache(async (slug: string) => {
  try {
    const productBySlug = await getProductBySlug(slug)
    if (productBySlug) {
      return { product: productBySlug, isLegacyId: false }
    }
  } catch {
    // If slug lookup fails, try legacy id fallback below.
  }

  if (/^\d+$/.test(slug)) {
    try {
      const productById = await getProductById(Number(slug))
      return { product: productById, isLegacyId: true }
    } catch {
      return null
    }
  }

  return null
})

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { slug } = await params
  const resolved = await getResolvedProduct(slug)

  if (!resolved) {
    return { title: 'Товар — OSA-MARKET' }
  }

  const { product } = resolved

  const title = `${product.name} — купить в OSA-MARKET`
  const description = stripHtml(product.short_description || product.description || '')
  const image = product.images?.[0]?.src
  const url = `${SITE_URL}${getProductPath(product)}`

  const fallback: Metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }

  const yoast = product.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: getProductPath(product),
  })
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const resolved = await getResolvedProduct(slug)

  if (!resolved) {
    return notFound()
  }

  const { product, isLegacyId } = resolved

  if (isLegacyId) {
    permanentRedirect(getProductPath(product))
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getProductsByIds(product.upsell_ids ?? []),
  ])
  const productUrl = `${SITE_URL}${getProductPath(product)}`
  const primaryImage = product.images?.[0]?.src
  const offerPrice = product.on_sale ? product.sale_price : product.price
  const availability =
    product.stock_status === 'instock'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'

  const category = product.categories[0]
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: `${SITE_URL}/`,
    },
    ...(category
      ? [
          {
            '@type': 'ListItem',
            position: 2,
            name: category.name,
            item: `${SITE_URL}/catalog/${category.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 2,
            name: product.name,
            item: productUrl,
          },
        ]),
  ]

  return (
    <main className="min-h-screen bg-background pt-4 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: stripHtml(product.short_description || product.description || ''),
            sku: product.sku || undefined,
            image: primaryImage ? [primaryImage] : undefined,
            brand: product.brands?.[0]
              ? { '@type': 'Brand', name: product.brands[0].name }
              : undefined,
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: 'RUB',
              price: offerPrice || undefined,
              availability,
            },
            aggregateRating:
              product.rating_count > 0
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: Number(product.average_rating || 0),
                    reviewCount: product.rating_count,
                  }
                : undefined,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems,
          }),
        }}
      />
      <div className="container mx-auto px-4">
          {/* Хлебные крошки */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/catalog/${category.slug}`}>
                      {category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[300px] truncate">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Основной контент товара */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Галерея */}
            <div>
              <ProductGallery 
                images={product.images} 
                productName={product.name} 
              />
            </div>

            {/* Информация о товаре */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          

          {/* Табы с описанием и характеристиками */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-card border border-border">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specs">Все характеристики</TabsTrigger>
              <TabsTrigger value="reviews">
                Отзывы ({product.rating_count})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div 
                className="prose whitespace-pre-wrap prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>
            
            <TabsContent value="specs" className="mt-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {product.attributes.map((attr, index) => (
                  <div 
                    key={attr.id || attr.name}
                    className={cn(
                      "flex items-start py-3 px-4",
                      index % 2 === 0 ? "bg-secondary/20" : ""
                    )}
                  >
                    <span className="text-muted-foreground w-1/2 shrink-0">
                      {attr.name}
                    </span>
                    <span className="text-foreground">
                      {attr.options.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.length ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {review.reviewer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date_created).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${review.id}-star-${index}`}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? 'text-primary fill-primary'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div
                          className="mt-3 prose prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: review.review }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Пока нет отзывов</p>
                  </div>
                )}
                <ProductReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>

          {relatedProducts.length > 0 && (
            <section className="my-14">
              <h2 className="mb-6 text-2xl md:text-3xl font-bold text-foreground">
                Смотрите также
              </h2>
              <PromoProductsSlider products={relatedProducts} />
            </section>
          )}
      </div>
    </main>
  )
}
