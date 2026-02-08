import type { ProductCategoryTaxonomy } from '@/shared/types/category'

import { CategoriesGrid } from './CategoriesGrid'

interface CategoriesBlockProps {
  title: string
  categories: ProductCategoryTaxonomy[]
  /** Если передан и категория есть в списке — подсветить карточку (жёлтый бордер) */
  activeCategoryId?: number
}

export function CategoriesBlock({
  title,
  categories,
  activeCategoryId,
}: CategoriesBlockProps) {
  if (!categories.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/10" />
        </div>
        <CategoriesGrid
          categories={categories}
          activeCategoryId={activeCategoryId}
        />
      </div>
    </section>
  )
}

