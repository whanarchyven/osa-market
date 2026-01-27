import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { NewsItem } from '@/shared/api/news/types'

export const getNewsBySlug = async (
  slug: string
): Promise<NewsItem | null> => {
  try {
    const result = await axiosInstance.get<NewsItem[]>(
      API.getNewsBySlug(slug)
    )
    return result.data[0] ?? null
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING NEWS BY SLUG')
    throw e
  }
}
