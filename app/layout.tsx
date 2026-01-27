import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/widgets/header'
import { getHeaderData } from '@/shared/api/pages/header'
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/widgets/footer"
import { getFooterData } from '@/shared/api/pages/footer'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
  description: 'Интернет-магазин компьютерной техники OSA-MARKET. Ноутбуки, готовые сборки ПК, видеокарты, процессоры и игровая периферия от ведущих брендов. Доставка по всей России.',
  keywords: 'ноутбуки, компьютеры, видеокарты, игровые ПК, периферия, геймерские аксессуары, OSA-MARKET',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
    description: 'Интернет-магазин компьютерной техники. Лучшие цены и широкий ассортимент.',
    type: 'website',
    locale: 'ru_RU',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFC300',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [headerData, footerData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
  ])

  const headerAcf = headerData[0]?.acf
  const razdely_kataloga = headerAcf?.razdely_kataloga ?? []
  const nomer_telefona = headerAcf?.nomer_telefona
  const soczialnye_seti = headerAcf?.soczialnye_seti

  const footerAcf = footerData[0]?.acf

  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Header
          razdely_kataloga={razdely_kataloga}
          nomer_telefona={nomer_telefona}
          soczialnye_seti={soczialnye_seti}
        />
        {children}
        {/* <Analytics /> */}
        <Toaster richColors />
        <Footer data={footerAcf} />
      </body>
    </html>
  )
}
