import type { ProductCategoryTaxonomy } from '@/shared/types/category'

import { CategoriesGrid } from './CategoriesGrid'

type CatalogSubcategoriesSectionProps = {
  subcategories: ProductCategoryTaxonomy[]
  /** slug текущего маршрута `/catalog/[slug]` */
  activeSlug: string
  /** id термина витрины — подсветка активной карточки рядом с `activeSlug` */
  activeCategoryId?: number
}

/** Дочерние термины WC для активной витрины — между переключателем топ-категорий и заголовком H1 */
export function CatalogSubcategoriesSection({
  subcategories,
  activeSlug,
  activeCategoryId,
}: CatalogSubcategoriesSectionProps) {
  if (!subcategories.length) return null

  return (
    <section className="mb-6 px-4">
      
      <CategoriesGrid
        categories={subcategories}
        activeSlug={activeSlug}
        activeCategoryId={activeCategoryId}
        compact
        horizontalScrollMobile
      />
    </section>
  )
}
