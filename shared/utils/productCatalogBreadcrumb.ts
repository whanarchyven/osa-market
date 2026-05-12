import type { ProductCategoryTaxonomy } from '@/shared/types/category'
import type { ProductCategory } from '@/shared/types/product'
import {
  getCatalogCategoryById,
  getCatalogCategoryBySlug,
} from '@/shared/api/pages/catalog'

/**
 * Цепочка от корня (`parent === 0`) до термина. Нужна для хлебных кроек:
 * первый элемент — родительская витрина, последний — лист (как назначено на товаре).
 */
async function ancestryRootToLeaf(
  term: ProductCategoryTaxonomy
): Promise<ProductCategoryTaxonomy[]> {
  const ascending: ProductCategoryTaxonomy[] = []
  let current: ProductCategoryTaxonomy | null = term
  const seen = new Set<number>()
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    ascending.push(current)
    if (!current.parent || current.parent === 0) break
    const parent = await getCatalogCategoryById(current.parent)
    current = parent
  }
  return ascending.reverse()
}

/**
 * По категориям товара из WC строит самую «глубокую» ветку (максимум уровней предков).
 * Так в крошках будет и родитель, и субкатегория, по порядку.
 */
export async function getProductCatalogBreadcrumbCategories(
  categories: ProductCategory[] | undefined
): Promise<ProductCategoryTaxonomy[]> {
  if (!categories?.length) return []

  const bySlug = new Map<string, ProductCategory>()
  for (const cat of categories) {
    const slug = cat?.slug?.trim()
    if (slug && !bySlug.has(slug)) bySlug.set(slug, cat)
  }

  const taxonomyNodes = (
    await Promise.all(
      [...bySlug.keys()].map((slug) => getCatalogCategoryBySlug(slug))
    )
  ).filter((t): t is ProductCategoryTaxonomy => Boolean(t))

  if (!taxonomyNodes.length) return []

  let best: ProductCategoryTaxonomy[] = []
  for (const node of taxonomyNodes) {
    const chain = await ancestryRootToLeaf(node)
    if (chain.length > best.length) best = chain
  }
  return best
}
