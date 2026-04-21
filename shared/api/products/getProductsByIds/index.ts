import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi } from '@/shared/types/product'

export const getProductsByIds = async (ids: number[]): Promise<ProductApi[]> => {
  const normalizedIds = [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))]

  if (!normalizedIds.length) {
    return []
  }

  try {
    const result = await axiosInstance.get<ProductApi[]>(
      API.getProductsList({
        include: normalizedIds.join(','),
        per_page: normalizedIds.length,
        status: 'publish',
        orderby: 'include',
      })
    )

    return result.data
  } catch (e: unknown) {
    console.log(e, 'ERROR FETCHING PRODUCTS BY IDS')
    throw e
  }
}
