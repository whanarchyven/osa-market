import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { YoastHeadJson } from '@/shared/seo/yoast'

export interface WordpressSeoPage {
  id: number
  slug: string
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}

export const getPageSeoBySlug = async (
  slug: string
): Promise<WordpressSeoPage | null> => {
  try {
    const result = await axiosInstance.get<WordpressSeoPage[]>(
      API.getPageBySlug(slug)
    )
    return result.data[0] ?? null
  } catch (e) {
    console.error(e, 'ERROR FETCHING PAGE SEO BY SLUG')
    return null
  }
}
