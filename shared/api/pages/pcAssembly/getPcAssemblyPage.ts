import { cache } from 'react'

import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'

import type { PcAssemblyWpPage } from './types'

/** Страница WordPress «Сборка ПК», слаг фиксирован на бэкенде. */
export const getPcAssemblyPage = cache(
  async (): Promise<PcAssemblyWpPage | null> => {
    try {
      const result = await axiosInstance.get<PcAssemblyWpPage[]>(
        API.getPageBySlug('sborka-pk')
      )
      return result.data[0] ?? null
    } catch (e) {
      console.error(e, 'ERROR FETCHING PC ASSEMBLY PAGE')
      return null
    }
  }
)
