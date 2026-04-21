import {
  BuyoutHero,
  WhatWeBuy,
  BuyoutSteps,
  TradeIn,
} from '@/widgets/buyout'
import { getBuyoutData } from '@/shared/api'
import type { Metadata } from 'next'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const buyoutFallbackMetadata: Metadata = {
  title: 'Выкуп техники - OSA-MARKET',
  description: 'Дорого выкупим ноутбуки, ПК и комплектующие. Быстрая оценка и оплата сразу.',
  alternates: {
    canonical: `${SITE_URL}/buyout`,
  },
  openGraph: {
    title: 'Выкуп техники - OSA-MARKET',
    description:
      'Дорого выкупим ноутбуки, ПК и комплектующие. Быстрая оценка и оплата сразу.',
    url: `${SITE_URL}/buyout`,
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getBuyoutData()
    const yoast = data[0]?.yoast_head_json
    const { siteUrl, apiBaseUrl } = seoContextFromEnv()
    return buildMetadataWithYoast(buyoutFallbackMetadata, yoast, {
      siteUrl,
      apiBaseUrl,
      canonicalPath: '/buyout',
    })
  } catch {
    return buyoutFallbackMetadata
  }
}

export const revalidate = 60

export default async function BuyoutPage() {
  const data = await getBuyoutData()
  const pageData = data[0]

  return (
    <main className="bg-background">
      <BuyoutHero
        data={pageData.acf.zaglavnyj_blok_vykupa}
        contacts={pageData.acf.kontaktnye_dannye_v_forme}
      />
      <WhatWeBuy data={pageData.acf.blok_chto_vykupaem} />
      <BuyoutSteps data={pageData.acf.blok_shagi_vykupa} />
    </main>
  )
}
