'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { ProductApi } from '@/shared/types/product'
import { getProductPath } from '@/shared/utils/productRoute'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface PromoProductsSliderProps {
  products: ProductApi[]
}

export function PromoProductsSlider({ products }: PromoProductsSliderProps) {
  if (!products.length) return null

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="promo-products-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <Link
              href={getProductPath(product)}
              className="block h-full rounded-2xl border border-border/60 bg-card/80 p-4 transition hover:border-primary/60 hover:shadow-[0_0_25px_rgba(255,195,0,0.25)]"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted/30">
                {product.images?.[0]?.src ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="h-full w-full bg-muted/30" />
                )}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-2 text-primary font-semibold">
                {product.price} ₽
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .promo-products-swiper .swiper-pagination-bullet {
          background-color: #facc15;
          opacity: 0.5;
        }
        .promo-products-swiper .swiper-pagination-bullet-active {
          background-color: #facc15;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
