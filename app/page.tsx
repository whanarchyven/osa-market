import { HeroSection } from '@/widgets/hero'
import { CategoriesBlock } from '@/widgets/categories'
import { LogoShowcase } from '@/widgets/logo-showcase'
import { LaptopsBlock } from '@/widgets/laptops'
import { LatestReviews } from '@/widgets/reviews'
import { BrandsMarquee } from '@/widgets/brands'
import { TradeIn } from '@/widgets/buyout'
import { getMainPage } from '@/shared/api/pages/main'
import { getCategory } from '@/shared/api/products/categories/getCategory'
import { getReviews } from '@/shared/api/products/reviews/getReviews'
import { getBrands } from '@/shared/api/products/brands/getBrands'
import type { ProductBrandApi } from '@/shared/types/product'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

export const metadata: Metadata = {
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

export const revalidate = 60

export default async function HomePage() {
  const [pageDataArray, latestReviews, brands] = await Promise.all([
    getMainPage(),
    getReviews(),
    getBrands(),
  ])

  const pageData = pageDataArray[0]
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

  const categoryIds =
    categoriesBlock?.categories
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

  const brandMap = new Map<number, ProductBrandApi>(
    brands.map((brand) => [brand.id, brand])
  )

  const firstGroupBrands =
    brandsBlock?.brendy_pervoj_gruppy
      ?.map((item) => brandMap.get(item.brand))
      .filter(
        (brand): brand is ProductBrandApi => Boolean(brand)
      ) ?? []

  const secondGroupBrands =
    brandsBlock?.brendy_vtoroj_gruppy
      ?.map((item) => brandMap.get(item.brand))
      .filter(
        (brand): brand is ProductBrandApi => Boolean(brand)
      ) ?? []

  return (
    <main>
      <HeroSection 
        slogan={heroData.slogan}
        opisanie={heroData.opisanie}
        fakty={heroData.fakty}
        preimushhestva={heroData.preimushhestva}
        nazvanie_bloka_s_tovarami={heroData.nazvanie_bloka_s_tovarami}
        opisanie_bloka_s_tovarami={heroData.opisanie_bloka_s_tovarami}
        tovary={heroData.tovary}
        ssylka_na_video={heroData.ssylka_na_video}
      />
      
      
      {categoriesBlock && (
        <CategoriesBlock title={categoriesBlock.zagolovok} categories={categories} />
      )}
      <LogoShowcase blok={companyBlock} />
      
      {laptopsBlock && (
        <LaptopsBlock title={laptopsBlock.zagolovok} products={laptopProducts} />
      )}
      {computersBlock && (
        <LaptopsBlock title={computersBlock.zagolovok} products={computerProducts} titleAlign="right" />
      )}
      <LatestReviews reviews={latestReviews} />
      {brandsBlock && (
        <BrandsMarquee
          titleHtml={brandsBlock.zagolovok_bloka}
          firstGroup={firstGroupBrands}
          secondGroup={secondGroupBrands}
        />
      )}
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
