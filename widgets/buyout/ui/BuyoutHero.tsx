import { CheckCircle2 } from 'lucide-react'
import type { BuyoutFormContacts, BuyoutHeroBlock } from '@/shared/types/api'
import { parseRichTextBlock } from '@/shared/utils/richText'
import { BuyoutForm } from './BuyoutForm'

interface BuyoutHeroProps {
  data: BuyoutHeroBlock
  contacts: BuyoutFormContacts
}

export function BuyoutHero({ data, contacts }: BuyoutHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div>


            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance text-left">
              {data.zagolovok}
            </h1>

            <div className="mb-8 text-left">
              {parseRichTextBlock(
                data.podzagolovok,
                'text-white [&_p]:text-lg md:[&_p]:text-xl [&_p]:text-primary [&_p]:font-semibold'
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.kartochki_preimushhestv.map((item, index) => (
                <div
                  key={index}
                  className="bg-black/40 backdrop-blur-sm border border-primary/30 rounded-lg p-5 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0" />
                  <p
                    className="text-white font-medium text-left text-sm"
                    dangerouslySetInnerHTML={{
                      __html: item.preimushhestvo.tekst_preimushhestva
                        .replace(/<\/?p>/g, '')
                        .replace(/<\/?br\s*\/?>/g, ''),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <BuyoutForm contacts={contacts} />
        </div>
      </div>
    </section>
  )
}
