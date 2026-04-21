'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { type Product, useShopStore } from '@/shared/store'
import { useAddToCartWithToast } from '@/shared/hooks/useAddToCartWithToast'
import { getProductPath } from '@/shared/utils/productRoute'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter()
  const { toggleFavorite, isFavorite } = useShopStore()
  const addToCartWithToast = useAddToCartWithToast()
  const isInFavorites = isFavorite(product.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  const discountPercent = product.oldPrice 
    ? Math.round((1 - product.price / product.oldPrice) * 100) 
    : null

  const handleBuyNow = () => {
    addToCartWithToast(product)
    router.push('/cart')
  }

  if (variant === 'compact') {
    return (
      <div className="group relative bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all duration-300">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.imageAlt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercent && (
              <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            
            {product.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs text-muted-foreground">{product.rating}</span>
              </div>
            )}
            
            <div className="mt-2">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="ml-2 text-xs text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => toggleFavorite(product)}
            className={`p-1.5 rounded-lg transition-colors ${
              isInFavorites 
                ? 'bg-primary/20 text-primary' 
                : 'bg-secondary/80 text-muted-foreground hover:text-primary'
            }`}
            aria-label={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart className={`w-4 h-4 ${isInFavorites ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.imageAlt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {discountPercent && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleFavorite(product)}
            className={`p-2 rounded-full transition-colors ${
              isInFavorites 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart className={`w-5 h-5 ${isInFavorites ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={getProductPath(product)}>
          <h3 className="text-base font-medium text-foreground line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            {product.reviews && (
              <span className="text-sm text-muted-foreground">({product.reviews})</span>
            )}
          </div>
        )}

        <div className="mt-3 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>
            
            <button
              onClick={() => addToCartWithToast(product)}
              className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
          <Button
            variant="outline"
            className="w-full !border !border-primary hover:!bg-primary hover:!text-black"
            onClick={handleBuyNow}
          >
            Купить в один клик
          </Button>
        </div>
      </div>
    </div>
  )
}
