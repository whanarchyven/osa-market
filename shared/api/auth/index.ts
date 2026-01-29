import type { User } from '@/shared/store'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  phone?: string
}

type AuthResponse = {
  user: User
  token?: string | null
}

const parseErrorMessage = async (response: Response, fallback: string) => {
  const data = await response.json().catch(() => null)
  return data?.message ?? fallback
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Не удалось выполнить вход')
    throw new Error(message)
  }

  return response.json()
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      'Не удалось создать аккаунт'
    )
    throw new Error(message)
  }

  return response.json()
}

export const logoutUser = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      'Не удалось выйти из аккаунта'
    )
    throw new Error(message)
  }
}
