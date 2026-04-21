import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi } from '@/shared/types/product'

export const getProductBySlug = async (slug: string): Promise<ProductApi | null> => {
  try {
    const result = await axiosInstance.get<ProductApi[]>(API.getProductBySlug(slug))
    return result.data[0] ?? null
  } catch (e: unknown) {
    console.log(e, 'ERROR FETCHING PRODUCT BY SLUG')
    throw e
  }
}
