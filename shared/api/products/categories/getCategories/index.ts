import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi } from '@/shared/types/product'

export const getCategories = async (): Promise<ProductApi> => {
  try {
    const result = await axiosInstance.get<ProductApi>(API.getCategories)
    console.log(result.data, 'CATEGORIES DATA')
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING CATEGORIES')
    throw e
  }
}
