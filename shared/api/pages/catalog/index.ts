import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import {
  getProductAttributes,
  getProductAttributeTerms,
} from '@/shared/api/products/attributes'
import type { ProductApi } from '@/shared/types/product'
import type { ProductAttributeApi, ProductCategoryTaxonomy } from '@/shared/types/api'

export interface CatalogData {
  categoryName: string
  products: ProductApi[]
  totalCount: number
  attributes: ProductAttributeApi[]
  totalPages: number
  currentPage: number
}

const API_PAGE_SIZE = 100
const UI_PAGE_SIZE = 12

const fetchAllProducts = async (): Promise<ProductApi[]> => {
  const items: ProductApi[] = []
  let page = 1

  while (page < 100) {
    const result = await axiosInstance.get<ProductApi[]>(
      `${API.getProducts}&page=${page}`
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

export const getCatalogData = async (
  categorySlug: string,
  searchParams: Record<string, string | string[] | undefined>
): Promise<CatalogData> => {
  try {
    const [products, attributes, categoryResult] = await Promise.all([
      fetchAllProducts(),
      getProductAttributes(),
      axiosInstance.get<ProductCategoryTaxonomy[]>(
        API.getCategoryBySlug(categorySlug)
      ),
    ])
    const productsByCategory = products.filter((product) =>
      product.categories?.some((category) => category.slug === categorySlug)
    )
    const category = categoryResult.data[0]
    const categoryName = category?.name ?? categorySlug
    const availableSlugs =
      category?.acf?.dostupnye_attributy?.map((item) => item.slug_attributa) ?? []
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
        const getPrice = (product: ProductApi) =>
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
    const pageProducts = filteredProducts.slice(start, end)

    return {
      categoryName,
      products: pageProducts,
      totalCount,
      totalPages,
      currentPage: page,
      attributes: attributesWithBrand,
    }
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATALOG DATA')
    throw e
  }
}

