import type { Product as StoreProduct } from '@/shared/store'
import type { ProductApi, ProductListItem } from '@/shared/types/product'

export const mapApiProductToStoreProduct = (
  product: ProductApi | ProductListItem
): StoreProduct => {
  const price = Number(product.sale_price || product.price || 0)
  const oldPrice = product.on_sale && product.regular_price
    ? Number(product.regular_price)
    : undefined

  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    price: Number.isFinite(price) ? price : 0,
    oldPrice: Number.isFinite(oldPrice) ? oldPrice : undefined,
    image: product.images?.[0]?.src || '',
    imageAlt: product.images?.[0]?.alt || product.name,
    category: product.categories?.[0]?.name || '',
    subcategory: '',
    brand: product.brands?.[0]?.name,
    rating: product.average_rating ? Number(product.average_rating) : undefined,
    reviews: product.rating_count ?? undefined,
    inStock: product.stock_status === 'instock',
    excerpt: product.short_description || '',
  }
}

