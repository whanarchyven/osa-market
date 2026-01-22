export default function CatalogLoading() {
  return (
    <main className="min-h-screen bg-background pt-4 pb-12">
      <div className="container mx-auto px-4">
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 rounded-lg bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          </aside>

          <section className="flex-1">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[460px] rounded-2xl bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}


