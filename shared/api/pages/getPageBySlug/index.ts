import { cache } from 'react'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { YoastHeadJson } from '@/shared/seo/yoast'

export interface WordpressPageBySlug {
  id: number
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  acf?: {
    text?: string
  }
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}

export const getPageBySlug = cache(
  async (slug: string): Promise<WordpressPageBySlug | null> => {
    try {
      const result = await axiosInstance.get<WordpressPageBySlug[]>(
        API.getPageBySlug(slug)
      )
      return result.data[0] ?? null
    } catch (e) {
      console.error(e, 'ERROR FETCHING PAGE BY SLUG')
      return null
    }
  }
)
