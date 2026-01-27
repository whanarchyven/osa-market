import Image from 'next/image'
import { parseRichText } from '@/shared/utils/richText'

interface TeamMember {
  imya: string
  dolzhnost: string
  opisanie: string
  foto: string
}

interface AboutTeamProps {
  zagolovok_komandy: string
  opisanie_komandy: string
  chlenov_komandy: TeamMember[]
}

export function AboutTeam({ zagolovok_komandy, opisanie_komandy, chlenov_komandy }: AboutTeamProps) {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
        {zagolovok_komandy}
      </h2>
      <p className="text-xl text-gray-300 mb-16 max-w-2xl">{opisanie_komandy}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {chlenov_komandy.map((member, idx) => (
          <div
            key={idx}
            className="group bg-muted/30 rounded-lg overflow-hidden border border-muted hover:border-primary transition-all duration-300"
          >
            <div className="relative h-64 overflow-hidden bg-muted">
              <Image
                src={member.foto || "/placeholder.svg"}
                alt={member.imya}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">{member.imya}</h3>
              <p className="text-primary font-semibold text-sm mb-3">{member.dolzhnost}</p>
              <div className="text-gray-300 text-sm leading-relaxed">
                {parseRichText(member.opisanie)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
