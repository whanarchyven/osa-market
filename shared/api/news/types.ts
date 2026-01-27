export interface NewsACF {
  zagolovok: string
  oblozhka: string
  miniatyura: string
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
}
