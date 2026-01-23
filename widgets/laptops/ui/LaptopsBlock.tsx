'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Star, Heart } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'
import { useShopStore } from '@/shared/store'
import { mapApiProductToStoreProduct } from '@/shared/utils/product'
import { Button } from '@/components/ui/button'
import type { ProductApi } from '@/shared/types/product'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

interface LaptopsBlockProps {
  title: string
  products: ProductApi[]
}

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export function LaptopsBlock({ title, products }: LaptopsBlockProps) {
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

  const reviewCards = useMemo(() => {
    if (!currentProduct) return []
    const count = Math.max(2, Math.min(5, currentProduct.rating_count || 2))
    return Array.from({ length: count }, (_, index) => ({
      id: `${currentProduct.id}-${index}`,
      author: `Покупатель ${index + 1}`,
      rating: currentProduct.average_rating
        ? Number(currentProduct.average_rating)
        : 4.8,
      text: 'Отличный ноутбук, производительность на высоте.',
    }))
  }, [currentProduct])

  if (!products.length) return null

  return (
    <section className="py-12" data-count={products.length}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center flex-col justify-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h2>
          <div className="mt-3 h-1 w-52 rounded-full bg-gradient-to-r from-primary to-primary/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-3 rounded-3xl flex flex-col gap-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-foreground">
                {currentProduct?.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {currentProduct
                  ? stripHtml(currentProduct.short_description || '')
                  : ''}
              </p>
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

            <div className="mt-auto flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full !border !border-primary hover:!text-black hover:!bg-primary"
                onClick={() => storeProduct && addToCart(storeProduct, 1)}
                disabled={!storeProduct}
              >
                {isInCart ? 'В корзине' : 'В корзину'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
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
            <Swiper className='!w-[1500px] absolute left-1/2 -translate-x-1/2'
              modules={[EffectCoverflow, Pagination]}
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
                  <div className="relative mx-auto h-[600px] w-full max-w-[760px] rounded-2xl overflow-hidden">
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
          </div>

          <div className="lg:col-span-3 rounded-3xl h-2/4 flex gap-4 flex-col">
          <p className='text-right text-xl font-bold'>Характеристики</p>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
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

            <div className="mt-4 border-t h-1/4 border-border/60 pt-4">
              <div className='flex mb-3 items-center gap-3'>
                <p className='text-xl'>Отзывы</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {currentProduct?.average_rating || '—'}
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {reviewCards.map((review) => (
                  <div
                    key={review.id}
                    className="min-w-[200px] rounded-2xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {review.rating}
                    </div>
                    <p className="mt-2 text-sm text-foreground line-clamp-3">
                      {review.text}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

