import type { ProductCategoryTaxonomy } from '@/shared/types/category'

import { CategoriesGrid } from './CategoriesGrid'

interface CategoriesBlockProps {
  title: string
  categories: ProductCategoryTaxonomy[]
  /** Если передан и категория есть в списке — подсветить карточку (жёлтый бордер) */
  activeCategoryId?: number
  /** Компактный вид: горизонтальный скролл категорий на мобиле, меньшие заголовки */
  variant?: 'default' | 'compact'
}

export function CategoriesBlock({
  title,
  categories,
  activeCategoryId,
  variant = 'default',
}: CategoriesBlockProps) {
  if (!categories.length) return null

  const isCompact = variant === 'compact'

  return (
    <section className={isCompact ? 'py-3' : 'py-6'}>
      <div className={isCompact ? undefined : 'container mx-auto px-4'}>
        <div className={isCompact ? 'mb-3' : 'mb-8'}>
          <h2
            className={
              isCompact
                ? 'text-base font-semibold text-foreground md:text-lg'
                : 'text-2xl font-bold text-foreground md:text-3xl'
            }
          >
            {title}
          </h2>
          <div
            className={
              isCompact
                ? 'mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-primary/10'
                : 'mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/10'
            }
          />
        </div>
        <CategoriesGrid
          categories={categories}
          activeCategoryId={activeCategoryId}
          variant={variant}
        />
      </div>
    </section>
  )
}

