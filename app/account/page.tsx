export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Личный кабинет
          </h1>

          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Войдите или зарегистрируйтесь по email
            </p>

            <label className="text-sm text-foreground mb-2 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />

            <button className="mt-4 w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium">
              Получить код
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

