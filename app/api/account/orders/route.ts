import { NextRequest, NextResponse } from 'next/server'
import { prepareHeaders } from '@/shared/api/prepareHeaders'
import { AUTH_EMAIL_COOKIE } from '@/shared/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { message: 'API_URL is not configured' },
      { status: 500 }
    )
  }

  const email = request.cookies.get(AUTH_EMAIL_COOKIE)?.value

  if (!email) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 })
  }

  const headers = prepareHeaders(new Headers())

  const customerResponse = await fetch(
    `${API_URL}/wc/v3/customers?email=${encodeURIComponent(email)}`,
    {
      headers,
      cache: 'no-store',
    }
  )

  if (!customerResponse.ok) {
    const data = await customerResponse.json().catch(() => null)
    return NextResponse.json(
      { message: data?.message ?? 'Не удалось получить пользователя' },
      { status: customerResponse.status }
    )
  }

  const customers = (await customerResponse.json().catch(() => [])) as Array<{
    id?: number
  }>
  const customerId = customers[0]?.id

  if (!customerId) {
    return NextResponse.json([])
  }

  const ordersResponse = await fetch(
    `${API_URL}/wc/v3/orders?customer=${customerId}&per_page=50&orderby=date&order=desc`,
    {
      headers,
      cache: 'no-store',
    }
  )

  if (!ordersResponse.ok) {
    const data = await ordersResponse.json().catch(() => null)
    return NextResponse.json(
      { message: data?.message ?? 'Не удалось получить заказы' },
      { status: ordersResponse.status }
    )
  }

  const orders = await ordersResponse.json().catch(() => [])
  return NextResponse.json(orders)
}
