import { parseRichText } from '@/shared/utils/richText'

interface Value {
  zagolovok: string
  tekst: string
}

interface AboutValuesProps {
  zagolovok_cennostei: string
  cennosti: Value[]
}

export function AboutValues({ zagolovok_cennostei, cennosti }: AboutValuesProps) {
  return (
    <section className="py-20 px-4 md:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center text-balance">
          {zagolovok_cennostei}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cennosti.map((value, idx) => (
            <div
              key={idx}
              className="bg-muted/30 border border-muted hover:border-primary rounded-lg p-8 transition-all duration-300 group"
            >
              <h3 className="text-xl font-bold text-white mb-3">{value.zagolovok}</h3>
              <div className="text-gray-300 leading-relaxed">
                {parseRichText(value.tekst)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
