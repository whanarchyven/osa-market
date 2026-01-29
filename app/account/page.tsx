'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/shared/store'
import { getAccountOrders } from '@/shared/api/account/getOrders'
import { logoutUser } from '@/shared/api/auth'
import { useAuthSync } from '@/shared/hooks/useAuthSync'
import { clearAuthClientStorage } from '@/shared/lib/auth'
import type { AccountOrder } from '@/shared/types/order'

const statusLabels: Record<string, string> = {
  pending: 'Ожидает оплаты',
  processing: 'В обработке',
  completed: 'Завершён',
  cancelled: 'Отменён',
  refunded: 'Возврат',
  failed: 'Ошибка',
  'on-hold': 'На удержании',
}

const formatCurrency = (currency: string) => {
  if (currency === 'RUB') {
    return '₽'
  }
  if (currency === 'USD') {
    return '$'
  }
  if (currency === 'EUR') {
    return '€'
  }
  return currency
}

export default function AccountPage() {
  useAuthSync()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasOrders = orders.length > 0

  const loadOrders = async () => {
    if (!isAuthenticated) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getAccountOrders()
      setOrders(data)
    } catch (error) {
      setOrders([])
      setError(
        error instanceof Error ? error.message : 'Не удалось получить заказы'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      // ignore logout errors to ensure UI is cleared
    } finally {
      logout()
      clearAuthClientStorage()
    }
  }

  const userName = useMemo(() => {
    return user?.name?.trim() || user?.email || 'Пользователь'
  }, [user])

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Личный кабинет
            </h1>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Чтобы увидеть заказы, войдите в аккаунт.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Войти
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Личный кабинет
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Добро пожаловать, {userName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary transition-colors"
            >
              Выйти
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Профиль
              </h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="text-foreground">Email:</span>{' '}
                  {user?.email ?? '—'}
                </p>
                <p>
                  <span className="text-foreground">Телефон:</span>{' '}
                  {user?.phone ?? '—'}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Мои заказы
                </h2>
                <button
                  onClick={loadOrders}
                  disabled={isLoading}
                  className="text-sm text-primary hover:underline disabled:opacity-60"
                >
                  Обновить
                </button>
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground">
                  Загружаем заказы...
                </p>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {!isLoading && !error && !hasOrders && (
                <p className="text-sm text-muted-foreground">
                  У вас пока нет заказов.
                </p>
              )}

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-border/80 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Заказ №{order.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date_created).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {order.total}{' '}
                          {formatCurrency(order.currency || 'RUB')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {statusLabels[order.status] ?? order.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {order.line_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm text-muted-foreground"
                        >
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × {item.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

