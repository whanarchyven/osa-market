import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  HowToPassBlokKontakty,
  HowToPassPageACF,
} from '@/shared/api/pages/how-to-pass/types'
import { getHowToPassPageData } from '@/shared/api/pages/how-to-pass/getHowToPassPageData'
import { buildMetadataWithYoast, seoContextFromEnv } from '@/shared/seo/yoast'
import { HowToPassContacts } from '@/widgets/how-to-pass'

/** Согласовано с delivery / warranty-and-refund / footer — раз в минуту. */
export const revalidate = 60
const SITE_URL = process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function blokKontaktyValid(blok: HowToPassPageACF['blok_kontakty']): blok is HowToPassBlokKontakty {
  if (!blok) return false
  const rows = blok.ssylki_i_kontakty
  return rows !== false && Array.isArray(rows) && rows.length > 0
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getHowToPassPageData()
  const page = pageData[0]

  if (!page) {
    return {
      title: 'Контакты — OSA-MARKET',
    }
  }

  const title =
    stripHtml(page.title?.rendered || '').trim() || 'Контакты'
  const description = stripHtml(page.acf?.content || '').slice(0, 200)
  const url = `${SITE_URL}/how-to-pass`

  const fallback: Metadata = {
    title: `${title} — OSA-MARKET`,
    description: description || 'Контакты и как добраться до OSA-MARKET.',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: description || 'Контакты и как добраться до OSA-MARKET.',
      url,
      type: 'article',
    },
  }

  const yoast = page.yoast_head_json
  const { siteUrl, apiBaseUrl } = seoContextFromEnv()
  return buildMetadataWithYoast(fallback, yoast, {
    siteUrl,
    apiBaseUrl,
    canonicalPath: '/how-to-pass',
  })
}

export default async function HowToPassPage() {
  const pageData = await getHowToPassPageData()
  const page = pageData[0]

  if (!page) return notFound()

  const acf = page.acf
  const pageTitle =
    stripHtml(page.title?.rendered || '').trim() || 'Контакты'
  const sectionTitle =
    acf?.zagolovok?.trim() || 'Как к нам добраться?'
  const content = acf?.content ?? ''
  const blok = acf?.blok_kontakty
  const showContactsAside = blokKontaktyValid(blok)

  return (
    <main className="min-h-screen bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-6xl lg:mb-14">
          <h1 className="text-3xl font-bold text-foreground md:text-5xl md:tracking-tight">
            {pageTitle}
          </h1>
        </header>

        <div
          className={
            showContactsAside
              ? 'mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,380px)_1fr]'
              : 'mx-auto max-w-4xl'
          }
        >
          {showContactsAside ? (
            <>
              <HowToPassContacts blok={blok} />
              <div className="min-w-0">
                <h2 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
                  {sectionTitle}
                </h2>
                <div
                  className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </>
          ) : (
            <div className="min-w-0 lg:col-span-2">
              <h2 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
                {sectionTitle}
              </h2>
              <div
                className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
