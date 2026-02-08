/** Элемент списка отображаемых категорий с ручки страницы каталога */
export interface CatalogPageCategoryItem {
  kategoriya: number[]
}

export interface CatalogPageACF {
  otobrazhaemye_kategorii: CatalogPageCategoryItem[]
}

export interface CatalogPageData {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: string
  ping_status: string
  template: string
  meta: {
    _acf_changed: boolean
    footnotes: string
  }
  class_list: string[]
  acf: CatalogPageACF
  _links?: Record<string, unknown>
}
