'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import type { ProductReview } from '@/shared/types/product'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'

interface LatestReviewsProps {
  title?: string
  reviews: ProductReview[]
}

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function LatestReviews({
  title = 'Последние отзывы',
  reviews,
}: LatestReviewsProps) {
  const textRefs = useRef(new Map<number, HTMLParagraphElement | null>())
  const [isClamped, setIsClamped] = useState<Record<number, boolean>>({})
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    const updateClamps = () => {
      const next: Record<number, boolean> = {}
      textRefs.current.forEach((el, id) => {
        if (!el) return
        next[id] = el.scrollHeight > el.clientHeight + 1
      })
      setIsClamped(next)
    }

    const raf = requestAnimationFrame(updateClamps)
    window.addEventListener('resize', updateClamps)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateClamps)
    }
  }, [reviews])

  if (!reviews.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="inline-flex flex-col items-start">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h2>
            <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-primary to-primary/10" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              className="reviews-swiper-prev rounded-full border border-border/60 bg-card/80 p-2 text-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              className="reviews-swiper-next rounded-full border border-border/60 bg-card/80 p-2 text-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.reviews-swiper-prev',
            nextEl: '.reviews-swiper-next',
          }}
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review) => {
            const productId = review.product_id

            return (
              <SwiperSlide key={review.id} className="h-auto">
                <Dialog
                  open={openId === review.id}
                  onOpenChange={(open) => setOpenId(open ? review.id : null)}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenId(review.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setOpenId(review.id)
                      }
                    }}
                    className="flex h-full cursor-pointer flex-col rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm outline-none transition hover:border-primary/60 hover:shadow-[0_0_25px_rgba(255,195,0,0.25)] focus-visible:border-primary/60 focus-visible:shadow-[0_0_25px_rgba(255,195,0,0.25)]"
                  >
                    <div className="flex items-center gap-3">
                      {productId ? (
                        <Link
                          href={`/product/${productId}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                          className="text-sm hover:text-primary transition-all border-b border-transparent hover:border-primary font-medium text-foreground line-clamp-2"
                        >
                          {review.product_name}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {review.product_name}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span>{Number(review.rating).toFixed(1)}</span>
                    </div>

                    <p className="mt-4 text-lg font-semibold text-foreground">
                      {review.reviewer}
                    </p>
                    <p
                      ref={(el) => {
                        if (el) {
                          textRefs.current.set(review.id, el)
                        } else {
                          textRefs.current.delete(review.id)
                        }
                      }}
                      className="mt-2 text-sm text-muted-foreground line-clamp-3"
                    >
                      {stripHtml(review.review)}
                    </p>
                    {isClamped[review.id] && (
                      <Button
                        type="button"
                        variant="link"
                        className="mt-2 h-auto w-fit p-0 text-primary"
                        onClick={(event) => {
                          event.stopPropagation()
                          setOpenId(review.id)
                        }}
                      >
                        Показать всё
                      </Button>
                    )}
                    <p className="mt-auto pt-4 text-xs text-muted-foreground">
                      {formatDate(review.date_created)}
                    </p>
                  </div>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Отзыв</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-semibold text-foreground">
                          {review.reviewer}
                        </span>
                        <span className="text-muted-foreground">
                          {formatDate(review.date_created)}
                        </span>
                        <div className="flex items-center gap-1 text-foreground">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          <span>{Number(review.rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/product/${review.product_id}`}
                        className="text-sm hover:text-primary transition-all border-transparent hover:border-primary font-medium text-foreground line-clamp-2"
                      >
                        {review.product_name}
                      </Link>
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: review.review }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </SwiperSlide>
            )
          })}
        </Swiper>

       
      </div>
    </section>
  )
}
