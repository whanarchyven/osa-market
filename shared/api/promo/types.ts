import type { YoastHeadJson } from '@/shared/seo/yoast'
import type { BackendMedia } from '@/shared/types/media'

export interface PromoRelatedProduct {
  tovar: number
}

export interface PromoACF {
  zagolovok: string
  opisanie: string
  srok_dejstviya_do: string
  usloviya_polucheniya: string
  skidka: string
  oblozhka: BackendMedia
  miniatyura: BackendMedia
  /** ACF может отдать false, один объект или массив. */
  svyazannye_tovary?: PromoRelatedProduct[] | PromoRelatedProduct | false | null
}

export interface PromoItem {
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
  acf: PromoACF
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}
