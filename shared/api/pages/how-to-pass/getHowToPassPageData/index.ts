import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { HowToPassPageData } from '@/shared/api/pages/how-to-pass/types'

export const getHowToPassPageData = async (): Promise<HowToPassPageData[]> => {
  try {
    const result = await axiosInstance.get<HowToPassPageData[]>(
      API.getHowToPassPage
    )
    return result.data
  } catch (e: unknown) {
    console.error(e, 'ERROR FETCHING HOW TO PASS PAGE')
    throw e
  }
}
