'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, PhoneCall } from 'lucide-react'
import { Logo } from './Logo'
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
  const { setCallbackModalOpen } = useUIStore()
  const [isHidden, setIsHidden] = useState(false)
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
            
            <button
              onClick={() => setCallbackModalOpen(true)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Заказать звонок
            </button>

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
