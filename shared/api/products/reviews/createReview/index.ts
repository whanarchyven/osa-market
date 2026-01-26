import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductReview, ProductReviewCreate } from '@/shared/types/product'

export const createReview = async (
  review: ProductReviewCreate
): Promise<ProductReview> => {
  const result = await axiosInstance.post<ProductReview>(
    API.createReview,
    review
  )
  return result.data
}
