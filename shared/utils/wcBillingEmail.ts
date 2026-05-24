import { SITE_URL } from '@/shared/config/site'

/** Достаточно для синтаксиса; WooCommerce на сервере проверит строже. */
const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function fallbackBillingEmailFromSite(): string {
  try {
    const host = new URL(SITE_URL).hostname.replace(/^www\./i, '')
    if (host) {
      return `noreply+guest@${host}`
    }
  } catch {
    /* ignore */
  }
  return 'noreply+guest@osa-market.ru'
}

/**
 * Поле контакта в корзине может быть мессенджером или email.
 * В billing.email WooCommerce нужен только валидный email.
 */
export function resolveWooBillingEmail(contactRaw: string): string {
  const trimmed = contactRaw.trim()
  if (trimmed && SIMPLE_EMAIL_REGEX.test(trimmed)) {
    return trimmed
  }
  return (
    process.env.NEXT_PUBLIC_ORDER_FALLBACK_EMAIL?.trim() ||
    fallbackBillingEmailFromSite()
  )
}
