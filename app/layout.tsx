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
import { CookieConsent } from '@/shared/ui/CookieConsent'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
  description: 'Интернет-магазин компьютерной техники OSA-MARKET. Ноутбуки, готовые сборки ПК, видеокарты, процессоры и игровая периферия от ведущих брендов. Доставка по всей России.',
  keywords: 'ноутбуки, компьютеры, видеокарты, игровые ПК, периферия, геймерские аксессуары, OSA-MARKET',
  generator: 'v0.app',
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
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
    siteName: 'OSA-MARKET',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OSA-MARKET | Ноутбуки, готовые ПК и периферия',
    description: 'Интернет-магазин компьютерной техники. Лучшие цены и широкий ассортимент.',
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
      <head>
        <link rel="dns-prefetch" href="//api.osa-market.ru" />
        <link rel="preconnect" href="https://api.osa-market.ru" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
        <link rel="dns-prefetch" href="//mc.yandex.com" />
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://mc.yandex.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Header
          razdely_kataloga={razdely_kataloga}
          nomer_telefona={nomer_telefona}
          soczialnye_seti={soczialnye_seti}
        />
        {children}
        {/* <Analytics /> */}
        <Toaster richColors />
        <CookieConsent />
        <Footer data={footerAcf} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'OSA-MARKET',
                  url: SITE_URL,
                  logo: `${SITE_URL}/icon.svg`,
                },
                {
                  '@type': 'WebSite',
                  name: 'OSA-MARKET',
                  url: SITE_URL,
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
