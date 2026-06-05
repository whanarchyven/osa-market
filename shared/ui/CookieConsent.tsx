'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'

const CONSENT_COOKIE_NAME = 'osa-cookie-consent'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365

type CookieConsentValue = 'accepted' | 'necessary'

const readConsent = (): CookieConsentValue | null => {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`)
  )
  const value = match?.[1]

  if (value === 'accepted' || value === 'necessary') {
    return value
  }

  return null
}

const persistConsent = (value: CookieConsentValue) => {
  document.cookie =
    `${CONSENT_COOKIE_NAME}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax`
}

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setIsReady(true)
  }, [])

  const handleConsent = (value: CookieConsentValue) => {
    persistConsent(value)
    setConsent(value)
  }

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=107058084', 'ym');

            ym(107058084, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `,
        }}
      />

      {isReady && !consent && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Мы используем cookies
              </p>
              <p className="text-sm text-muted-foreground">
                Они нужны для работы корзины, авторизации и аналитики. Вы можете
                принять все cookies или оставить только необходимые.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => handleConsent('necessary')}
              >
                Только необходимые
              </Button>
              <Button onClick={() => handleConsent('accepted')}>
                Принять все
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
