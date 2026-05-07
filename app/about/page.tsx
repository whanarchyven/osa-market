import {
  AboutCTA,
  AboutHero,
  AboutStory,
  AboutStats,
  AboutValues,
  AboutYandexReviews,
} from '@/widgets/about'
import { getAboutPageData } from '@/shared/api/pages/about/getAboutPageData'
import type { Metadata } from 'next'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const aboutFallbackMetadata: Metadata = {
  title: 'О нас - OSA-MARKET',
  description: 'Узнайте о компании OSA-MARKET: наша история, ценности и миссия в мире компьютерных технологий.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'О нас - OSA-MARKET',
    description:
      'Узнайте о компании OSA-MARKET: наша история, ценности и миссия в мире компьютерных технологий.',
    url: `${SITE_URL}/about`,
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getAboutPageData()
    const yoast = data[0]?.yoast_head_json
    const { siteUrl, apiBaseUrl } = seoContextFromEnv()
    return buildMetadataWithYoast(aboutFallbackMetadata, yoast, {
      siteUrl,
      apiBaseUrl,
      canonicalPath: '/about',
    })
  } catch {
    return aboutFallbackMetadata
  }
}

/** Редко меняющаяся страница: обновление раз в неделю достаточно. */
export const revalidate = 604800

export default async function AboutPage() {
  const data = await getAboutPageData()
  const { acf } = data[0]

  return (
    <main className="bg-background">
      <AboutHero
        zagolovok={acf.zaglavnyj_blok.zagolovok}
        podzagolovok={acf.zaglavnyj_blok.podzagolovok}
        polnoekrannoe_izobrazhenie={acf.zaglavnyj_blok.ssylka_na_video}
      />
      <AboutStory
        zagolovok_istorii={acf.blok_s_istoriej.zagolovok}
        tekst_istorii={acf.blok_s_istoriej.kontent}
        gallereya={acf.blok_s_istoriej.gallereya}
        akcent_zagolovok={acf.blok_s_istoriej.akczentirovannyj_blok.zagolovok}
        akcent_podzagolovok={acf.blok_s_istoriej.akczentirovannyj_blok.podzagolovok}
      />
      <AboutStats
        zagolovok_statistiki={acf.blok_czifry.zagolovok}
        statistika={acf.blok_czifry.plashki_czifr.map((p) => ({
          chislo: p.plashka.zagolovok,
          opisanie: p.plashka.podzagolovok,
        }))}
      />
      {/* <AboutTeam
        zagolovok_komandy={acf.blok_s_komandoj.zagolovok}
        opisanie_komandy={acf.blok_s_komandoj.podzagolovok}
        chlenov_komandy={acf.blok_s_komandoj.komanda.map(
          (k) => ({
            imya: k.chlen_komandy.imya,
            dolzhnost: k.chlen_komandy.dolzhnost,
            opisanie: k.chlen_komandy.tekst,
            foto: k.chlen_komandy.izobrazhenie,
          })
        )}
      /> */}
      <AboutValues
        zagolovok_cennostei={acf.blok_czennosti.zagolovok}
        cennosti={acf.blok_czennosti.czennosti.map((c) => c.czennost)}
      />
      <AboutYandexReviews />
      <AboutCTA
        zagolovok_cta={acf.klikbejt_blok.zagolovok}
        podzagolovok_cta={acf.klikbejt_blok.tekst}
      />
    </main>
  )
}
