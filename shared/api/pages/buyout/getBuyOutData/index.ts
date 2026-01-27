import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { BuyoutPageData } from '@/shared/api/pages/buyout/types'

export const getBuyoutData = async (): Promise<BuyoutPageData[]> => {
  try {
    const result = await axiosInstance.get<BuyoutPageData[]>(
      API.getBuyoutPage
    )
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING BUYOUT PAGE')
    throw e
  }
}
