import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { parseRichText } from '@/shared/utils/richText'

interface AboutCTAProps {
  zagolovok_cta: string
  podzagolovok_cta: string
}

export function AboutCTA({ zagolovok_cta, podzagolovok_cta }: AboutCTAProps) {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
          {parseRichText(zagolovok_cta)}
        </div>
        <div className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {parseRichText(podzagolovok_cta)}
        </div>
        <Link
          href="/catalog/pcs"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-foreground font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 group"
        >
          Перейти в каталог
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
