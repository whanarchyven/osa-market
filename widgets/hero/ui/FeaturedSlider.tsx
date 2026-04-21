'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/entities/product'
import { TovarItem } from '@/shared/api/pages/main/types'


interface FeaturedSliderProps {
  title: string
  description: string
  tovary: TovarItem[]
}

export function FeaturedSlider({ title, description, tovary }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tovary.length)
  }, [tovary.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + tovary.length) % tovary.length)
  }, [tovary.length])

  useEffect(() => {
    if (!isAutoPlaying || tovary.length <= 1) return
    
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, tovary.length])

  if (tovary.length === 0) {
    return null
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="relative">
        {/* Slider content */}
        <div className="overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {tovary.map((item) => {
              const apiProduct = item.product
              const priceValue = Number(apiProduct?.price ?? 0)
              const regularPriceValue = Number(apiProduct?.regular_price ?? 0)
              const hasDiscount =
                Number.isFinite(priceValue) &&
                Number.isFinite(regularPriceValue) &&
                regularPriceValue > priceValue

              return (
              <div key={item.tovar.ID} className="w-full flex-shrink-0 px-1">
                <ProductCard 
                  product={{
                    id: String(apiProduct?.id ?? item.tovar.ID),
                    name: apiProduct?.name ?? item.tovar.post_title,
                    price: Number.isFinite(priceValue) ? priceValue : 0,
                    oldPrice: hasDiscount ? regularPriceValue : undefined,
                    image:
                      apiProduct?.images?.[0]?.src ??
                      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop',
                    imageAlt: apiProduct?.images?.[0]?.alt ?? apiProduct?.name ?? item.tovar.post_title,
                    category: apiProduct?.categories?.[0]?.name ?? item.tovar.post_type,
                    subcategory: '',
                    brand: apiProduct?.brands?.[0]?.name ?? '',
                    rating: apiProduct?.average_rating
                      ? Number(apiProduct.average_rating)
                      : undefined,
                    reviews: apiProduct?.rating_count ?? undefined,
                    inStock: apiProduct?.stock_status
                      ? apiProduct.stock_status === 'instock'
                      : true,
                    excerpt: apiProduct?.short_description ?? item.tovar.post_excerpt,
                  }} 
                />
              </div>
              )
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        {tovary.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 -translate-y-1/2 p-2 bg-card/90 hover:bg-card border border-border rounded-full shadow-lg transition-colors z-10"
              aria-label="Предыдущий товар"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-card/90 hover:bg-card border border-border rounded-full shadow-lg transition-colors z-10"
              aria-label="Следующий товар"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {tovary.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {tovary.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Перейти к товару ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
