import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductReview } from '@/shared/types/product'

export const getProductReviews = async (
  id: number
): Promise<ProductReview[]> => {
  const result = await axiosInstance.get<ProductReview[]>(
    API.getProductReviews(id)
  )
  return result.data
}

