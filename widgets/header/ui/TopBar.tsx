'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, PhoneCall } from 'lucide-react'
import { Logo } from './Logo'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/shared/store'
import type { SocialNetworkItem } from '@/shared/types/api'

const navLinks = [
  { href: '/promos', label: 'Акции' },
  { href: '/news', label: 'Новости' },
  { href: '/about', label: 'О нас' },
  { href: '/buyout', label: 'Выкуп' },
]

interface TopBarProps {
  nomer_telefona?: string
  soczialnye_seti?: SocialNetworkItem[]
}

const normalizePhone = (value?: string) => value?.replace(/\s+/g, '') ?? ''

export function TopBar({ nomer_telefona, soczialnye_seti }: TopBarProps) {
  const { isCallbackModalOpen, setCallbackModalOpen } = useUIStore()
  const [isHidden, setIsHidden] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const phoneValue = nomer_telefona?.trim() ?? ''
  const phoneHref = phoneValue ? `tel:${normalizePhone(phoneValue)}` : ''

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/telegram/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          comment: formData.comment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Telegram delivery failed')
      }

      setFormData({ name: '', phone: '', comment: '' })
      setIsSuccess(true)
      setCallbackModalOpen(false)
    } catch (error) {
      setSubmitError('Не удалось отправить заявку. Попробуйте позже.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`hidden lg:block overflow-hidden bg-background/80 backdrop-blur-sm transition-all duration-300 ${
        isHidden
          ? 'max-h-0 opacity-0 pointer-events-none border-b border-transparent'
          : 'max-h-12 opacity-100 border-b border-border/50'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left section */}
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6">
            {phoneValue && (
              <a
                href={phoneHref}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {phoneValue}
              </a>
            )}
            
            <Dialog open={isCallbackModalOpen} onOpenChange={setCallbackModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  <PhoneCall className="w-4 h-4" />
                  Заказать звонок
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Заказать звонок</DialogTitle>
                  <DialogDescription>
                    Оставьте контактные данные, и мы перезвоним вам.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSuccess && (
                    <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                      Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="callback-name">
                      Имя
                    </label>
                    <input
                      id="callback-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Иван Петров"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="callback-phone">
                      Телефон
                    </label>
                    <input
                      id="callback-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="callback-comment">
                      Комментарий
                    </label>
                    <textarea
                      id="callback-comment"
                      name="comment"
                      required
                      rows={3}
                      value={formData.comment}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          comment: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Удобное время для звонка или вопрос"
                    />
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </Button>
                  </DialogFooter>
                  {submitError && (
                    <p className="text-sm text-destructive">{submitError}</p>
                  )}
                </form>
              </DialogContent>
            </Dialog>

            {soczialnye_seti?.length ? (
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                {soczialnye_seti.map((item, index) => (
                  <a
                    key={`${item.soczset.ssylka}-${index}`}
                    href={item.soczset.ssylka}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Соцсеть ${index + 1}`}
                  >
                    <img
                      src={item.soczset.ikonka}
                      alt=""
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
