'use client'

import { type FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/shared/api'
import { useAuthStore, useShopStore } from '@/shared/store'
import { cn } from '@/lib/utils'
import { DeliveryAddressField } from '@/widgets/cart/ui/DeliveryAddressField'
import type { ProductApi } from '@/shared/types/product'
import { PromoProductsSlider } from '@/widgets/promo/ui/PromoProductsSlider'
import { getProductPath } from '@/shared/utils/productRoute'

type CheckoutForm = {
  firstName: string
  phone: string
  email: string
  address: string
}

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotalItems,
    getCartTotalPrice,
  } = useShopStore()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const totalItems = getCartTotalItems()
  const totalPrice = getCartTotalPrice()
  const router = useRouter()
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    phone: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [crossSellProducts, setCrossSellProducts] = useState<ProductApi[]>([])
  const [isCrossSellLoading, setIsCrossSellLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    const fullName = (user.name ?? '').trim()

    setForm((prev) => ({
      ...prev,
      firstName: prev.firstName || fullName || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }))
  }, [isAuthenticated, user])

  useEffect(() => {
    const productIds = cart
      .map((item) => Number(item.id))
      .filter((id) => Number.isFinite(id) && id > 0)

    if (!productIds.length) {
      setCrossSellProducts([])
      setIsCrossSellLoading(false)
      return
    }

    let isActive = true

    const loadCrossSells = async () => {
      setIsCrossSellLoading(true)

      try {
        const cartProductsResponse = await fetch(
          `/api/proxy/wc/v3/products?include=${productIds.join(',')}&per_page=${productIds.length}&status=publish&_fields=id,cross_sell_ids`
        )

        if (!cartProductsResponse.ok) {
          throw new Error('Failed to load cart products')
        }

        const cartProducts = (await cartProductsResponse.json()) as Array<{
          id: number
          cross_sell_ids?: number[]
        }>

        const crossSellIds = [...new Set(
          cartProducts.flatMap((product) => product.cross_sell_ids ?? [])
        )]
          .filter((id) => !productIds.includes(id))
          .slice(0, 12)

        if (!crossSellIds.length) {
          if (isActive) {
            setCrossSellProducts([])
          }
          return
        }

        const crossSellResponse = await fetch(
          `/api/proxy/wc/v3/products?include=${crossSellIds.join(',')}&per_page=${crossSellIds.length}&status=publish&orderby=include`
        )

        if (!crossSellResponse.ok) {
          throw new Error('Failed to load cross-sell products')
        }

        const data = (await crossSellResponse.json()) as ProductApi[]

        if (isActive) {
          setCrossSellProducts(data)
        }
      } catch {
        if (isActive) {
          setCrossSellProducts([])
        }
      } finally {
        if (isActive) {
          setIsCrossSellLoading(false)
        }
      }
    }

    loadCrossSells()

    return () => {
      isActive = false
    }
  }, [cart])

  const setField =
    (field: keyof CheckoutForm) =>
    (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const validateField = (
    field: keyof CheckoutForm,
    value: string
  ): string | undefined => {
    const trimmed = value.trim()

    if (!trimmed) {
      return 'Поле обязательно'
    }

    if (field === 'email') {
      return undefined
    }

    if (field === 'phone') {
      const digits = trimmed.replace(/\D/g, '')
      return digits.length >= 10 ? undefined : 'Введите корректный телефон'
    }

    if (field === 'address' && trimmed.length < 8) {
      return 'Укажите полный адрес'
    }

    return undefined
  }

  const validateForm = () => {
    const nextErrors: Partial<CheckoutForm> = {}
    ;(Object.keys(form) as (keyof CheckoutForm)[]).forEach((field) => {
      const error = validateField(field, form[field])
      if (error) {
        nextErrors[field] = error
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const isValid = validateForm()
    if (!isValid) {
      return
    }

    const lineItems = cart
      .map((item) => ({
        product_id: Number(item.id),
        quantity: item.quantity,
      }))
      .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0)

    if (lineItems.length === 0) {
      setSubmitError('Не удалось сформировать заказ. Попробуйте ещё раз.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const customerId = isAuthenticated ? Number(user?.id) : null
      const order = await createOrder({
        ...(Number.isFinite(customerId) && customerId && customerId > 0
          ? { customer_id: customerId }
          : {}),
        billing: {
          first_name: form.firstName.trim(),
          last_name: '',
          email: form.email.trim(),
          phone: form.phone.trim(),
          address_1: form.address.trim(),
        },
        shipping: {
          first_name: form.firstName.trim(),
          last_name: '',
          address_1: form.address.trim(),
        },
        line_items: lineItems,
      })

      try {
        const telegramResponse = await fetch('/api/telegram/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            customer: {
              firstName: form.firstName.trim(),
              lastName: '',
              messengerId: form.email.trim(),
              phone: form.phone.trim(),
              address: form.address.trim(),
            },
            items: cart.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            totalPrice,
            totalItems,
          }),
        })

        if (!telegramResponse.ok) {
          // keep checkout successful even if Telegram fails
          console.warn('Telegram delivery failed')
        }
      } catch (error) {
        // keep checkout successful even if Telegram fails
        console.warn('Telegram delivery failed', error)
      }

      clearCart()
      setForm({
        firstName: '',
        phone: '',
        email: '',
        address: '',
      })
      setErrors({})
      router.push('/order-success')
    } catch (error) {
      setSubmitError('Не удалось оформить заказ. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    <Link
                      href={getProductPath(item)}
                      className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary block"
                    >
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.imageAlt || item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={getProductPath(item)}
                        className="text-base font-medium text-foreground line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
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

              {(isCrossSellLoading || crossSellProducts.length > 0) && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Добавьте к заказу
                  </h2>
                  {isCrossSellLoading ? (
                    <p className="text-sm text-muted-foreground">Подбираем товары...</p>
                  ) : (
                    <PromoProductsSlider products={crossSellProducts} />
                  )}
                </div>
              )}

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Не получается оформить заказ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Напишите нам — поможем с оформлением, доставкой и оплатой.
                </p>
                <div className="mt-4 space-y-1 text-sm text-foreground">
                  <div>info@osa-market.ru</div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Оформление
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2 sm:col-span-2">
                        <input
                          value={form.firstName}
                          onChange={(event) =>
                            setField('firstName')(event.target.value)
                          }
                          onBlur={() =>
                            setErrors((prev) => ({
                              ...prev,
                              firstName: validateField(
                                'firstName',
                                form.firstName
                              ),
                            }))
                          }
                          className={cn(
                            'h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground',
                            errors.firstName &&
                              'border-destructive focus-visible:ring-destructive'
                          )}
                          placeholder="Имя"
                          autoComplete="given-name"
                          aria-invalid={Boolean(errors.firstName)}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-destructive">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <input
                          value={form.phone}
                          onChange={(event) =>
                            setField('phone')(event.target.value)
                          }
                          onBlur={() =>
                            setErrors((prev) => ({
                              ...prev,
                              phone: validateField('phone', form.phone),
                            }))
                          }
                          className={cn(
                            'h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground',
                            errors.phone &&
                              'border-destructive focus-visible:ring-destructive'
                          )}
                          placeholder="Телефон"
                          autoComplete="tel"
                          inputMode="tel"
                          aria-invalid={Boolean(errors.phone)}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          value={form.email}
                          onChange={(event) =>
                            setField('email')(event.target.value)
                          }
                          onBlur={() =>
                            setErrors((prev) => ({
                              ...prev,
                              email: validateField('email', form.email),
                            }))
                          }
                          className={cn(
                            'h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground',
                            errors.email &&
                              'border-destructive focus-visible:ring-destructive'
                          )}
                          placeholder="Ваш ID (username)"
                          type="text"
                          autoComplete="username"
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Пример: @username или номер телефона в мессенджерах (telegram, whatsapp, MAX)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      Доставка
                    </h3>
                    <DeliveryAddressField
                      value={form.address}
                      onChange={setField('address')}
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          address: validateField('address', form.address),
                        }))
                      }
                      error={errors.address}
                    />
                  </div>

                  <div className="border-t border-border pt-4 space-y-3 text-sm">
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

                  <div>
                    <Button
                      className="w-full h-12 text-base font-semibold"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Отправляем…' : 'Заказать'}
                    </Button>
                    {submitError && (
                      <p className="text-sm mt-3 text-destructive">{submitError}</p>
                    )}
                    <p className="text-sm mt-3 text-muted-foreground">
                      Нажимая на кнопку "Заказать", вы соглашаетесь с условиями
                      использования сайта и политикой конфиденциальности.
                    </p>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

