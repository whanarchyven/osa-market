import { cache } from 'react'

import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'

/** Прямые дочерние термины product_cat (субкатегории витрины). */
export const getCategoriesByParent = cache(
  async (parentId: number): Promise<ProductCategoryTaxonomy[]> => {
    if (!parentId) return []
    try {
      const result = await axiosInstance.get<ProductCategoryTaxonomy[]>(
        API.getCategoriesByParent(parentId)
      )
      return Array.isArray(result.data) ? result.data : []
    } catch {
      return []
    }
  }
)
