interface Stat {
  chislo: string
  opisanie: string
}

interface AboutStatsProps {
  zagolovok_statistiki: string
  statistika: Stat[]
}

export function AboutStats({ zagolovok_statistiki, statistika }: AboutStatsProps) {
  return (
    <section className="py-20 px-4 md:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center text-balance">
          {zagolovok_statistiki}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {statistika.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.chislo}
              </div>
              <p className="text-gray-300 text-sm md:text-base">{stat.opisanie}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
