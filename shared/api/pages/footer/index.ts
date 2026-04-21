import { unstable_cache } from 'next/cache'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { FooterPageData } from './types'

export const getFooterData = unstable_cache(
  async (): Promise<FooterPageData[]> => {
    try {
      const result = await axiosInstance.get<FooterPageData[]>(API.getFooterPage)
      console.log(result.data, 'FOOTER PAGE DATA')
      return result.data
    } catch (e: any) {
      console.log(e, 'ERROR FETCHING FOOTER PAGE')
      throw e
    }
  },
  ['wp-footer-page'],
  /** См. комментарий у getHeaderData — общий горизонт с «медленными» страницами. */
  { revalidate: 86400 },
)
