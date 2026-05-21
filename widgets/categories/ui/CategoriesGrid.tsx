import type { ProductCategoryTaxonomy } from '@/shared/types/category'

import { CategoriesCard } from './CategoriesCard'

interface CategoriesGridProps {
  categories: ProductCategoryTaxonomy[]
  activeCategoryId?: number
}

export function CategoriesGrid({
  categories,
  activeCategoryId,
}: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
      {categories.map((category) => (
        <CategoriesCard
          key={category.id}
          category={category}
          isActive={
            activeCategoryId != null && category.id === activeCategoryId
          }
        />
      ))}
    </div>
  )
}
