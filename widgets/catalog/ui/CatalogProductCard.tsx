'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, MessageCircle, Heart, BarChart3, Minus, Plus } from 'lucide-react'
import { useShopStore } from '@/shared/store'
import type { ProductListItem } from '@/shared/types/product'
import { cn } from '@/lib/utils'
import { mapApiProductToStoreProduct } from '@/shared/utils/product'
import { useAddToCartWithToast } from '@/shared/hooks/useAddToCartWithToast'
import { getProductPath } from '@/shared/utils/productRoute'
import { Button } from '@/components/ui/button'

interface CatalogProductCardProps {
  product: ProductListItem
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const router = useRouter()
  const { toggleFavorite, isFavorite, cart, updateCartQuantity } = useShopStore()
  const addToCartWithToast = useAddToCartWithToast()
  const storeProduct = mapApiProductToStoreProduct(product)
  const isInFavorites = isFavorite(storeProduct.id)
  const cartItem = cart.find((item) => item.id === storeProduct.id)
  const quantity = cartItem?.quantity ?? 0
  const isInCart = quantity > 0

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ru-RU').format(Number(price))
  }

  const discount = product.on_sale && product.regular_price && product.sale_price
    ? Math.round((1 - Number(product.sale_price) / Number(product.regular_price)) * 100)
    : 0

  /** Первые атрибуты из WooCommerce API (до 6 шт — ровная сетка 2×3). Порядок как в данных товара. */
  const mainAttributes = product.attributes.slice(0, 6)

  const handleBuyNow = () => {
    addToCartWithToast(storeProduct, 1)
    router.push('/cart')
  }

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
      {/* Изображение */}
      <Link href={getProductPath(product)} className="block relative aspect-square bg-secondary/30">
        {product.images[0] && (
          <Image
            src={product.images[0].src || "/placeholder.svg"}
            alt={product.images[0].alt || product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Скидка */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </Link>

      {/* Информация */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {/* Рейтинг и отзывы */}
        <div className="flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {product.average_rating}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {product.rating_count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* <button
              className="p-1 hover:text-primary transition-colors"
              title="Сравнить"
            >
              <BarChart3 className="h-4 w-4" />
            </button> */}
            <button
              onClick={() => toggleFavorite(storeProduct)}
              className={cn(
                "p-1 transition-colors",
                isInFavorites ? "text-red-500" : "hover:text-red-500"
              )}
              title={isInFavorites ? "Убрать из избранного" : "В избранное"}
            >
              <Heart className={cn("h-4 w-4", isInFavorites && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Название */}
        <Link href={getProductPath(product)}>
          <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-3 hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Характеристики — всегда 2 в ряд, компактная сетка */}
        <div className="border-t border-border/80 pt-2">
          <div className="grid grid-cols-2 gap-1.5">
            {mainAttributes.map((attr) => (
              <div
                key={attr.id}
                className="flex flex-col rounded-md border border-border/60 bg-muted/20 px-1.5 py-1 md:px-2 md:py-1.5"
              >
                <span className="line-clamp-2 text-[9px] leading-tight text-muted-foreground md:text-[10px]">
                  {attr.name}
                </span>
                <span className="line-clamp-2 text-[10px] font-medium leading-snug text-foreground md:text-xs">
                  {attr.options.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Цена */}
        <div className="pt-2">
          {product.on_sale ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(product.sale_price)} ₽
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.regular_price)} ₽
                </span>
              </div>
            </div>
          ) : (
            <span className="text-lg md:text-xl font-bold text-foreground">
              {formatPrice(product.price)} ₽
            </span>
          )}
        </div>

        {/* Наличие */}
        <div className="text-xs">
          {product.stock_status === 'instock' ? (
            <span className="text-green-500">В наличии</span>
          ) : (
            <span className="text-muted-foreground">Под заказ</span>
          )}
        </div>
        {/* Кнопка купить */}
        <div className="space-y-2">
          {!isInCart ? (
            <Button
              variant="outline"
              className="w-full !border !border-primary hover:!text-black hover:!bg-primary"
              onClick={() => addToCartWithToast(storeProduct, 1)}
            >
              В корзину
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full border border-primary rounded-lg overflow-hidden">
              <button
                onClick={() => updateCartQuantity(storeProduct.id, quantity - 1)}
                className="flex items-center justify-center w-10 h-10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Уменьшить количество"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center text-sm font-semibold text-foreground">
                {quantity}
              </div>
              <button
                onClick={() => updateCartQuantity(storeProduct.id, quantity + 1)}
                className="flex items-center justify-center w-10 h-10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Увеличить количество"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
          <Button
            className="w-full"
            onClick={handleBuyNow}
          >
            Купить в один клик
          </Button>
        </div>
      </div>
    </div>
  )
}
