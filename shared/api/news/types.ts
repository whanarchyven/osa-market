import type { YoastHeadJson } from '@/shared/seo/yoast'
import type { BackendMedia } from '@/shared/types/media'

export interface NewsACF {
  zagolovok: string
  oblozhka: BackendMedia
  miniatyura: BackendMedia
  kontent: string
  avtor: string
}

export interface NewsItem {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt?: {
    rendered: string
    protected: boolean
  }
  featured_media: number
  template: string
  meta: {
    _acf_changed: boolean
  }
  class_list: string[]
  acf: NewsACF
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}
