import { HeroSection } from '@/widgets/hero'
import { CategoriesBlock } from '@/widgets/categories'
import { LogoShowcase } from '@/widgets/logo-showcase'
import { LaptopsBlock } from '@/widgets/laptops'
import { LatestReviews } from '@/widgets/reviews'
import { getMainPage } from '@/shared/api/pages/main'
import { getCategory } from '@/shared/api/products/categories/getCategory'
import { getReviews } from '@/shared/api/products/reviews/getReviews'

export default async function HomePage() {
  const pageDataArray = await getMainPage()
  
  const pageData = pageDataArray[0]
  const heroData = pageData.acf.zaglavnyj_blok
  const categoriesBlock = pageData.acf.blok_kategorij
  const companyBlock = pageData.acf.blok_o_kompanii
  const laptopsBlock = pageData.acf.blok_noutbuki
  const computersBlock = pageData.acf.blok_kompyutery
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
  const latestReviews = await getReviews()

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
      
    </main>
  )
}
