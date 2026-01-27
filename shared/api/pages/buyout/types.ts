export interface BuyoutAdvantageItem {
  preimushhestvo: {
    tekst_preimushhestva: string
  }
}

export interface BuyoutHeroBlock {
  zagolovok: string
  podzagolovok: string
  kartochki_preimushhestv: BuyoutAdvantageItem[]
  polnoekrannoe_izobrazhenie: string
}

export interface BuyoutCard {
  zagolovok: string
  podzagolovok: string
  izobrazhenie: string
}

export interface BuyoutWhatWeBuyBlock {
  zagolovok: string
  kartochki: BuyoutCard[]
}

export type WhatWebuyBlock = BuyoutWhatWeBuyBlock

export interface BuyoutStep {
  zagolovok: string
  podzagolovok: string
  izobrazhenie: string
}

export interface BuyoutStepsBlock {
  zagolovok: string
  podzagolovk: string
  shag_vykupa: BuyoutStep[]
}

export interface BuyoutTradeInBlock {
  zagolovok: string
  podzagolovok: string
  polnoekrannoe_izobrazhenie: string
}

export type TradeInBlock = BuyoutTradeInBlock

export interface BuyoutFormContacts {
  nomer_telefona: string
  pochta: string
}

export interface BuyoutPageACF {
  zaglavnyj_blok_vykupa: BuyoutHeroBlock
  blok_chto_vykupaem: BuyoutWhatWeBuyBlock
  blok_shagi_vykupa: BuyoutStepsBlock
  'blok_trade-in': BuyoutTradeInBlock
  kontaktnye_dannye_v_forme: BuyoutFormContacts
}

export interface BuyoutPageData {
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
  acf: BuyoutPageACF
}
