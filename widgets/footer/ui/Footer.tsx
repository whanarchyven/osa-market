import Link from 'next/link'
import type { FooterACF } from '@/shared/api/pages/footer/types'

interface FooterProps {
  data?: FooterACF
}

const isLinkValue = (value: string) =>
  value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:')

export function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const contacts = data?.gruppa_kontakty?.stroka_kontaktov ?? []
  const socials = data?.soczialnye_seti ?? []
  const slogan =
    data?.slogan ??
    'Ваш надёжный партнёр в мире компьютерных технологий. Качество, честность и экспертиза.'
  const copyright =
    data?.kopirajt ?? `© ${currentYear} OSA-MARKET. Все права защищены.`

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and About */}
          <div className="flex flex-col gap-4">
            <div className="font-bold text-2xl">
              <span className="text-primary">OSA</span>
              <span>-MARKET</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{slogan}</p>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-2">
                {socials.map((item, index) => {
                  if (!item.soczset.ikonka) return null
                  return (
                    <a
                      key={`${item.soczset.ssylka}-${index}`}
                      href={item.soczset.ssylka}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition"
                      aria-label={`Соцсеть ${index + 1}`}
                    >
                      <img
                        src={item.soczset.ikonka}
                        alt=""
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                      />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Навигация</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-muted-foreground hover:text-primary transition text-sm">
                Главная
              </Link>
              <Link href="/promos" className="text-muted-foreground hover:text-primary transition text-sm">
                Акции
              </Link>
              <Link href="/news" className="text-muted-foreground hover:text-primary transition text-sm">
                Новости
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition text-sm">
                О нас
              </Link>
              <Link href="/buyout" className="text-muted-foreground hover:text-primary transition text-sm">
                Выкуп
              </Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Контакты</h3>
            <div className="flex flex-col gap-4">
              {contacts.map((item, index) => {
                const content = (
                  <>
                    {item.ikonka ? (
                      <img
                        src={item.ikonka}
                        alt=""
                        className="w-5 h-5 flex-shrink-0 mt-0.5 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm whitespace-pre-line">
                      {item.zagolovok}
                    </span>
                  </>
                )

                return isLinkValue(item.ssylka) ? (
                  <a
                    key={`${item.ssylka}-${index}`}
                    href={item.ssylka}
                    className="flex gap-3 items-start text-muted-foreground hover:text-primary transition"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${item.zagolovok}-${index}`}
                    className="flex gap-3 items-start text-muted-foreground"
                  >
                    {content}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Мы на карте</h3>
            <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30 h-48">
              <div className="relative h-full w-full overflow-hidden">
                <a
                  href="https://yandex.ru/maps/org/osa_gaming/217441307477/?utm_medium=mapframe&utm_source=maps"
                  className="absolute left-2 top-1 text-[10px] text-muted-foreground"
                >
                  OSA Gaming
                </a>
                <a
                  href="https://yandex.ru/maps/213/moscow/category/computer_store/184105760/?utm_medium=mapframe&utm_source=maps"
                  className="absolute left-2 top-4 text-[10px] text-muted-foreground"
                >
                  Компьютерный магазин в Москве
                </a>
                <iframe
                  title="Карта OSA Gaming"
                  src="https://yandex.ru/map-widget/v1/?ll=37.632978%2C55.764648&mode=search&oid=217441307477&ol=biz&z=16.8"
                  className="h-full w-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>{copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/delivery" className="hover:text-primary transition">
              Доставка и оплата
            </Link>
            <Link href="/warranty-and-refund" className="hover:text-primary transition">
              Гарантия и возврат
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary transition">
              Политика конфиденциальности
            </Link>
            <Link href="/terms-of-use" className="hover:text-primary transition">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
