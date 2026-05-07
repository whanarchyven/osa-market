/**
 * Встройка официального виджета отзывов Яндекс Карт (О нас).
 */
const ORG_WIDGET_SRC =
  'https://yandex.ru/maps-reviews-widget/217441307477?comments'
const MAP_ORG_LINK =
  'https://yandex.ru/maps/org/osa_gaming/217441307477/'

export function AboutYandexReviews() {
  return (
    <section className="border-t border-border/60 bg-card/25 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Отзывы
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Реальные оценки и комментарии на Яндекс Картах
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3">
          <div
            className="relative w-full overflow-hidden rounded-xl border border-border"
            style={{
              height: 'min(800px, calc(100vh - 10rem))',
              minHeight: '360px',
            }}
          >
            <iframe
              title="Отзывы OSA Gaming на Яндекс Картах"
              className="absolute inset-0 size-full border-0 rounded-[calc(0.75rem-1px)]"
              loading="lazy"
              src={ORG_WIDGET_SRC}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={MAP_ORG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[10px] leading-snug text-muted-foreground hover:text-primary sm:text-xs"
          >
            OSA Gaming на карте Москвы — Яндекс&nbsp;Карты
          </a>
        </div>
      </div>
    </section>
  )
}
