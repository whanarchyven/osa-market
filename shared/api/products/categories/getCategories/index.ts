import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'

export const getCategories = async (): Promise<ProductCategoryTaxonomy[]> => {
  try {
    const result = await axiosInstance.get<ProductCategoryTaxonomy[]>(API.getCategories)
    console.log(result.data, 'CATEGORIES DATA')
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATEGORIES')
    throw e
  }
}
