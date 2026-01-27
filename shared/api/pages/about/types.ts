export interface AboutHeroBlock {
  zagolovok: string
  podzagolovok: string
  ssylka_na_video: string
}

export interface AboutHistoryAccent {
  zagolovok: string
  podzagolovok: string
}

export interface AboutHistoryBlock {
  zagolovok: string
  kontent: string
  akczentirovannyj_blok: AboutHistoryAccent
  gallereya: string[]
}

export interface AboutNumberTile {
  plashka: {
    zagolovok: string
    podzagolovok: string
  }
}

export interface AboutNumbersBlock {
  zagolovok: string
  plashki_czifr: AboutNumberTile[]
}

export interface AboutTeamMember {
  chlen_komandy: {
    imya: string
    dolzhnost: string
    tekst: string
    izobrazhenie: string
  }
}

export interface AboutTeamBlock {
  zagolovok: string
  podzagolovok: string
  komanda: AboutTeamMember[]
}

export interface AboutValueItem {
  czennost: {
    zagolovok: string
    tekst: string
  }
}

export interface AboutValuesBlock {
  zagolovok: string
  czennosti: AboutValueItem[]
}

export interface AboutCtaBlock {
  zagolovok: string
  tekst: string
}

export interface AboutPageACF {
  zaglavnyj_blok: AboutHeroBlock
  blok_s_istoriej: AboutHistoryBlock
  blok_czifry: AboutNumbersBlock
  blok_s_komandoj: AboutTeamBlock
  blok_czennosti: AboutValuesBlock
  klikbejt_blok: AboutCtaBlock
}

export interface AboutPageData {
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
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: string
  ping_status: string
  template: string
  meta: {
    _acf_changed: boolean
    footnotes: string
  }
  class_list: string[]
  acf: AboutPageACF
}
