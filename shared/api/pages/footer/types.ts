export interface FooterContactItem {
  zagolovok: string
  ikonka: string | false
  ssylka: string
}

export interface FooterContactsGroup {
  stroka_kontaktov: FooterContactItem[]
}

export interface FooterSocialItem {
  soczset: {
    ikonka: string | false
    ssylka: string
  }
}

export interface FooterLegalBlock {
  yuridicheskij_tekst?: string
}

export interface FooterACF {
  slogan: string
  kopirajt: string
  gruppa_kontakty: FooterContactsGroup
  soczialnye_seti: FooterSocialItem[] | false
  yuridicheskaya_informacziya?: FooterLegalBlock | false
}

export interface FooterPageData {
  id: number
  acf: FooterACF
}
