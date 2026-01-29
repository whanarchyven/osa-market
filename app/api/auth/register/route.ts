import { NextResponse } from 'next/server'
import { prepareHeaders } from '@/shared/api/prepareHeaders'
import { AUTH_EMAIL_COOKIE, AUTH_TOKEN_COOKIE } from '@/shared/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL

const splitName = (value?: string) => {
  if (!value) {
    return { firstName: '', lastName: '' }
  }

  const parts = value.trim().split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

const requestToken = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: email,
      password,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json().catch(() => null)
  return data?.token ?? null
}

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: 'API_URL is not configured' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string; phone?: string }
    | null

  const email = body?.email?.trim()
  const password = body?.password
  const name = body?.name?.trim()
  const phone = body?.phone?.trim()

  if (!email || !password || !name) {
    return NextResponse.json(
      { message: 'Имя, email и пароль обязательны' },
      { status: 400 }
    )
  }

  const { firstName, lastName } = splitName(name)
  const headers = prepareHeaders(new Headers())
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_URL}/wc/v3/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      username: email.split('@')[0] ?? email,
      first_name: firstName || name,
      last_name: lastName,
      password,
      billing: {
        email,
        phone,
        first_name: firstName || name,
        last_name: lastName,
      },
      shipping: {
        first_name: firstName || name,
        last_name: lastName,
      },
    }),
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message ?? 'Не удалось создать пользователя' },
      { status: response.status }
    )
  }

  const token = await requestToken(email, password)
  const user = {
    id: String(data?.id ?? email),
    email: data?.email ?? email,
    name: `${data?.first_name ?? name} ${data?.last_name ?? ''}`.trim(),
    phone: data?.billing?.phone ?? phone,
  }

  const result = NextResponse.json({ user, token })

  result.cookies.set(AUTH_EMAIL_COOKIE, user.email, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  if (token) {
    result.cookies.set(AUTH_TOKEN_COOKIE, token, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return result
}
