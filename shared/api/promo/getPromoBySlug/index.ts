import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { PromoItem } from '@/shared/api/promo/types'

export const getPromoBySlug = async (
  slug: string
): Promise<PromoItem | null> => {
  try {
    const result = await axiosInstance.get<PromoItem[]>(
      API.getPromoBySlug(slug)
    )
    return result.data[0] ?? null
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING PROMO BY SLUG')
    throw e
  }
}
