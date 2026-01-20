import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/widgets/header'
import { getHeaderData } from '@/shared/api/pages/header'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'OSA-shop | Ноутбуки, готовые ПК и периферия',
  description: 'Интернет-магазин компьютерной техники OSA-shop. Ноутбуки, готовые сборки ПК, видеокарты, процессоры и игровая периферия от ведущих брендов. Доставка по всей России.',
  keywords: 'ноутбуки, компьютеры, видеокарты, игровые ПК, периферия, геймерские аксессуары, OSA-shop',
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
    title: 'OSA-shop | Ноутбуки, готовые ПК и периферия',
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
  const headerData = await getHeaderData()
  const razdely_kataloga = headerData[0]?.acf?.razdely_kataloga ?? []

  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Header razdely_kataloga={razdely_kataloga} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
