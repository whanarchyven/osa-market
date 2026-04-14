const DEFAULT_SITE_URL = 'https://osa-market.ru'
const DEFAULT_API_URL = 'https://api.osa-market.ru/wp-json'

const normalizePublicUrl = (value?: string) => {
  if (!value) return DEFAULT_SITE_URL

  try {
    const url = new URL(value)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return DEFAULT_SITE_URL
    }

    return url.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = normalizePublicUrl(process.env.NEXT_PUBLIC_FRONT_BASE_URL)
export const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL || DEFAULT_API_URL
