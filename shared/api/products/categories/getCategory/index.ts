import { cache } from 'react'

import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'

export const getCategory = cache(async (id: number): Promise<ProductCategoryTaxonomy> => {
  try {
    const result = await axiosInstance.get<ProductCategoryTaxonomy>(
      API.getCategoryById(id)
    )
    return result.data
  } catch (e: unknown) {
    console.log(e, 'ERROR FETCHING CATEGORY')
    throw e
  }
})
