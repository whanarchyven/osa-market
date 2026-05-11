import type { YoastHeadJson } from '@/shared/seo/yoast'

export interface PcAssemblyWpHarakteristika {
  ikonka: string
  zagolovok: string
  opisanie: string
}

/** В WP/ACF картинка может прийти как URL строкой или как объект медиавложения `{ url }` */
export type PcAssemblyWpBuyerPhoto =
  | string
  | { url?: string }
  | undefined
  | null
  | false

export interface PcAssemblyWpOtzyv {
  foto_pokupatelya?: PcAssemblyWpBuyerPhoto
  imya_pokupatelya?: string
  tekst_otzyva?: string
  video_otzyva?: string
}

export interface PcAssemblyWpPrimerSborki {
  nazvanie_sborki: string
  gallereya_sborki: string[] | false
  opisanie_kratko?: string
  harakteristiki: PcAssemblyWpHarakteristika[] | false
  polnoe_opisanie?: string
  otzyv_pokupatelya?: PcAssemblyWpOtzyv | false
}

export interface PcAssemblyWpAcf {
  zaglavnyj_blok?: {
    zagolovok?: string
    podzagolovok?: string
    opisanie?: string
    fonovoe_video?: string
    tekst_pervoj_knopki?: string
    tekst_vtoroj_knopki?: string
  }
  blok_primery_sborok?: {
    zagolovok?: string
    opisanie?: string
    primery_sborok?: PcAssemblyWpPrimerSborki[] | false
  }
  blok_preimushhestva?: {
    zagolovok?: string
    opisanie?: string
    preimushhestva?: {
      ikonka: string
      zagolovok: string
      opisanie: string
    }[]
  }
}

export interface PcAssemblyWpPage {
  id: number
  slug: string
  title: { rendered: string }
  acf?: PcAssemblyWpAcf
  yoast_head_json?: YoastHeadJson
}
