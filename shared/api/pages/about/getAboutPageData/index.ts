import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { AboutPageData } from '@/shared/api/pages/about/types'

export const getAboutPageData = async (): Promise<AboutPageData[]> => {
  try {
    const result = await axiosInstance.get<AboutPageData[]>(
      API.getAboutPage
    )
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING ABOUT PAGE')
    throw e
  }
}
