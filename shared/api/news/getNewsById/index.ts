import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { NewsItem } from '@/shared/api/news/types'

export const getNewsById = async (id: number): Promise<NewsItem> => {
  try {
    const result = await axiosInstance.get<NewsItem>(API.getNewsById(id))
    return result.data
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING NEWS BY ID')
    throw e
  }
}
