'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createReview } from '@/shared/api/products/reviews/createReview'
import { toast } from 'sonner'

interface ProductReviewFormProps {
  productId: number
}

export function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const [reviewer, setReviewer] = useState('')
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await createReview({
        product_id: productId,
        reviewer,
        reviewer_email: reviewerEmail,
        review,
        rating,
      })
      setIsSubmitted(true)
      setReviewer('')
      setReviewerEmail('')
      setRating(5)
      setReview('')
      toast.success('Отзыв успешно отправлен! Он будет опубликован после проверки.')
    } catch (error) {
      setSubmitError('Не удалось отправить отзыв. Попробуйте позже.')
      toast.error('Не удалось отправить отзыв. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold text-foreground">Оставить отзыв</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Ваш отзыв будет опубликован после проверки.
      </p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-foreground mb-2 block">Имя</label>
            <input
              type="text"
              required
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
              placeholder="Ваше имя"
              className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-foreground mb-2 block">Email</label>
            <input
              type="email"
              required
              value={reviewerEmail}
              onChange={(event) => setReviewerEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-foreground mb-2 block">Оценка</label>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-foreground mb-2 block">Отзыв</label>
          <textarea
            required
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="Напишите ваш отзыв"
            rows={4}
            className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}
        {isSubmitted && !submitError && (
          <p className="text-sm text-green-500">
            Спасибо! Отзыв отправлен на модерацию.
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </Button>
      </form>
    </div>
  )
}
