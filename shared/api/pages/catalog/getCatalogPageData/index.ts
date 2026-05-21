import { cache } from 'react'

import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { CatalogPageData } from '@/shared/api/pages/catalog/types'

export const getCatalogPageData = cache(async (): Promise<CatalogPageData[]> => {
  try {
    const result = await axiosInstance.get<CatalogPageData[]>(API.getCatalogPage)
    return result.data
  } catch (e: unknown) {
    console.error(e, 'ERROR FETCHING CATALOG PAGE')
    throw e
  }
})
