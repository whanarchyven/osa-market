'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopStore } from '@/shared/store'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotalItems,
    getCartTotalPrice,
  } = useShopStore()

  const totalItems = getCartTotalItems()
  const totalPrice = getCartTotalPrice()

  return (
    <main className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Корзина
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              Удалить все товары
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">Корзина пуста</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Вернуться к покупкам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <section className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-foreground line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.category || 'Категория'}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className={cn(
                              'p-2 hover:bg-secondary transition-colors',
                              item.quantity <= 1 && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {new Intl.NumberFormat('ru-RU').format(
                          item.price * item.quantity
                        )}{' '}
                        ₽
                      </div>
                      {item.oldPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {new Intl.NumberFormat('ru-RU').format(item.oldPrice)} ₽
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Не получается оформить заказ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Напишите нам — поможем с оформлением, доставкой и оплатой.
                </p>
                <div className="mt-4 space-y-1 text-sm text-foreground">
                  <div>+7 495 266 07 92</div>
                  <div>info@28bit.ru</div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Оформление
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="h-11 rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Имя"
                    />
                    <input
                      className="h-11 rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Фамилия"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="h-11 rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Телефон"
                    />
                    <input
                      className="h-11 rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Товаров</span>
                    <span className="text-foreground">{totalItems} шт.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Стоимость</span>
                    <span className="text-foreground">
                      {new Intl.NumberFormat('ru-RU').format(totalPrice)} ₽
                    </span>
                  </div>
                </div>

                <Button className="w-full mt-5 h-12 text-base font-semibold">
                  Перейти к оплате
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

