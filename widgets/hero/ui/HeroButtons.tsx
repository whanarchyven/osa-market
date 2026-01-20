'use client'

import Link from 'next/link'
import { LayoutGrid, User, ArrowRight } from 'lucide-react'
import { useUIStore, useAuthStore } from '@/shared/store'

export function HeroButtons() {
  const { toggleCatalog } = useUIStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={toggleCatalog}
        className="group flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-primary/25"
      >
        <LayoutGrid className="w-5 h-5" />
        <span>Открыть каталог</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <Link
        href={isAuthenticated ? '/account' : '/login'}
        className="group flex items-center gap-3 px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-full border border-border hover:border-primary/50 transition-all"
      >
        <User className="w-5 h-5" />
        <span>{isAuthenticated ? 'Личный кабинет' : 'Войти'}</span>
      </Link>
    </div>
  )
}
