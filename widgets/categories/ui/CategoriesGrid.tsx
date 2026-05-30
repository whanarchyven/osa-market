import { cn } from '@/lib/utils'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'

import { CategoriesCard } from './CategoriesCard'

interface CategoriesGridProps {
  categories: ProductCategoryTaxonomy[]
  activeCategoryId?: number
  variant?: 'default' | 'compact'
}

export function CategoriesGrid({
  categories,
  activeCategoryId,
  variant = 'default',
}: CategoriesGridProps) {
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        isCompact
          ? 'flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-6 lg:overflow-visible lg:px-0'
          : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6',
      )}
    >
      {categories.map((category) => (
        <CategoriesCard
          key={category.id}
          category={category}
          variant={variant}
          isActive={
            activeCategoryId != null && category.id === activeCategoryId
          }
        />
      ))}
    </div>
  )
}
