import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductReview } from '@/shared/types/product'

export const getReviews = async (): Promise<ProductReview[]> => {
  const result = await axiosInstance.get<ProductReview[]>(API.getReviews)
  return result.data
}

