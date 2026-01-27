import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { NewsItem } from '@/shared/api/news/types'

export interface NewsListResult {
  items: NewsItem[]
  total: number
  totalPages: number
}

export const getNewsList = async (
  page = 1,
  perPage = 9,
  search?: string
): Promise<NewsListResult> => {
  try {
    const result = await axiosInstance.get<NewsItem[]>(
      API.getNewsList(page, perPage, search)
    )
    const total = Number(result.headers['x-wp-total'] || 0)
    const totalPages = Number(result.headers['x-wp-totalpages'] || 1)
    return { items: result.data, total, totalPages }
  } catch (e: any) {
    console.log(e, 'ERROR FETCHING NEWS LIST')
    throw e
  }
}
