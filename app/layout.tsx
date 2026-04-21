import React from "react"
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/widgets/header'
import { getHeaderData } from '@/shared/api/pages/header'
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/widgets/footer"
import { getFooterData } from '@/shared/api/pages/footer'

const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

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
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=107058084', 'ym');

              ym(107058084, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/107058084"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  )
}
