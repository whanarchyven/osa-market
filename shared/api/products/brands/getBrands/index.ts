import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductBrandApi } from '@/shared/types/api'

export const getBrands = async (): Promise<ProductBrandApi[]> => {
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/brands')
      if (!response.ok) {
        throw new Error(`Failed to load brands: ${response.status}`)
      }
      return (await response.json()) as ProductBrandApi[]
    }

    const result = await axiosInstance.get<ProductBrandApi[]>(API.getProductBrands)
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING BRANDS')
    throw e
  }
}
