import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductApi, ProductReview, ProductReviewWithProduct } from '@/shared/types/product'

export const getReviews = async (): Promise<ProductReviewWithProduct[]> => {
  const result = await axiosInstance.get<ProductReview[]>(API.getReviews)
  const reviewsWithProducts: ProductReviewWithProduct[] = await Promise.all(
    result.data.map(async (review) => {
      try {
        const productResult = await axiosInstance.get<ProductApi>(
          API.getProductById(review.product_id)
        )
        return { ...review, product: productResult.data }
      } catch (e: any) {
        console.log(e, 'ERROR FETCHING REVIEW PRODUCT BY ID')
        return { ...review, product: null }
      }
    })
  )
  return reviewsWithProducts
}

