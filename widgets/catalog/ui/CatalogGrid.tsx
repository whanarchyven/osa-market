'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CatalogProductCard } from './CatalogProductCard'
import type { ProductListItem } from '@/shared/types/product'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/shared/store'

interface CatalogGridProps {
  products: ProductListItem[]
  totalCount: number
  totalPages: number
  currentPage: number
}

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Сначала дешевые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'newest', label: 'Новинки' },
]

const buildPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages])

  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  ) {
    pages.add(page)
  }

  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
  }

  const sortedPages = [...pages].sort((a, b) => a - b)
  const items: Array<number | 'ellipsis'> = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage && page - previousPage > 1) {
      items.push('ellipsis')
    }

    items.push(page)
  })

  return items
}

export function CatalogGrid({
  products,
  totalCount,
  totalPages,
  currentPage,
}: CatalogGridProps) {
  const pathname = usePathname()
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
    params.delete('page')
    setCatalogLoading(true)
    router.push(`?${params.toString()}`)
  }

  const getPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const paginationItems = buildPaginationItems(currentPage, totalPages)

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
      {totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-center gap-2 flex-wrap"
          aria-label="Пагинация каталога"
        >
          {currentPage > 1 ? (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={getPageHref(currentPage - 1)}
                rel="prev"
                onClick={() => setCatalogLoading(true)}
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label="Предыдущая страница">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {paginationItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <Button
                key={item}
                variant={item === currentPage ? 'default' : 'outline'}
                className={cn(
                  'min-w-9 px-3',
                  item === currentPage && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                asChild
              >
                <Link
                  href={getPageHref(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  onClick={() => setCatalogLoading(true)}
                >
                  {item}
                </Link>
              </Button>
            )
          )}

          {currentPage < totalPages ? (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={getPageHref(currentPage + 1)}
                rel="next"
                onClick={() => setCatalogLoading(true)}
                aria-label="Следующая страница"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label="Следующая страница">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </nav>
      )}
    </div>
  )
}
