import Image from 'next/image'

import type {
  HowToPassBlokKontakty,
  HowToPassContactLink,
} from '@/shared/api/pages/how-to-pass/types'

const contactHref = (item: HowToPassContactLink) =>
  (item.sylka ?? item.ssylka ?? '').trim()

const isExternalLink = (href: string) =>
  /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

type HowToPassContactsProps = {
  blok: HowToPassBlokKontakty
}

/** Боковой блок контактной информации (/how-to-pass). */
export function HowToPassContacts({ blok }: HowToPassContactsProps) {
  const rowsRaw = blok.ssylki_i_kontakty
  const rows =
    rowsRaw !== false && Array.isArray(rowsRaw)
      ? rowsRaw.filter((r) => r?.tekst?.trim())
      : []

  if (!rows.length) return null

  const heading = blok.zagolovok?.trim() || 'Контактная информация'

  return (
    <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-primary/35 bg-card/70 p-6 shadow-[0_0_30px_-12px_rgba(255,195,0,0.35)] backdrop-blur-sm md:p-8">
      <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
        {heading}
      </h2>
      <ul className="flex flex-col gap-5">
        {rows.map((item, idx) => {
          const href = contactHref(item)
          const IconBlock = item.ikonka ? (
            <span className="relative mt-0.5 size-10 shrink-0 overflow-hidden rounded-lg border border-primary/40 bg-muted/40">
              <Image
                src={item.ikonka}
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="40px"
                unoptimized={
                  /\.svg(\?|$)/i.test(item.ikonka) ||
                  /\.gif(\?|$)/i.test(item.ikonka)
                }
              />
            </span>
          ) : (
            <span className="size-10 shrink-0 rounded-lg bg-muted/30" aria-hidden />
          )

          const text = (
            <span className="text-base leading-snug text-foreground">
              {item.tekst}
            </span>
          )

          if (!href || !isExternalLink(href)) {
            return (
              <li key={`${item.tekst}-${idx}`} className="flex gap-4">
                {IconBlock}
                {text}
              </li>
            )
          }

          return (
            <li key={`${href}-${idx}`}>
              <a
                href={href}
                className="group flex gap-4 rounded-xl border border-transparent p-2 -m-2 transition hover:border-primary/30 hover:bg-primary/5"
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {IconBlock}
                <span className="text-base leading-snug text-foreground underline-offset-4 group-hover:text-primary group-hover:underline">
                  {item.tekst}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
