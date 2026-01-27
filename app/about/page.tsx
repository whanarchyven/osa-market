import { AboutHero, AboutStory, AboutStats, AboutTeam, AboutValues, AboutCTA } from '@/widgets/about'
import { getAboutPageData } from '@/shared/api/pages/about/getAboutPageData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О нас - OSA-MARKET',
  description: 'Узнайте о компании OSA-MARKET: наша история, команда, ценности и миссия в мире компьютерных технологий.'
}

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
      <AboutTeam
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
      />
      <AboutValues
        zagolovok_cennostei={acf.blok_czennosti.zagolovok}
        cennosti={acf.blok_czennosti.czennosti.map((c) => c.czennost)}
      />
      <AboutCTA
        zagolovok_cta={acf.klikbejt_blok.zagolovok}
        podzagolovok_cta={acf.klikbejt_blok.tekst}
      />
    </main>
  )
}
