'use client'

import { useState } from 'react'

export function PromoSignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        comment: formData.comment.trim(),
      }

      if (!payload.name || !payload.phone) {
        setSubmitError('Заполните обязательные поля.')
        setIsSuccess(false)
        return
      }

      const response = await fetch('/api/telegram/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null
        throw new Error(data?.message ?? 'Telegram delivery failed')
      }

      setFormData({ name: '', phone: '', email: '', comment: '' })
      setIsSuccess(true)
    } catch (error) {
      setSubmitError('Ошибка при отправке. Попробуйте позже.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-card/80 p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Записаться на акцию
      </h3>
      <p className="text-muted-foreground mb-6">
        Оставьте контакты, и мы поможем оформить покупку по акции
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSuccess && (
          <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
            Заявка отправлена! Мы свяжемся с вами в ближайшее время.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Имя *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван Петров"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Комментарий
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            placeholder="Например, интересует конкретный товар"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Отправка...' : 'Оставить заявку'}
        </button>
        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}
      </form>
    </div>
  )
}
