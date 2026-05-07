import type { YoastHeadJson } from '@/shared/seo/yoast'

/** Элемент блока контактов (поле ссылки может быть с опечаткой `sylka` в CMS) */
export interface HowToPassContactLink {
  ikonka: string
  tekst: string
  sylka?: string
  ssylka?: string
}

export interface HowToPassBlokKontakty {
  zagolovok?: string
  ssylki_i_kontakty?: HowToPassContactLink[] | false
}

export interface HowToPassPageACF {
  blok_kontakty?: HowToPassBlokKontakty | false | null
  zagolovok?: string
  content?: string
}

export interface HowToPassPageData {
  id: number
  slug: string
  title: {
    rendered: string
  }
  acf?: HowToPassPageACF
  _links?: Record<string, unknown>
  yoast_head?: string
  yoast_head_json?: YoastHeadJson
}
