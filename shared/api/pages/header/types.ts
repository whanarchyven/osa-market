export interface Fakt {
    zagolovok: string
    opisanie: string
  }
  
  export interface Preimushhestvo {
    preimushhestvo: string
  }
  
  export interface TovarPost {
    ID: number
    post_author: string
    post_date: string
    post_date_gmt: string
    post_content: string
    post_title: string
    post_excerpt: string
    post_status: string
    comment_status: string
    ping_status: string
    post_password: string
    post_name: string
    to_ping: string
    pinged: string
    post_modified: string
    post_modified_gmt: string
    post_content_filtered: string
    post_parent: number
    guid: string
    menu_order: number
    post_type: string
    post_mime_type: string
    comment_count: string
    filter: string
  }
  
  export interface TovarItem {
    tovar: TovarPost
  }
  
  export interface ZaglavnyjBlok {
    slogan: string
    opisanie: string
    fakty: Fakt[]
    preimushhestva: Preimushhestvo[]
    nazvanie_bloka_s_tovarami: string
    opisanie_bloka_s_tovarami: string
    tovary: TovarItem[]
    ssylka_na_video: string
  }
  
  export interface PageACF {
    zaglavnyj_blok: ZaglavnyjBlok
  }
  
  export interface PageData {
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
    acf: PageACF
  }
  
  // Типы для каталога (Header)
  export interface VariantFiltra {
    zagolovok: string
    znachenie: string
  }
  
  export interface VariantFiltraItem {
    variant_filtra: VariantFiltra
  }
  
  export interface GruppaFiltrov {
    zagolovok_filtra: string
    slug_taksonomii: string
    varianty_filtra: VariantFiltraItem[]
  }
  
  export interface GruppaFiltrovItem {
    gruppa_filtrov: GruppaFiltrov
  }
  
  export interface SsylkaNaKategoriyu {
    term_id: number
    name: string
    slug: string
    term_group: number
    term_taxonomy_id: number
    taxonomy: string
    description: string
    parent: number
    count: number
    filter: string
  }
  
  export interface Kategoriya {
    naimenovanie_kategorii: string
    lucide_icon: string
    ssylka_na_kategoriyu: SsylkaNaKategoriyu
    gruppy_filtrov: GruppaFiltrovItem[]
  }
  
  export interface RazdelKataloga {
    kategoriya: Kategoriya
  }
  
  export interface HeaderACF {
    razdely_kataloga: RazdelKataloga[]
  }
  
  export interface HeaderPageData {
    id: number
    acf: HeaderACF
  }
  
  // Типы для атрибутов (фильтров каталога)
  export interface ProductAttribute {
    id: number
    name: string
    slug: string
    type: string
    order_by: string
    has_archives: boolean
  }
  
  export interface AttributeTerm {
    id: number
    name: string
    slug: string
    description: string
    menu_order: number
    count: number
  }
  
  // Типы для товара
  export interface ProductImage {
    id: number
    src: string
    name: string
    alt: string
    thumbnail: string
  }
  
  export interface ProductCategory {
    id: number
    name: string
    slug: string
  }
  
  export interface ProductBrand {
    id: number
    name: string
    slug: string
  }
  
  export interface ProductAttributeValue {
    id: number
    name: string
    slug: string
    position: number
    visible: boolean
    variation: boolean
    options: string[]
  }
  
  export interface Product {
    id: number
    name: string
    slug: string
    permalink: string
    type: string
    status: string
    featured: boolean
    description: string
    short_description: string
    sku: string
    price: string
    regular_price: string
    sale_price: string
    on_sale: boolean
    purchasable: boolean
    stock_quantity: number | null
    stock_status: string
    manage_stock: boolean
    images: ProductImage[]
    categories: ProductCategory[]
    brands: ProductBrand[]
    attributes: ProductAttributeValue[]
    average_rating: string
    rating_count: number
    reviews_allowed: boolean
  }
  
  // Пропсы для компонентов
  export interface CatalogDropdownProps {
    razdely_kataloga: RazdelKataloga[]
  }
  
  export interface HeroSectionProps {
    slogan: string
    opisanie: string
    fakty: Fakt[]
    preimushhestva: Preimushhestvo[]
    nazvanie_bloka_s_tovarami: string
    opisanie_bloka_s_tovarami: string
    tovary: TovarItem[]
    ssylka_na_video: string
  }
  