import Link from 'next/link'
import { parseRichTextBlock } from '@/shared/utils/richText'
import type { TradeInBlock } from '@/shared/types/api'
import { Button } from '@/components/ui/button'

interface TradeInProps {
  data: TradeInBlock
  ctaHref?: string
  ctaLabel?: string
}

export function TradeIn({ data, ctaHref, ctaLabel }: TradeInProps) {
  return (
    <section className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Фоновое изображение с оверлеем */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${data.polnoekrannoe_izobrazhenie}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="text-white text-balance leading-tight">
          {parseRichTextBlock(
            data.zagolovok,
            'text-5xl md:text-6xl font-bold [&_h2]:text-5xl md:[&_h2]:text-6xl [&_h2]:font-bold [&_h2]:mb-8'
          )}
        </div>

        <div className="text-lg md:text-xl text-white max-w-2xl mx-auto">
          {parseRichTextBlock(
            data.podzagolovok,
            'text-lg md:text-xl [&_p]:text-lg md:[&_p]:text-xl [&_br]:block'
          )}
        </div>
        {ctaHref && ctaLabel && (
          <div className="mt-10 flex justify-center">
            <Button asChild className="rounded-full px-8">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
