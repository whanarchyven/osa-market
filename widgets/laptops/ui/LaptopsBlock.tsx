'use client'

import { useEffect, useMemo, useState, useId } from 'react'
import Image from 'next/image'
import { Star, Heart, ArrowLeftCircle, ArrowRightCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'
import { cva } from 'class-variance-authority'
import { useShopStore } from '@/shared/store'
import { mapApiProductToStoreProduct } from '@/shared/utils/product'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ProductApi, ProductReview } from '@/shared/types/product'
import { getProductReviews } from '@/shared/api/products/reviews/getProductReviews'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Link from 'next/link'

interface LaptopsBlockProps {
  title: string
  products: ProductApi[]
  titleAlign?: 'left' | 'center'|'right'
}

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const titleContainerVariants = cva('mb-8 flex w-full flex-col', {
  variants: {
    align: {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

const titleWrapperVariants = cva('inline-flex flex-col', {
  variants: {
    align: {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

export function LaptopsBlock({ title, products, titleAlign = 'left' }: LaptopsBlockProps) {
  const uniqueId = useId().replace(/:/g, '')
  const mainPrevClass = `laptops-swiper-prev-${uniqueId}`
  const mainNextClass = `laptops-swiper-next-${uniqueId}`
  const reviewsPrevClass = `reviews-swiper-prev-${uniqueId}`
  const reviewsNextClass = `reviews-swiper-next-${uniqueId}`
  const reviewsPaginationClass = `reviews-swiper-pagination-${uniqueId}`
  const [activeIndex, setActiveIndex] = useState(0)
  const { addToCart, toggleFavorite, isFavorite, cart } = useShopStore()

  const currentProduct = products[activeIndex] ?? products[0]
  const storeProduct = currentProduct
    ? mapApiProductToStoreProduct(currentProduct)
    : null
  const isInCart = storeProduct
    ? cart.some((item) => item.id === storeProduct.id)
    : false
  const isInFavorites = storeProduct ? isFavorite(storeProduct.id) : false

  const mainAttributes = useMemo(
    () => (currentProduct?.attributes ?? []).slice(0, 4),
    [currentProduct]
  )

  const [productReviews, setProductReviews] = useState<ProductReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [openReviewId, setOpenReviewId] = useState<number | null>(null)

  useEffect(() => {
    let isActive = true

    const loadReviews = async () => {
      if (!currentProduct) return
      setReviewsLoading(true)
      try {
        const data = await getProductReviews(currentProduct.id)
        if (isActive) {
          setProductReviews(data)
        }
      } catch (error) {
        if (isActive) {
          setProductReviews([])
        }
      } finally {
        if (isActive) {
          setReviewsLoading(false)
        }
      }
    }

    loadReviews()

    return () => {
      isActive = false
    }
  }, [currentProduct?.id])

  if (!products.length) return null

  return (
    <section className="py-10" data-count={products.length}>
      <div className="container mx-auto px-4">
        <div className={titleContainerVariants({ align: titleAlign })}>
          <div className={titleWrapperVariants({ align: titleAlign })}>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h2>
            <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-primary to-primary/10" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-3 rounded-3xl flex flex-col gap-6">
            <div className="space-y-3">
              <Link href={`/product/${currentProduct.id}`} className="text-2xl font-semibold text-foreground">
                {currentProduct?.name}
              </Link>
              {/* <p className="text-sm text-muted-foreground line-clamp-4">
                {currentProduct
                  ? stripHtml(currentProduct.short_description || '')
                  : ''}
              </p> */}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {mainAttributes.map((attr) => (
                <div
                  key={attr.id}
                  className="flex p-3 rounded border-primary/20 border shadow-primary/20 hover:shadow-xl flex-col items-start gap-2 text-xs"
                >
                  <span className="text-muted-foreground shrink-0">
                    {attr.name}:
                  </span>
                  <span className="text-foreground text-base text-primary">
                    {attr.options.join(', ') || '—'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="!border w-1/2 !border-primary hover:!text-black hover:!bg-primary"
                onClick={() => storeProduct && addToCart(storeProduct, 1)}
                disabled={!storeProduct}
              >
                {isInCart ? 'В корзине' : 'В корзину'}
              </Button>
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => storeProduct && toggleFavorite(storeProduct)}
                disabled={!storeProduct}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isInFavorites ? 'fill-current text-primary' : ''
                  }`}
                />
                {isInFavorites ? 'В избранном' : 'В избранное'}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 relative overflow-hidden py-8">
            <div className='h-full w-24 from-[#101010] to-[#101010]/0 bg-gradient-to-r z-[999] absolute left-0'></div>
            <div className='h-full w-24 from-[#101010] to-[#101010]/0 bg-gradient-to-l z-[99] absolute right-0'></div>
            <button
              type="button"
              aria-label="Предыдущий слайд"
              className={`${mainPrevClass} absolute left-2 top-1/3 z-[1000] -translate-y-1/2 rounded-full border border-primary/60 bg-background/80 p-2 text-primary shadow-sm transition hover:bg-primary hover:text-black`}
            >
              <ArrowLeft  className=''/>
            </button>
            <button
              type="button"
              aria-label="Следующий слайд"
              className={`${mainNextClass} absolute right-2 top-1/3 z-[1000] -translate-y-1/2 rounded-full border border-primary/60 bg-background/80 p-2 text-primary shadow-sm transition hover:bg-primary hover:text-black`}
            >
              <ArrowRight className=''/>
            </button>
            <Swiper className='laptops-swiper !w-[1500px] absolute left-1/2 -translate-x-1/2'
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              effect="coverflow"
              centeredSlides
              slidesPerView={Math.min(3, products.length)}
              spaceBetween={16}
              coverflowEffect={{
                rotate: -16,
                stretch: 0,
                depth: 160,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: `.${mainPrevClass}`,
                nextEl: `.${mainNextClass}`,
              }}
             
              onSlideChange={(swiper: SwiperClass) =>
                setActiveIndex(swiper.realIndex)
              }
              breakpoints={{
                0: { slidesPerView: 1.2 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="relative mx-auto h-[360px] w-full max-w-[760px] rounded-2xl overflow-hidden sm:h-[420px] lg:h-[520px]">
                    {product.images?.[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        fill
                        className="object-contain p-6"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted/30" />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <style jsx global>{`
              .laptops-swiper .swiper-pagination-bullet {
                background-color: #facc15;
                opacity: 0.5;
              }
              .laptops-swiper .swiper-pagination-bullet-active {
                background-color: #facc15;
                opacity: 1;
              }
              .reviews-swiper .swiper-pagination-bullet {
                background-color: #facc15;
                opacity: 0.5;
              }
              .reviews-swiper .swiper-pagination-bullet-active {
                background-color: #facc15;
                opacity: 1;
              }
              .reviews-swiper-pagination .swiper-pagination-bullet {
                background-color: #facc15;
                opacity: 0.5;
                margin: 0 6px;
              }
              .reviews-swiper-pagination .swiper-pagination-bullet-active {
                background-color: #facc15;
                opacity: 1;
              }
            `}</style>
          </div>

          <div className="lg:col-span-3 rounded-3xl flex gap-4 flex-col">
          <p className='text-right text-xl font-bold'>Характеристики</p>
            <div className="overflow-y-scroll !h-[200px] pr-2 space-y-3">
              {(currentProduct?.attributes ?? []).map((attr) => (
                <div
                  key={attr.id}
                  className="rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <p className="text-xs text-muted-foreground">{attr.name}</p>
                  <p className="text-sm text-foreground">
                    {attr.options.join(', ') || '—'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
              <div className='flex mb-3 items-center gap-3'>
                <p className='text-xl'>Отзывы</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {currentProduct?.average_rating || '—'}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Предыдущий отзыв"
                    className={`${reviewsPrevClass} rounded-full border border-border/60 bg-card/80 p-1.5 text-foreground transition hover:border-primary/60 hover:text-primary`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующий отзыв"
                    className={`${reviewsNextClass} rounded-full border border-border/60 bg-card/80 p-1.5 text-foreground transition hover:border-primary/60 hover:text-primary`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {reviewsLoading ? (
                <p className="text-xs text-muted-foreground">Загрузка отзывов...</p>
              ) : productReviews.length ? (
                <>
                  <Swiper
                    className="reviews-swiper"
                    modules={[Navigation, Pagination]}
                    navigation={{
                      prevEl: `.${reviewsPrevClass}`,
                      nextEl: `.${reviewsNextClass}`,
                    }}
                    pagination={{
                      el: `.${reviewsPaginationClass}`,
                      clickable: true,
                    }}
                    spaceBetween={12}
                    slidesPerView={1.15}
                    breakpoints={{
                      640: { slidesPerView: 1.5 },
                      1024: { slidesPerView: 1.2 },
                    }}
                  >
                    {productReviews.map((review) => (
                      <SwiperSlide key={review.id} className="h-auto">
                        <Dialog
                          open={openReviewId === review.id}
                          onOpenChange={(open) =>
                            setOpenReviewId(open ? review.id : null)
                          }
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setOpenReviewId(review.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setOpenReviewId(review.id)
                              }
                            }}
                            className="rounded-2xl border border-border/60 bg-background/40 p-3 outline-none transition hover:border-primary/60 focus-visible:border-primary/60"
                          >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              {review.rating}
                            </div>
                            <p className="mt-2 text-sm text-foreground line-clamp-3">
                              {stripHtml(review.review)}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {review.reviewer}
                            </p>
                          </div>
                          <DialogContent className="sm:max-w-[560px]">
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
                              <p className="text-sm text-muted-foreground">
                                {currentProduct?.name}
                              </p>
                              <div
                                className="prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: review.review }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div
                    className={`reviews-swiper-pagination ${reviewsPaginationClass} mt-2 flex justify-center`}
                  />
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Пока нет отзывов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

