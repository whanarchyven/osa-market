import { notFound } from 'next/navigation'
import { getNewsBySlug } from '@/shared/api/news/getNewsBySlug'

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) return notFound()

  return (
    <main className="bg-background">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${news.acf.oblozhka}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
            {news.acf.zagolovok}
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/80">
            {news.acf.avtor}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div
            className="prose prose-invert whitespace-pre-wrap max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: news.acf.kontent }}
          />
        </div>
      </section>
    </main>
  )
}
