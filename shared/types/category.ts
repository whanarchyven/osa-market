export interface CategoryAttributeSlug {
  slug_attributa: string
}

export interface ProductCategoryAcf {
  dostupnye_attributy: CategoryAttributeSlug[]
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
}

