import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi } from '@/shared/types/product'

export const getProductById = async (id: number): Promise<ProductApi> => {
  try {
    const result = await axiosInstance.get<ProductApi>(API.getProductById(id))
    console.log(result.data, 'PRODUCT BY ID DATA')
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING PRODUCT BY ID')
    throw e
  }
}

