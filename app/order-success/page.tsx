import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-background pt-10 pb-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Спасибо за заказ
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Наш менеджер свяжется с вами в ближайшее время.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
