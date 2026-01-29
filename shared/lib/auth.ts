export const AUTH_TOKEN_COOKIE = 'osa-auth-token'
export const AUTH_EMAIL_COOKIE = 'osa-auth-email'

export const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') {
    return null
  }

  const pattern = new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}=([^;]*)`)
  const match = document.cookie.match(pattern)
  return match ? decodeURIComponent(match[1]) : null
}

export const getAuthEmailFromCookie = () => getCookieValue(AUTH_EMAIL_COOKIE)

export const clearAuthClientStorage = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem('token')
}
