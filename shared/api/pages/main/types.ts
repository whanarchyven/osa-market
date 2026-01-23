import type { ProductApi } from '@/shared/types/product'

export interface Fakt {
    zagolovok: string
    opisanie: string
  }
  
  export interface Preimushhestvo {
    preimushhestvo: string
  }
  
  export interface TovarPost {
    ID: number
    post_author: string
    post_date: string
    post_date_gmt: string
    post_content: string
    post_title: string
    post_excerpt: string
    post_status: string
    comment_status: string
    ping_status: string
    post_password: string
    post_name: string
    to_ping: string
    pinged: string
    post_modified: string
    post_modified_gmt: string
    post_content_filtered: string
    post_parent: number
    guid: string
    menu_order: number
    post_type: string
    post_mime_type: string
    comment_count: string
    filter: string
  }
  
export interface TovarItem {
  tovar: TovarPost
  product?: ProductApi | null
}
  
export interface CategoryIdItem {
  category_id: number[]
}

export interface BlokKategorij {
  zagolovok: string
  categories: CategoryIdItem[]
}

export interface TextWithImage {
  tekst: string
  izobrazhenie: string
}

export interface TextOnly {
  tekst: string
}

export interface TriVerhnieVkladki {
  levaya_gruppa: TextWithImage
  czentralnaya_gruppa: TextWithImage
  pravaya_gruppa: TextWithImage
}

export interface CzentralnyeVkladki {
  verhnyaya_levaya_czentralnaya_vkladka: TextWithImage
  nizhnyaya_levaya_czentralnaya_vkladka: TextWithImage
  verhnyaya_pravaya_czentralnaya_vkladka: TextWithImage
  nizhnyaya_pravaya_czentralnaya_vkladka: TextWithImage
}

export interface DveNizhnieVkladki {
  levaya_vkladka: TextOnly
  pravaya_vkladka: TextOnly
}

export interface BlokOKompanii {
  zagolovok: string
  tri_verhnie_vkladki: TriVerhnieVkladki
  czentralnye_vkladki: CzentralnyeVkladki
  dve_nizhnie_vkladki: DveNizhnieVkladki
}

export interface NoutbukItem {
  noutbuk: number
  product?: ProductApi | null
}

export interface BlokNoutbuki {
  zagolovok: string
  noutbuki: NoutbukItem[]
}

  export interface ZaglavnyjBlok {
    slogan: string
    opisanie: string
    fakty: Fakt[]
    preimushhestva: Preimushhestvo[]
    nazvanie_bloka_s_tovarami: string
    opisanie_bloka_s_tovarami: string
    tovary: TovarItem[]
    ssylka_na_video: string
  }
  
  export interface PageACF {
    zaglavnyj_blok: ZaglavnyjBlok
    blok_kategorij?: BlokKategorij
  blok_o_kompanii?: BlokOKompanii
  blok_noutbuki?: BlokNoutbuki
  }
  
  export interface PageData {
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
    acf: PageACF
  }
  
  // Типы для каталога (Header)
  export interface VariantFiltra {
    zagolovok: string
    znachenie: string
  }
  
  export interface VariantFiltraItem {
    variant_filtra: VariantFiltra
  }
  
  export interface GruppaFiltrov {
    zagolovok_filtra: string
    slug_taksonomii: string
    varianty_filtra: VariantFiltraItem[]
  }
  
  export interface GruppaFiltrovItem {
    gruppa_filtrov: GruppaFiltrov
  }
  
  export interface SsylkaNaKategoriyu {
    term_id: number
    name: string
    slug: string
    term_group: number
    term_taxonomy_id: number
    taxonomy: string
    description: string
    parent: number
    count: number
    filter: string
  }
  
  export interface Kategoriya {
    naimenovanie_kategorii: string
    ikonka_kategorii: string
    ssylka_na_kategoriyu: SsylkaNaKategoriyu
    gruppy_filtrov: GruppaFiltrovItem[]
  }
  
  export interface RazdelKataloga {
    kategoriya: Kategoriya
  }
  
  export interface HeaderACF {
    razdely_kataloga: RazdelKataloga[]
  }
  
  export interface HeaderPageData {
    id: number
    acf: HeaderACF
  }
  
  // Пропсы для компонентов
  export interface CatalogDropdownProps {
    razdely_kataloga: RazdelKataloga[]
  }
  
  export interface HeroSectionProps {
    slogan: string
    opisanie: string
    fakty: Fakt[]
    preimushhestva: Preimushhestvo[]
    nazvanie_bloka_s_tovarami: string
    opisanie_bloka_s_tovarami: string
    tovary: TovarItem[]
    ssylka_na_video: string
  }

export interface LogoShowcaseProps {
  blok?: BlokOKompanii
}
  