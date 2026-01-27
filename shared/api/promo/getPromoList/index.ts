import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { PromoItem } from '@/shared/api/promo/types'

export interface PromoListResult {
  items: PromoItem[]
  total: number
  totalPages: number
}

export const getPromoList = async (
  page = 1,
  perPage = 9,
  search?: string
): Promise<PromoListResult> => {
  try {
    const result = await axiosInstance.get<PromoItem[]>(
      API.getPromoList(page, perPage, search)
    )
    const total = Number(result.headers['x-wp-total'] || 0)
    const totalPages = Number(result.headers['x-wp-totalpages'] || 1)
    return { items: result.data, total, totalPages }
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING PROMO LIST')
    throw e
  }
}
