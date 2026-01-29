import { NextResponse } from 'next/server'
import { AUTH_EMAIL_COOKIE, AUTH_TOKEN_COOKIE } from '@/shared/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL

const buildUserPayload = (data: any, fallbackEmail: string) => {
  const email = data?.user_email ?? fallbackEmail
  const name = data?.user_display_name ?? data?.user_nicename ?? email
  const id = String(data?.user_id ?? data?.user_nicename ?? email)

  return { id, email, name }
}

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: 'API_URL is not configured' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null

  const email = body?.email?.trim()
  const password = body?.password

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email и пароль обязательны' },
      { status: 400 }
    )
  }

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

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message ?? 'Неверный логин или пароль' },
      { status: response.status }
    )
  }

  const user = buildUserPayload(data, email)
  const token = data?.token ?? null
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
