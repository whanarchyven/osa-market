import {
  BuyoutHero,
  WhatWeBuy,
  BuyoutSteps,
  TradeIn,
} from '@/widgets/buyout'
import { getBuyoutData } from '@/shared/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Выкуп техники - OSA-MARKET',
  description: 'Дорого выкупим ноутбуки, ПК и комплектующие. Быстрая оценка и оплата сразу.'
}

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
