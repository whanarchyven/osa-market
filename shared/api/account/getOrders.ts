import type { AccountOrder } from '@/shared/types/order'

const parseErrorMessage = async (response: Response, fallback: string) => {
  const data = await response.json().catch(() => null)
  return data?.message ?? fallback
}

export const getAccountOrders = async (): Promise<AccountOrder[]> => {
  const response = await fetch('/api/account/orders', {
    cache: 'no-store',
  })

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      'Не удалось загрузить заказы'
    )
    throw new Error(message)
  }

  return response.json()
}
