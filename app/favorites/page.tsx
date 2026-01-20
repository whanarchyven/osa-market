'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopStore } from '@/shared/store'

export default function FavoritesPage() {
  const {
    favorites,
    removeFavorite,
    addToCart,
  } = useShopStore()

  return (
    <main className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Избранное ({favorites.length})
          </h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Вернуться к покупкам
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">
              В избранном пока ничего нет
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 text-foreground hover:bg-background"
                    aria-label="Удалить из избранного"
                  >
                    <Heart className="w-4 h-4 fill-primary text-primary" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-xs text-muted-foreground">
                    {product.category || 'Категория'}
                  </div>
                  <h3 className="text-base font-medium text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  {product.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
                      </div>
                      {product.oldPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {new Intl.NumberFormat('ru-RU').format(product.oldPrice)} ₽
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.inStock ? 'В наличии' : 'Под заказ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 h-10"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      В корзину
                    </Button>
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

