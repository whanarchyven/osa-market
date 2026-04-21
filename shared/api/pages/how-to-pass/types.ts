import type { YoastHeadJson } from '@/shared/seo/yoast'

export interface HowToPassPageACF {
  zagolovok: string
  content: string
}

export interface HowToPassPageData {
  id: number
  slug: string
  title: {
    rendered: string
  }
  acf: HowToPassPageACF
  _links?: Record<string, unknown>
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}
