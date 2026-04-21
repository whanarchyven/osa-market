import type { BackendMedia } from '@/shared/types/media'

export const getBackendMediaUrl = (media: BackendMedia) => {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || media.src || ''
}

export const getBackendMediaAlt = (media: BackendMedia, fallback = '') => {
  if (!media || typeof media === 'string') return fallback
  return media.alt?.trim() || media.title?.trim() || fallback
}
