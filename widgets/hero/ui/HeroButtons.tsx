'use client'

import Link from 'next/link'
import { LayoutGrid, User, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/shared/store'
import { useAuthSync } from '@/shared/hooks/useAuthSync'

export function HeroButtons() {
  useAuthSync()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href="/catalog/laptops"
        className="group flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-primary/25"
      >
        <LayoutGrid className="w-5 h-5" />
        <p>Открыть каталог</p>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <Link
        href={isAuthenticated ? '/account' : '/login'}
        className="group flex items-center gap-3 px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-full border border-border hover:border-primary/50 transition-all"
      >
        <User className="w-5 h-5" />
        <span>{isAuthenticated ? 'Кабинет' : 'Войти'}</span>
      </Link>
    </div>
  )
}
