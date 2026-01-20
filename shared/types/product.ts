export interface ProductDimensions {
  length: string
  width: string
  height: string
}

export interface ProductImage {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
  srcset?: string
  sizes?: string
  thumbnail?: string
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

export interface ProductTag {
  id: number
  name: string
  slug: string
}

export interface ProductAttribute {
  id: number
  name: string
  slug: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface ProductDefaultAttribute {
  id?: number
  name?: string
  option?: string
}

export interface ProductMetaData {
  id: number
  key: string
  value: unknown
}

export interface ProductLinkTargetHints {
  allow: string[]
}

export interface ProductLink {
  href: string
  targetHints?: ProductLinkTargetHints
}

export interface ProductLinks {
  self: ProductLink[]
  collection: ProductLink[]
}

export interface ProductAttributeApi {
  id: number
  name: string
  slug: string
  type: string
  order_by: string
  has_archives: boolean
  _links?: ProductLinks
}

export interface ProductAttributeTermApi {
  id: number
  name: string
  slug: string
  description: string
  menu_order: number
  count: number
  _links?: ProductLinks
}

export interface ProductApi {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from: string | null
  date_on_sale_from_gmt: string | null
  date_on_sale_to: string | null
  date_on_sale_to_gmt: string | null
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: unknown[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean
  weight: string
  dimensions: ProductDimensions
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: ProductCategory[]
  brands: ProductBrand[]
  tags: ProductTag[]
  images: ProductImage[]
  attributes: ProductAttribute[]
  default_attributes: ProductDefaultAttribute[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  price_html: string
  related_ids: number[]
  meta_data: ProductMetaData[]
  stock_status: string
  has_options: boolean
  post_password: string
  global_unique_id: string
  _links: ProductLinks
}
