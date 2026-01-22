import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'

export const getCategory = async (id: number): Promise<ProductCategoryTaxonomy> => {
  try {
    const result = await axiosInstance.get<ProductCategoryTaxonomy>(
      API.getCategoryById(id)
    )
    console.log(result.data, 'CATEGORY DATA')
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATEGORY')
    throw e
  }
}

