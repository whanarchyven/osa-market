export interface CategoryAttributeSlug {
  slug_attributa: string
}

export interface ProductCategoryAcf {
  dostupnye_attributy: CategoryAttributeSlug[]
  ikonka_kategorii?: string
  image?: { url?: string } | string
  lucide_icon?: string
}

export interface ProductCategoryTaxonomy {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  acf?: ProductCategoryAcf
  /** Флаг управления отображением количества товаров на карточке */
  showProducts?: boolean
}


