import type { ProductCategoryTaxonomy } from '@/shared/types/category'
import { cn } from '@/lib/utils'

import { CategoriesCard } from './CategoriesCard'

interface CategoriesGridProps {
  categories: ProductCategoryTaxonomy[]
  activeCategoryId?: number
  /** Подсветка по slug (удобно на странице субкаталога) */
  activeSlug?: string
  compact?: boolean
  /** На мобилке — горизонтальный скролл вместо сетки; с md — обычная сетка */
  horizontalScrollMobile?: boolean
}

export function CategoriesGrid({
  categories,
  activeCategoryId,
  activeSlug,
  compact = false,
  horizontalScrollMobile = false,
}: CategoriesGridProps) {
  const isActive = (category: ProductCategoryTaxonomy) =>
    (activeCategoryId != null && category.id === activeCategoryId) ||
    (activeSlug != null && category.slug === activeSlug)

  if (compact && horizontalScrollMobile) {
    return (
      <div
        className={cn(
          '-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2',
          'snap-x snap-proximity touch-pan-x',
          '[scrollbar-width:thin]',
          '[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border',
          'md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 md:snap-none',
          'lg:grid-cols-4 xl:grid-cols-5'
        )}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="w-[clamp(112px,36vw,148px)] shrink-0 snap-start md:w-auto md:min-w-0 md:shrink"
          >
            <CategoriesCard
              category={category}
              compact
              narrow
              isActive={isActive(category)}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={
        compact
          ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4'
          : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6'
      }
    >
      {categories.map((category) => (
        <CategoriesCard
          key={category.id}
          category={category}
          compact={compact}
          isActive={isActive(category)}
        />
      ))}
    </div>
  )
}
