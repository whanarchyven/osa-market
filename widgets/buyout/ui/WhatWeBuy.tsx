import Image from 'next/image'
import type { WhatWebuyBlock } from '@/shared/types/api'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'

interface WhatWeBuyProps {
  data: WhatWebuyBlock
}

export function WhatWeBuy({ data }: WhatWeBuyProps) {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          {data.zagolovok.replace(/<\/?p>/g, '').trim()}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.kartochki.map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border-2 border-primary/50 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              {/* Фоновое изображение */}
              <div className="relative h-64 overflow-hidden bg-secondary">
                <Image
                  src={getBackendMediaUrl(card.izobrazhenie) || "/placeholder.svg"}
                  alt={getBackendMediaAlt(card.izobrazhenie, card.zagolovok)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Контент */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {card.zagolovok}
                </h3>
                {card.podzagolovok && (
                  <p className="text-white text-sm">{card.podzagolovok}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
