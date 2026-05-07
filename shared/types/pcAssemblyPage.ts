export type PcAssemblyIconKey =
  | 'cpu'
  | 'circuit'
  | 'gauge'
  | 'shield'
  | 'snowflake'
  | 'wand'

export interface PcAssemblyBuildAdvantage {
  iconKey: PcAssemblyIconKey
  /** Картинка из CMS (приоритет над iconKey) */
  iconSrc?: string
  title: string
  description: string
}

export interface PcAssemblyBuildReview {
  firstName: string
  lastName: string
  photoSrc: string
  text?: string
  videoEmbedSrc?: string
  /** Прямой MP4 с CDN / WP */
  videoFileSrc?: string
}

export interface PcAssemblyBuild {
  id: string
  title: string
  cardImageSrc: string
  gallerySrcs: string[]
  advantages: PcAssemblyBuildAdvantage[]
  /** Краткое описание в модалке (под заголовком) */
  modalIntro?: string
  description: string
  review: PcAssemblyBuildReview
}

export interface PcAssemblyBenefitSlide {
  id: string
  iconKey: PcAssemblyIconKey
  iconSrc?: string
  title: string
  description: string
}
