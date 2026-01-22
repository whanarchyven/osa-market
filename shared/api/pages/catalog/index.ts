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
}

export const getCatalogData = async (
  categorySlug: string,
  searchParams: Record<string, string | string[] | undefined>
): Promise<CatalogData> => {
  try {
    const [productsResult, attributes, categoryResult] = await Promise.all([
      axiosInstance.get<ProductApi[]>(API.getProducts),
      getProductAttributes(),
      axiosInstance.get<ProductCategoryTaxonomy[]>(
        API.getCategoryBySlug(categorySlug)
      ),
    ])
    const products = productsResult.data.filter((product) =>
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
    let filteredProducts = products

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

    return {
      categoryName,
      products: filteredProducts,
      totalCount: filteredProducts.length,
      attributes: attributesWithBrand,
    }
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATALOG DATA')
    throw e
  }
}

