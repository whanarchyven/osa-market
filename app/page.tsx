import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/widgets/hero'
import { CategoriesBlock } from '@/widgets/categories'
import { LogoShowcase } from '@/widgets/logo-showcase'
import { TradeIn } from '@/widgets/buyout'
import { getMainPage } from '@/shared/api/pages/main'
import { getCategory } from '@/shared/api/products/categories/getCategory'
import { getReviews } from '@/shared/api/products/reviews/getReviews'
import { getBrands } from '@/shared/api/products/brands/getBrands'
import type { ProductBrandApi } from '@/shared/types/product'
import type { Metadata } from 'next'
import type { BlokKategorij, BrandsBlock } from '@/shared/api/pages/main/types'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const homeFallbackMetadata: Metadata = {
  title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
  description:
    'Интернет-магазин компьютерной техники OSA-MARKET. Ноутбуки, готовые сборки ПК, видеокарты, процессоры и игровая периферия от ведущих брендов. Доставка по всей России.',
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
    description:
      'Интернет-магазин компьютерной техники OSA-MARKET. Ноутбуки, готовые сборки ПК, видеокарты, процессоры и игровая периферия от ведущих брендов. Доставка по всей России.',
    url: `${SITE_URL}/`,
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pages = await getMainPage()
    const yoast = pages[0]?.yoast_head_json
    const { siteUrl, apiBaseUrl } = seoContextFromEnv()
    return buildMetadataWithYoast(homeFallbackMetadata, yoast, {
      siteUrl,
      apiBaseUrl,
      canonicalPath: '/',
    })
  } catch {
    return homeFallbackMetadata
  }
}

export const revalidate = 60

const LaptopsBlock = dynamic(() =>
  import('@/widgets/laptops').then((mod) => mod.LaptopsBlock)
)
const LatestReviews = dynamic(() =>
  import('@/widgets/reviews').then((mod) => mod.LatestReviews)
)
const BrandsMarquee = dynamic(() =>
  import('@/widgets/brands').then((mod) => mod.BrandsMarquee)
)

function SectionSkeleton({ className = 'py-12' }: { className?: string }) {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="h-8 w-56 animate-pulse rounded bg-muted/40" />
        <div className="mt-6 h-40 animate-pulse rounded-3xl bg-muted/20" />
      </div>
    </section>
  )
}

async function CategoriesSection({
  categoriesBlock,
}: {
  categoriesBlock: BlokKategorij
}) {
  const categoryIds =
    categoriesBlock.categories
      ?.flatMap((item) => item.category_id || [])
      .filter((id): id is number => typeof id === 'number') ?? []

  const uniqueCategoryIds = Array.from(new Set(categoryIds))

  const categories = (
    await Promise.all(
      uniqueCategoryIds.map(async (id) => {
        try {
          return await getCategory(id)
        } catch {
          return null
        }
      })
    )
  ).filter((category): category is NonNullable<typeof category> => Boolean(category))

  return <CategoriesBlock title={categoriesBlock.zagolovok} categories={categories} />
}

async function ReviewsSection() {
  const latestReviews = await getReviews()
  return <LatestReviews reviews={latestReviews} />
}

async function BrandsSection({ brandsBlock }: { brandsBlock: BrandsBlock }) {
  const brands = await getBrands()
  const brandMap = new Map<number, ProductBrandApi>(
    brands.map((brand) => [brand.id, brand])
  )

  const firstGroupBrands =
    brandsBlock.brendy_pervoj_gruppy
      ?.map((item) => brandMap.get(item.brand))
      .filter((brand): brand is ProductBrandApi => Boolean(brand)) ?? []

  const secondGroupBrands =
    brandsBlock.brendy_vtoroj_gruppy
      ?.map((item) => brandMap.get(item.brand))
      .filter((brand): brand is ProductBrandApi => Boolean(brand)) ?? []

  return (
    <BrandsMarquee
      titleHtml={brandsBlock.zagolovok_bloka}
      firstGroup={firstGroupBrands}
      secondGroup={secondGroupBrands}
    />
  )
}

export default async function HomePage() {
  const pageDataArray = await getMainPage()

  const pageData = pageDataArray[0]
  if (!pageData) {
    return <main />
  }

  const heroData = pageData.acf.zaglavnyj_blok
  const categoriesBlock = pageData.acf.blok_kategorij
  const companyBlock = pageData.acf.blok_o_kompanii
  const laptopsBlock = pageData.acf.blok_noutbuki
  const computersBlock = pageData.acf.blok_kompyutery
  const brandsBlock = pageData.acf.brands_block
  const tradeInBlock = pageData.acf['blok_trade-in']
  const laptopProducts =
    laptopsBlock?.noutbuki
      ?.map((item) => item.product)
      .filter((product): product is NonNullable<typeof product> => Boolean(product)) ??
    []
  const computerProducts =
    computersBlock?.kompyutery
      ?.map((item) => item.product)
      .filter((product): product is NonNullable<typeof product> => Boolean(product)) ??
    []

  return (
    <main>
      <HeroSection 
        slogan={heroData.slogan}
        opisanie={heroData.opisanie}
        fakty={heroData.fakty}
        preimushhestva={heroData.preimushhestva}
        ssylka_na_video={heroData.ssylka_na_video}
      />

      {categoriesBlock && (
        <Suspense fallback={<SectionSkeleton />}>
          <CategoriesSection categoriesBlock={categoriesBlock} />
        </Suspense>
      )}
      <LogoShowcase blok={companyBlock} />

      {laptopsBlock && (
        <LaptopsBlock
          title={laptopsBlock.zagolovok}
          products={laptopProducts}
          prioritizeFirstImage
        />
      )}
      {computersBlock && (
        <LaptopsBlock title={computersBlock.zagolovok} products={computerProducts} titleAlign="right" />
      )}
      {brandsBlock && (
        <Suspense fallback={<SectionSkeleton />}>
          <BrandsSection brandsBlock={brandsBlock} />
        </Suspense>
      )}
      <Suspense fallback={<SectionSkeleton />}>
        <ReviewsSection />
      </Suspense>
      {tradeInBlock && (
        <TradeIn
          data={tradeInBlock}
          ctaHref="/buyout"
          ctaLabel="Подробнее"
        />
      )}
    </main>
  )
}
