import { HeroSection } from '@/widgets/hero'
import { getMainPage } from '@/shared/api/pages/main'

export default async function HomePage() {
  const pageDataArray = await getMainPage()
  
  const pageData = pageDataArray[0]
  const heroData = pageData.acf.zaglavnyj_blok

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
      {/* Здесь будут добавляться другие блоки страницы с пропсами из data */}
    </main>
  )
}
