'use client'

import React, { useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import type { BuyoutFormContacts } from '@/shared/types/api'

interface BuyoutFormProps {
  contacts: BuyoutFormContacts
}

type InterestType = 'buyout' | 'trade-in'

export function BuyoutForm({ contacts }: BuyoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
  })
  const [interest, setInterest] = useState<InterestType>('buyout')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API endpoint
      console.log('[v0] Submitting buyout form:', {
        ...formData,
        interest,
      })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setFormData({ name: '', phone: '', comment: '' })
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
    } catch (error) {
      console.error('[v0] Form submission error:', error)
      alert('Ошибка при отправке формы. Пожалуйста, попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const phoneHref = `tel:${contacts.nomer_telefona.replace(/\s+/g, '')}`
  const mailHref = `mailto:${contacts.pochta}`

  return (
    <div className="bg-background/95 border border-primary/30 rounded-xl p-5 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Оставить заявку
      </h2>
      <p className="text-muted-foreground mb-4">
        Заполните форму, и мы свяжемся с вами для уточнения деталей
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="block text-sm font-medium text-white mb-2">
            Что вас интересует
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInterest('buyout')}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                interest === 'buyout'
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/60 hover:text-primary'
              }`}
            >
              Выкуп
            </button>
            <button
              type="button"
              onClick={() => setInterest('trade-in')}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                interest === 'trade-in'
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/60 hover:text-primary'
              }`}
            >
              Trade-in
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Ваше имя *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Иван Петров"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-white placeholder-muted-foreground"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-white placeholder-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
            Что вы хотите продать? *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            placeholder="Например: Ноутбук MSI Katana 17 RTX 5070, работает хорошо, небольшие царапины на корпусе"
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-white placeholder-muted-foreground resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </button>

        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm text-muted-foreground">
            Или свяжитесь с нами напрямую:
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={phoneHref}
              className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>{contacts.nomer_telefona}</span>
            </a>
            <a
              href={mailHref}
              className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>{contacts.pochta}</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
