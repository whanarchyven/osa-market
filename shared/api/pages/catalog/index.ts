import { cache } from 'react'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import {
  getProductAttributes,
  getProductAttributeTerms,
} from '@/shared/api/products/attributes'
import type { YoastHeadJson } from '@/shared/seo/yoast'
import type { CategoryAttributeSlug } from '@/shared/types/category'
import type { ProductAttributeApi, ProductCategoryTaxonomy } from '@/shared/types/api'
import type { ProductApi, ProductListItem } from '@/shared/types/product'

export interface CatalogData {
  categoryName: string
  categoryDescription: string
  products: ProductListItem[]
  totalCount: number
  attributes: ProductAttributeApi[]
  totalPages: number
  currentPage: number
  yoastHeadJson?: YoastHeadJson | null
}

const API_PAGE_SIZE = 100
const UI_PAGE_SIZE = 12
const PRODUCT_LIST_FIELDS = [
  'id',
  'name',
  'slug',
  'short_description',
  'price',
  'regular_price',
  'sale_price',
  'on_sale',
  'average_rating',
  'rating_count',
  'stock_status',
  'categories',
  'brands',
  'images',
  'attributes',
  'date_created',
].join(',')

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest'
type CatalogSearchParams = Record<string, string | string[] | undefined>
type CatalogProduct = ProductListItem & Pick<ProductApi, 'date_created'>

const mapProductToListItem = (product: CatalogProduct): ProductListItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  short_description: product.short_description,
  price: product.price,
  regular_price: product.regular_price,
  sale_price: product.sale_price,
  on_sale: product.on_sale,
  average_rating: product.average_rating,
  rating_count: product.rating_count,
  stock_status: product.stock_status,
  categories: product.categories,
  brands: product.brands,
  images: product.images.slice(0, 1).map((image) => ({
    src: image.src,
    alt: image.alt,
  })),
  attributes: product.attributes.slice(0, 6),
})

const getSortKey = (searchParams: CatalogSearchParams): SortOption | undefined => {
  const sortParam = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort

  switch (sortParam) {
    case 'price_asc':
    case 'price_desc':
    case 'rating':
    case 'newest':
      return sortParam
    default:
      return undefined
  }
}

const getRequestedPage = (searchParams: CatalogSearchParams) => {
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page

  return Math.max(1, Number(pageParam) || 1)
}

const getDirectSortParams = (sortKey?: SortOption) => {
  switch (sortKey) {
    case 'price_asc':
      return { orderby: 'price', order: 'asc' }
    case 'price_desc':
      return { orderby: 'price', order: 'desc' }
    case 'rating':
      return { orderby: 'rating', order: 'desc' }
    case 'newest':
      return { orderby: 'date', order: 'desc' }
    default:
      return {}
  }
}

export const getCatalogCategoryBySlug = cache(
  async (categorySlug: string): Promise<ProductCategoryTaxonomy | null> => {
    const result = await axiosInstance.get<ProductCategoryTaxonomy[]>(
      API.getCategoryBySlug(categorySlug)
    )

    return result.data[0] ?? null
  }
)

function normalizeDostupnyeAttributy(raw: unknown): CategoryAttributeSlug[] {
  if (raw == null || raw === false) return []
  if (Array.isArray(raw))
    return raw.filter((row): row is CategoryAttributeSlug => Boolean(row) && typeof row === 'object')
  if (typeof raw === 'object' && raw !== null && 'slug_attributa' in raw) {
    return [raw as CategoryAttributeSlug]
  }
  return []
}

const fetchAllProducts = async (categoryId?: number): Promise<CatalogProduct[]> => {
  const items: CatalogProduct[] = []
  let page = 1

  while (page < 100) {
    const result = await axiosInstance.get<CatalogProduct[]>(
      API.getProductsList({
        page,
        per_page: API_PAGE_SIZE,
        category: categoryId,
        status: 'publish',
        _fields: PRODUCT_LIST_FIELDS,
      })
    )
    const data = result.data ?? []
    items.push(...data)
    if (data.length < API_PAGE_SIZE) {
      break
    }
    page += 1
  }

  return items
}

const fetchCategoryProductsPage = async (
  categoryId: number,
  searchParams: CatalogSearchParams
) => {
  const requestedPage = getRequestedPage(searchParams)
  const sortKey = getSortKey(searchParams)
  const result = await axiosInstance.get<CatalogProduct[]>(
    API.getProductsList({
      category: categoryId,
      page: requestedPage,
      per_page: UI_PAGE_SIZE,
      status: 'publish',
      _fields: PRODUCT_LIST_FIELDS,
      ...getDirectSortParams(sortKey),
    })
  )

  const totalCount = Number(result.headers['x-wp-total'] ?? result.data.length)
  const totalPages = Math.max(
    1,
    Number(result.headers['x-wp-totalpages'] ?? Math.ceil(totalCount / UI_PAGE_SIZE) ?? 1)
  )

  return {
    products: result.data.map(mapProductToListItem),
    totalCount,
    totalPages,
    currentPage: Math.min(requestedPage, totalPages),
  }
}

export const getCatalogData = async (
  categorySlug: string,
  searchParams: CatalogSearchParams
): Promise<CatalogData> => {
  try {
    const [attributes, category] = await Promise.all([
      getProductAttributes(),
      getCatalogCategoryBySlug(categorySlug),
    ])
    const categoryName = category?.name ?? categorySlug
    const attrRows = normalizeDostupnyeAttributy(category?.acf?.dostupnye_attributy)
    const availableSlugs = attrRows.map((item) => item.slug_attributa)
    const normalizedSlugs = new Set(
      availableSlugs
        .filter(Boolean)
        .map((slug) => {
          if (slug === 'brand' || slug === 'pa_brand') return 'brand'
          return slug.startsWith('pa_') ? slug : `pa_${slug}`
        })
    )
    const filteredAttributes = normalizedSlugs.size
      ? attributes.filter((attribute) => normalizedSlugs.has(attribute.slug))
      : attributes

    const shouldShowBrand = normalizedSlugs.has('brand')
    const attributesWithBrand = shouldShowBrand
      ? [
          {
            id: 0,
            name: 'Бренд',
            slug: 'brand',
            type: 'select',
            order_by: 'menu_order',
            has_archives: false,
          },
          ...filteredAttributes,
        ]
      : filteredAttributes

    const activeFilters = Object.entries(searchParams).reduce<
      Record<string, string[]>
    >((acc, [key, value]) => {
      if (!value || key === 'page' || key === 'sort') return acc
      const values = Array.isArray(value) ? value : value.split(',')
      acc[key] = values.filter(Boolean)
      return acc
    }, {})

    if (Object.keys(activeFilters).length === 0 && category?.id) {
      const pagedProducts = await fetchCategoryProductsPage(category.id, searchParams)

      return {
        categoryName,
        categoryDescription: category.description ?? '',
        products: pagedProducts.products,
        totalCount: pagedProducts.totalCount,
        totalPages: pagedProducts.totalPages,
        currentPage: pagedProducts.currentPage,
        attributes: attributesWithBrand,
        yoastHeadJson: category?.yoast_head_json ?? null,
      }
    }

    const products = await fetchAllProducts(category?.id)
    const productsByCategory = category?.id
      ? products
      : products.filter((product) =>
          product.categories?.some((item) => item.slug === categorySlug)
        )

    const attributeBySlug = new Map(
      attributesWithBrand.map((attribute) => [attribute.slug, attribute])
    )

    const filterEntries = Object.entries(activeFilters)
    let filteredProducts = productsByCategory

    if (filterEntries.length > 0) {
      const termNameMap = new Map<string, string[]>()

      await Promise.all(
        filterEntries.map(async ([slug, termSlugs]) => {
          const attribute = attributeBySlug.get(slug)
          if (!attribute) return
          if (slug === 'brand') {
            termNameMap.set(slug, termSlugs)
            return
          }
          const terms = await getProductAttributeTerms(attribute.id)
          const slugToName = new Map(terms.map((term) => [term.slug, term.name]))
          const names = termSlugs
            .map((termSlug) => slugToName.get(termSlug))
            .filter((name): name is string => Boolean(name))
          termNameMap.set(slug, names)
        })
      )

      filteredProducts = filteredProducts.filter((product) => {
        return filterEntries.every(([slug]) => {
          if (slug === 'brand') {
            const selectedBrands = termNameMap.get(slug) ?? []
            if (selectedBrands.length === 0) return false
            return product.brands?.some((brand) =>
              selectedBrands.includes(brand.slug)
            )
          }
          const attribute = product.attributes.find((item) => item.slug === slug)
          if (!attribute) return false
          const selectedNames = termNameMap.get(slug) ?? []
          if (selectedNames.length === 0) return false
          return attribute.options.some((option) => selectedNames.includes(option))
        })
      })
    }

    const sortKey = Array.isArray(searchParams.sort)
      ? searchParams.sort[0]
      : searchParams.sort

    if (sortKey) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const getPrice = (product: CatalogProduct) =>
          Number(product.sale_price || product.price || 0)
        switch (sortKey) {
          case 'price_asc':
            return getPrice(a) - getPrice(b)
          case 'price_desc':
            return getPrice(b) - getPrice(a)
          case 'rating':
            return Number(b.average_rating || 0) - Number(a.average_rating || 0)
          case 'newest':
            return (
              new Date(b.date_created).getTime() -
              new Date(a.date_created).getTime()
            )
          default:
            return 0
        }
      })
    }

    const pageParam = Array.isArray(searchParams.page)
      ? searchParams.page[0]
      : searchParams.page
    const requestedPage = Math.max(1, Number(pageParam) || 1)
    const totalCount = filteredProducts.length
    const totalPages = Math.max(1, Math.ceil(totalCount / UI_PAGE_SIZE))
    const page = Math.min(requestedPage, totalPages)
    const start = (page - 1) * UI_PAGE_SIZE
    const end = start + UI_PAGE_SIZE
    const pageProducts = filteredProducts.slice(start, end).map(mapProductToListItem)

    return {
      categoryName,
      categoryDescription: category?.description ?? '',
      products: pageProducts,
      totalCount,
      totalPages,
      currentPage: page,
      attributes: attributesWithBrand,
      yoastHeadJson: category?.yoast_head_json ?? null,
    }
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATALOG DATA')
    throw e
  }
}

