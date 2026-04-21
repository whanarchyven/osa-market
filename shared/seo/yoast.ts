import type { Metadata } from 'next'

/** Подмножество полей `yoast_head_json` из REST API Yoast SEO (версии могут отличаться). */
export interface YoastRobotsJson {
  index?: string
  follow?: string
  'max-snippet'?: string
  'max-image-preview'?: string
  'max-video-preview'?: string
}

export interface YoastOgImage {
  url?: string
  width?: number
  height?: number
  type?: string
}

export type YoastHeadJson = {
  title?: string
  description?: string
  robots?: YoastRobotsJson
  canonical?: string
  og_title?: string
  og_description?: string
  og_url?: string
  og_site_name?: string
  og_locale?: string
  og_type?: string
  og_image?: YoastOgImage | YoastOgImage[]
  article_modified_time?: string
  twitter_card?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  /** Фокусная фраза Yoast, если отдаётся в JSON */
  focuskw?: string
  /** Классические keywords, если заданы */
  keywords?: string
} & Record<string, unknown>

export interface YoastMetadataOptions {
  /** Публичный origin витрины, например https://osa-market.ru */
  siteUrl: string
  /** Базовый URL WordPress API (для подмены origin в canonical/og:url) */
  apiBaseUrl?: string
  /** Канонический путь на витрине, например `/catalog/noutbuki` */
  canonicalPath?: string
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

/** Заменяет origin API на origin витрины, если URL указывает на WordPress. */
export function rewritePublicSeoUrl(
  rawUrl: string | undefined,
  siteUrl: string,
  apiBaseUrl?: string
): string | undefined {
  if (!rawUrl) return undefined
  try {
    const target = new URL(rawUrl)
    if (apiBaseUrl) {
      const apiOrigin = new URL(apiBaseUrl).origin
      if (target.origin === apiOrigin) {
        const siteOrigin = new URL(
          siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`
        ).origin
        return `${siteOrigin}${target.pathname}${target.search}${target.hash}`
      }
    }
    return rawUrl
  } catch {
    return rawUrl
  }
}

function normalizeOgImages(
  ogImage: YoastHeadJson['og_image']
): Array<{
  url: string
  width?: number
  height?: number
}> | undefined {
  if (!ogImage) return undefined
  const list = Array.isArray(ogImage) ? ogImage : [ogImage]
  const out = list
    .filter((item): item is YoastOgImage => Boolean(item?.url))
    .map((item) => ({
      url: item.url as string,
      width: item.width,
      height: item.height,
    }))
  return out.length ? out : undefined
}

function yoastRobotsToNext(robots: YoastRobotsJson | undefined): Metadata['robots'] {
  if (!robots) return undefined

  let index: boolean | undefined
  if (robots.index === 'index') index = true
  else if (robots.index === 'noindex') index = false

  let follow: boolean | undefined
  if (robots.follow === 'follow') follow = true
  else if (robots.follow === 'nofollow') follow = false

  const gb: Record<string, string | number | boolean | undefined> = {}
  if (robots['max-snippet']) gb['max-snippet'] = robots['max-snippet']
  if (robots['max-image-preview']) gb['max-image-preview'] = robots['max-image-preview']
  if (robots['max-video-preview']) gb['max-video-preview'] = robots['max-video-preview']

  const hasGb = Object.keys(gb).length > 0

  if (index === undefined && follow === undefined && !hasGb) return undefined

  return {
    index,
    follow,
    ...(hasGb ? { googleBot: gb } : {}),
  } as Metadata['robots']
}

function keywordsFromYoast(yoast: YoastHeadJson): string | string[] | undefined {
  if (typeof yoast.keywords === 'string' && yoast.keywords.trim())
    return yoast.keywords.trim()
  if (typeof yoast.focuskw === 'string' && yoast.focuskw.trim())
    return yoast.focuskw.trim()
  return undefined
}

function ogTypeToNext(ogType: string | undefined): 'website' | 'article' {
  if (!ogType) return 'website'
  if (ogType === 'article') return 'article'
  return 'website'
}

/**
 * Преобразует `yoast_head_json` в объект Metadata Next.js.
 * URL canonical/og переписываются на публичный домен витрины при совпадении с API.
 */
export function yoastHeadJsonToMetadata(
  yoast: YoastHeadJson | null | undefined,
  options: YoastMetadataOptions
): Metadata | null {
  if (!yoast || typeof yoast !== 'object') return null

  const site = stripTrailingSlash(options.siteUrl)
  const apiBase = options.apiBaseUrl

  const canonicalRaw = yoast.canonical ?? yoast.og_url
  const canonicalRewritten = rewritePublicSeoUrl(canonicalRaw, site, apiBase)
  const canonical =
    canonicalRewritten ??
    (options.canonicalPath ? `${site}${options.canonicalPath}` : undefined)

  const ogUrl =
    rewritePublicSeoUrl(yoast.og_url, site, apiBase) ?? canonical

  const title = yoast.title
  const description = yoast.description
  const ogTitle = yoast.og_title ?? title
  const ogDescription = yoast.og_description ?? description
  const images = normalizeOgImages(yoast.og_image)
  const twitterImage =
    typeof yoast.twitter_image === 'string' ? yoast.twitter_image : undefined
  const twitterImages =
    twitterImage ? [twitterImage] : images?.map((i) => i.url).filter(Boolean)

  const keywords = keywordsFromYoast(yoast)

  if (
    !title &&
    !description &&
    !canonical &&
    !keywords &&
    !images?.length &&
    !yoast.robots
  ) {
    return null
  }

  const twitterCard =
    yoast.twitter_card === 'summary' ? 'summary' : 'summary_large_image'

  const md: Metadata = {}

  if (title) md.title = title
  if (description) md.description = description
  if (keywords) md.keywords = keywords

  const robotsMd = yoastRobotsToNext(yoast.robots)
  if (robotsMd) md.robots = robotsMd

  if (canonical) md.alternates = { canonical }

  if (ogTitle || ogDescription || ogUrl || images?.length) {
    const ogType = ogTypeToNext(yoast.og_type)
    const baseOg = {
      type: ogType,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(ogUrl ? { url: ogUrl } : {}),
      ...(yoast.og_locale ? { locale: yoast.og_locale } : {}),
      ...(yoast.og_site_name ? { siteName: yoast.og_site_name } : {}),
      ...(images?.length ? { images } : {}),
    }

    md.openGraph =
      ogType === 'article' && yoast.article_modified_time
        ? { ...baseOg, modifiedTime: yoast.article_modified_time }
        : baseOg
  }

  if (
    yoast.twitter_title ||
    yoast.twitter_description ||
    twitterImages?.length
  ) {
    const tw: NonNullable<Metadata['twitter']> = {
      card: twitterCard,
    }
    if (yoast.twitter_title ?? ogTitle)
      tw.title = yoast.twitter_title ?? ogTitle
    if (yoast.twitter_description ?? ogDescription)
      tw.description = yoast.twitter_description ?? ogDescription
    if (twitterImages?.length) tw.images = twitterImages
    md.twitter = tw
  }

  return md
}

/** Поверх базовых метаданных накладывает значения из Yoast (не undefined). */
export function mergeSeoMetadata(base: Metadata, yoastLayer: Metadata): Metadata {
  const out: Metadata = { ...base }

  if (yoastLayer.title !== undefined) out.title = yoastLayer.title
  if (yoastLayer.description !== undefined) out.description = yoastLayer.description
  if (yoastLayer.keywords !== undefined) out.keywords = yoastLayer.keywords
  if (yoastLayer.robots !== undefined) out.robots = yoastLayer.robots

  if (yoastLayer.alternates !== undefined) {
    out.alternates = { ...base.alternates, ...yoastLayer.alternates }
  }

  if (yoastLayer.openGraph !== undefined) {
    out.openGraph = { ...base.openGraph, ...yoastLayer.openGraph }
  }

  if (yoastLayer.twitter !== undefined) {
    out.twitter = { ...base.twitter, ...yoastLayer.twitter }
  }

  return out
}

/** Базовые метаданные витрины + слой Yoast (если есть в ответе API). */
export function buildMetadataWithYoast(
  fallback: Metadata,
  yoast: YoastHeadJson | null | undefined,
  options: YoastMetadataOptions
): Metadata {
  const fromYoast = yoastHeadJsonToMetadata(yoast, options)
  return fromYoast ? mergeSeoMetadata(fallback, fromYoast) : fallback
}

export function seoContextFromEnv(): Pick<YoastMetadataOptions, 'siteUrl' | 'apiBaseUrl'> {
  return {
    siteUrl: process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'https://osa-market.ru',
    apiBaseUrl: process.env.NEXT_PUBLIC_FRONT_API_URL,
  }
}
