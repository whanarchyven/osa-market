import Image from 'next/image'
import Link from 'next/link'
import { getNewsList } from '@/shared/api/news/getNewsList'

interface NewsPageProps {
  searchParams?: {
    page?: string
  }
}

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = Math.max(1, Number(searchParams?.page ?? '1'))
  const { items, totalPages } = await getNewsList(page, 9)

  return (
    <main className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Новости
          </h1>
          <p className="mt-3 text-muted-foreground">
            Актуальные новости и аналитика рынка техники
          </p>
        </div>

        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="group rounded-2xl border border-border/60 bg-card/80 overflow-hidden transition hover:border-primary/60 hover:shadow-[0_0_25px_rgba(255,195,0,0.25)]"
              >
                <div className="relative h-48 bg-muted/30">
                  {news.acf.miniatyura ? (
                    <Image
                      src={news.acf.miniatyura}
                      alt={news.acf.zagolovok}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted/30" />
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(news.date).toLocaleDateString('ru-RU')}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                    {news.acf.zagolovok}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {stripHtml(news.acf.kontent)}
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    {news.acf.avtor}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center text-muted-foreground">
            Пока нет новостей
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Link
              href={`/news?page=${Math.max(1, page - 1)}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                page === 1
                  ? 'pointer-events-none border-border/40 text-muted-foreground'
                  : 'border-border/60 text-foreground hover:border-primary/60'
              }`}
            >
              Назад
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/news?page=${p}`}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  p === page
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 text-foreground hover:border-primary/60'
                }`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/news?page=${Math.min(totalPages, page + 1)}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                page === totalPages
                  ? 'pointer-events-none border-border/40 text-muted-foreground'
                  : 'border-border/60 text-foreground hover:border-primary/60'
              }`}
            >
              Вперёд
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
