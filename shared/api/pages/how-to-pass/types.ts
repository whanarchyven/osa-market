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
}
