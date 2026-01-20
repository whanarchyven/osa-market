'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CatalogProductCard } from './CatalogProductCard'
import type { Product } from '@/shared/types/api'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/shared/store'

interface CatalogGridProps {
  products: Product[]
  totalCount: number
}

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Сначала дешевые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'newest', label: 'Новинки' },
]

export function CatalogGrid({ products, totalCount }: CatalogGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isCatalogLoading, setCatalogLoading } = useUIStore()
  const [sortBy, setSortBy] = useState<SortOption>('price_asc')

  useEffect(() => {
    const value = searchParams.get('sort') as SortOption | null
    if (value && value !== sortBy) {
      setSortBy(value)
    }
    setCatalogLoading(false)
  }, [searchParams, sortBy, setCatalogLoading])

  const currentSort = sortOptions.find(opt => opt.value === sortBy)

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    setCatalogLoading(true)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex-1">
      {/* Панель управления */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Найдено: <span className="text-foreground font-medium">{totalCount}</span> товаров
        </div>

        <div className="flex items-center gap-4">
          {/* Сортировка */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {currentSort?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(sortBy === option.value && "bg-accent")}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Сетка товаров */}
      <div className="relative">
        {isCatalogLoading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/70 backdrop-blur-sm rounded-2xl">
            <div className="flex items-center gap-3 px-4 py-3 mt-12 bg-card border border-border rounded-full text-sm text-foreground shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Обновляем товары...
            </div>
          </div>
        )}
        {products.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Товары не найдены</p>
            <p className="text-sm text-muted-foreground mt-2">
              Попробуйте изменить параметры фильтрации
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
