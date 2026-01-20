'use client'

import { useState } from 'react'
import { Heart, Share2, BarChart3, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopStore } from '@/shared/store'
import type { Product } from '@/shared/types/api'
import { cn } from '@/lib/utils'
import { mapApiProductToStoreProduct } from '@/shared/utils/product'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { toggleFavorite, isFavorite, addToCart } = useShopStore()
  const storeProduct = mapApiProductToStoreProduct(product)
  const isInFavorites = isFavorite(storeProduct.id)

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ru-RU').format(Number(price))
  }

  const discount = product.on_sale && product.regular_price && product.sale_price
    ? Math.round((1 - Number(product.sale_price) / Number(product.regular_price)) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(storeProduct, quantity)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const increaseQuantity = () => {
    if (!product.stock_quantity || quantity < product.stock_quantity) {
      setQuantity(q => q + 1)
    }
  }

  // Основные характеристики для отображения
  const visibleAttributes = product.attributes.filter(attr => attr.visible).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Название */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
        {product.name}
      </h1>

      {/* Артикул */}
      <div className="text-sm text-muted-foreground">
        Артикул: <span className="text-foreground">{product.sku}</span>
      </div>

      {/* Характеристики */}
      {visibleAttributes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Характеристики</h3>
          <div className="space-y-2">
            {visibleAttributes.map((attr) => (
              <div key={attr.id || attr.name} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground shrink-0 min-w-32">{attr.name}:</span>
                <span className="text-foreground">{attr.options.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Цена и наличие */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        {/* Цена */}
        <div>
          {product.on_sale ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.sale_price)} ₽
              </span>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.regular_price)} ₽
              </span>
              <span className="text-sm text-primary font-medium">
                -{discount}%
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)} ₽
            </span>
          )}
        </div>

        {/* Наличие */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Наличие:</span>
          {product.stock_status === 'instock' ? (
            <span className="flex items-center gap-1.5 text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              В наличии
              {product.stock_quantity && (
                <span className="text-muted-foreground">({product.stock_quantity} шт.)</span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">Под заказ</span>
          )}
        </div>

        {/* Количество и кнопка купить */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Счетчик количества */}
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="p-3 hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="p-3 hover:bg-secondary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Кнопка купить */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_status !== 'instock'}
            className="flex-1 h-12 text-lg font-semibold"
          >
            Купить
          </Button>
        </div>

        {/* Дополнительная кнопка */}
        <Button variant="outline" className="w-full bg-transparent">
          Нашли дешевле?
        </Button>

        {/* Информация о доставке */}
        <div className="space-y-2 text-sm pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Самовывоз:</span>
            <span className="text-primary">2-6 дней</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Доставка:</span>
            <span className="text-primary">2-6 дней</span>
          </div>
        </div>
      </div>

      {/* Действия */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleFavorite(storeProduct)}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            isInFavorites ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className={cn("h-5 w-5", isInFavorites && "fill-current")} />
          {isInFavorites ? 'В избранном' : 'В избранное'}
        </button>
       
      </div>
    </div>
  )
}
