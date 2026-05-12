export interface CategoryAttributeSlug {
  slug_attributa: string
}

export interface ProductCategoryAcf {
  /** В WP может прийти как массив, один объект, false или пустое значение */
  dostupnye_attributy?: CategoryAttributeSlug[] | CategoryAttributeSlug | false | null
  ikonka_kategorii?: string
  image?: { url?: string; alt?: string } | string
  lucide_icon?: string
}

import type { YoastHeadJson } from '@/shared/seo/yoast'

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
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}


