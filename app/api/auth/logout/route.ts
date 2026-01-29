import { NextResponse } from 'next/server'
import { AUTH_EMAIL_COOKIE, AUTH_TOKEN_COOKIE } from '@/shared/lib/auth'

export async function POST() {
  const response = NextResponse.json({ status: 'ok' })

  response.cookies.set(AUTH_EMAIL_COOKIE, '', {
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
