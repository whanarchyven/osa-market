import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { BuyoutStepsBlock } from '@/shared/types/api'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'

interface BuyoutStepsProps {
  data: BuyoutStepsBlock
}

export function BuyoutSteps({ data }: BuyoutStepsProps) {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {data.zagolovok}
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          {data.podzagolovk}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {data.shag_vykupa.map((step, index) => {
            const isLast = index === data.shag_vykupa.length - 1

            return (
              <div key={index} className="relative">
                <div className="bg-secondary border border-primary/50 rounded-xl p-6 h-full hover:border-primary transition-colors">
                  <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={getBackendMediaUrl(step.izobrazhenie) || '/placeholder.svg'}
                      alt={getBackendMediaAlt(step.izobrazhenie, step.zagolovok)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-md font-bold text-primary mb-3">
                    {step.zagolovok}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.podzagolovok}
                  </p>
                </div>

                {!isLast && (
                  <div className="hidden lg:flex absolute -right-10 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-10 h-10 text-primary" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
