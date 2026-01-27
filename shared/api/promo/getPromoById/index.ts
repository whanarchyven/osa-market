import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { PromoItem } from '@/shared/api/promo/types'

export const getPromoById = async (id: number): Promise<PromoItem> => {
  try {
    const result = await axiosInstance.get<PromoItem>(API.getPromoById(id))
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING PROMO BY ID')
    throw e
  }
}
