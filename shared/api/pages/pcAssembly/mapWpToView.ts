import type {
  PcAssemblyBenefitSlide,
  PcAssemblyBuild,
  PcAssemblyBuildAdvantage,
  PcAssemblyIconKey,
} from '@/shared/types/pcAssemblyPage'

import type {
  PcAssemblyWpOtzyv,
  PcAssemblyWpPage,
  PcAssemblyWpPrimerSborki,
} from './types'

const FALLBACK_ICON: PcAssemblyIconKey = 'cpu'

export type PcAssemblyPageViewModel = {
  hero: {
    badge: string
    title: string
    description: string
    primaryCta: string
    secondaryCta: string
    heroVideoSrc?: string
  }
  examplesHeading: string
  examplesSubtitle: string
  builds: PcAssemblyBuild[]
  benefitsHeading: string
  benefitsSubtitle: string
  benefits: PcAssemblyBenefitSlide[]
}

const EMPTY_VM: PcAssemblyPageViewModel = {
  hero: {
    badge: 'Индивидуальная сборка',
    title: 'Сборка ПК',
    description:
      'Подбор совместимых комплектующих, чистая сборка, тест и гарантия на весь комплекс.',
    primaryCta: 'Оставить заявку',
    secondaryCta: 'Смотреть примеры',
    heroVideoSrc: undefined,
  },
  examplesHeading: 'Примеры сборок',
  examplesSubtitle:
    'Ориентировочные решения под разные сценарии — откройте карточку для деталей.',
  builds: [],
  benefitsHeading: 'Почему собирают с нами',
  benefitsSubtitle:
    'Процесс, прозрачность и финальный результат без сюрпризов.',
  benefits: [],
}

function asArray<T>(value: unknown): T[] {
  if (value === false || value == null) return []
  return Array.isArray(value) ? (value as T[]) : []
}

/** Допускаем строку или объект ACF `{ url }`; иное — пустой src */
function acfBuyerPhotoToSrc(raw: unknown): string {
  if (raw == null || raw === false) return ''
  if (typeof raw === 'string') return raw.trim()
  if (typeof raw === 'object' && raw !== null && 'url' in raw) {
    const url = (raw as { url?: unknown }).url
    return typeof url === 'string' ? url.trim() : ''
  }
  return ''
}

/** Разбиваем «Имя Фамилия», одно слово остаётся в firstName */
function splitBuyerName(full: string | undefined): { firstName: string; lastName: string } {
  const t = full?.trim() ?? ''
  if (!t) return { firstName: '', lastName: '' }
  const sp = t.indexOf(' ')
  if (sp === -1) return { firstName: t, lastName: '' }
  return {
    firstName: t.slice(0, sp).trim(),
    lastName: t.slice(sp + 1).trim(),
  }
}

/** YouTube → embed на youtube-nocookie; иное https — файл (mp4 и т.д.) */
function classifyVideo(raw: string): { embedSrc?: string; fileSrc?: string } {
  const url = raw.trim()
  if (!url) return {}

  if (/youtube\.com\/watch\?/i.test(url)) {
    try {
      const u = new URL(url)
      const v = u.searchParams.get('v')
      if (v) return { embedSrc: `https://www.youtube-nocookie.com/embed/${v}` }
    } catch {
      return {}
    }
  }

  if (/youtu\.be\//i.test(url)) {
    try {
      const hostPath = url.split(/youtu\.be\//i)[1]
      const id = hostPath?.split(/[?#]/)[0]
      if (id) return { embedSrc: `https://www.youtube-nocookie.com/embed/${id}` }
    } catch {
      return {}
    }
  }

  if (/\/embed\/[^/?#]+/i.test(url)) {
    try {
      const u = new URL(url.startsWith('//') ? `https:${url}` : url)
      const match = u.pathname.match(/\/embed\/([^/?#]+)/)
      if (match?.[1])
        return {
          embedSrc: `https://www.youtube-nocookie.com/embed/${match[1]}${u.search}`,
        }
    } catch {
      return {}
    }
  }

  return { fileSrc: url }
}

function mapHarakteristiki(
  raw: { ikonka: string; zagolovok: string; opisanie: string }[]
): PcAssemblyBuildAdvantage[] {
  return raw.map((h) => ({
    iconKey: FALLBACK_ICON,
    iconSrc: h.ikonka || undefined,
    title: h.zagolovok,
    description: h.opisanie,
  }))
}

function mapPrimerySborkiItem(
  item: PcAssemblyWpPrimerSborki,
  index: number
): PcAssemblyBuild | null {
  const gallery = asArray<string>(item.gallereya_sborki)
  const card = gallery[0] ?? ''
  if (!item.nazvanie_sborki || !card) return null

  const otzyvRaw = item.otzyv_pokupatelya as unknown
  const otzyv: PcAssemblyWpOtzyv | null =
    otzyvRaw && typeof otzyvRaw === 'object'
      ? (otzyvRaw as PcAssemblyWpOtzyv)
      : null
  const { firstName, lastName } = splitBuyerName(otzyv?.imya_pokupatelya)

  let videoEmbedSrc: string | undefined
  let videoFileSrc: string | undefined
  const vRaw = otzyv?.video_otzyva
  const v = typeof vRaw === 'string' ? vRaw.trim() : ''
  if (v) {
    const c = classifyVideo(v)
    videoEmbedSrc = c.embedSrc
    videoFileSrc = c.fileSrc
  }

  return {
    id: `primer-${index}`,
    title: item.nazvanie_sborki,
    cardImageSrc: card,
    gallerySrcs: gallery.length ? gallery : [card],
    advantages: mapHarakteristiki(
      asArray<{
        ikonka: string
        zagolovok: string
        opisanie: string
      }>(item.harakteristiki)
    ),
    modalIntro: item.opisanie_kratko?.trim() || undefined,
    description: item.polnoe_opisanie ?? '',
    review: otzyv
      ? {
          firstName,
          lastName,
          photoSrc: acfBuyerPhotoToSrc(otzyv.foto_pokupatelya),
          text:
            typeof otzyv.tekst_otzyva === 'string'
              ? otzyv.tekst_otzyva.trim() || undefined
              : undefined,
          videoEmbedSrc,
          videoFileSrc,
        }
      : {
          firstName: '',
          lastName: '',
          photoSrc: '',
        },
  }
}

export function mapPcAssemblyWpToViewModel(
  page: PcAssemblyWpPage | null
): PcAssemblyPageViewModel {
  if (!page) return EMPTY_VM

  const baseTitle = page.title.rendered.trim() || EMPTY_VM.hero.title
  const acf = page.acf

  const z = acf?.zaglavnyj_blok
  const hero = {
    badge: z?.podzagolovok?.trim() || EMPTY_VM.hero.badge,
    title: z?.zagolovok?.trim() || baseTitle,
    description:
      z?.opisanie?.trim() ||
      EMPTY_VM.hero.description,
    primaryCta: z?.tekst_pervoj_knopki?.trim() || EMPTY_VM.hero.primaryCta,
    secondaryCta: z?.tekst_vtoroj_knopki?.trim() || EMPTY_VM.hero.secondaryCta,
    heroVideoSrc: z?.fonovoe_video?.trim() || undefined,
  }

  const prim = acf?.blok_primery_sborok
  const builds = asArray<PcAssemblyWpPrimerSborki>(prim?.primery_sborok)
    .map((item, idx) => mapPrimerySborkiItem(item, idx))
    .filter((x): x is PcAssemblyBuild => x !== null)

  const pre = acf?.blok_preimushhestva
  const rows = asArray<{
    ikonka: string
    zagolovok: string
    opisanie: string
  }>(pre?.preimushhestva)

  const benefits: PcAssemblyBenefitSlide[] = rows.map((row, idx) => ({
    id: `benefit-${idx}`,
    iconKey: FALLBACK_ICON,
    iconSrc: row.ikonka || undefined,
    title: row.zagolovok,
    description: row.opisanie,
  }))

  return {
    hero,
    examplesHeading:
      prim?.zagolovok?.trim() || EMPTY_VM.examplesHeading,
    examplesSubtitle:
      prim?.opisanie?.trim() || EMPTY_VM.examplesSubtitle,
    builds,
    benefitsHeading:
      pre?.zagolovok?.trim() || EMPTY_VM.benefitsHeading,
    benefitsSubtitle:
      pre?.opisanie?.trim() || EMPTY_VM.benefitsSubtitle,
    benefits,
  }
}
