import { cache } from 'react'

import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductAttributeApi, ProductAttributeTermApi } from '@/shared/types/api'

export const getProductAttributes = cache(
  async (): Promise<ProductAttributeApi[]> => {
    try {
      const result = await axiosInstance.get<ProductAttributeApi[]>(
        API.getProductAttributes
      )
      return result.data
    } catch (e: unknown) {
      console.log(e, 'ERROR FETCHING PRODUCT ATTRIBUTES')
      throw e
    }
  }
)

export const getProductAttributeTerms = async (
  attributeId: number
): Promise<ProductAttributeTermApi[]> => {
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch(`/api/attributes/${attributeId}/terms`)
      if (!response.ok) {
        throw new Error(`Failed to load terms: ${response.status}`)
      }
      return (await response.json()) as ProductAttributeTermApi[]
    }

    const result = await axiosInstance.get<ProductAttributeTermApi[]>(
      API.getProductAttributeTerms(attributeId)
    )
    return result.data
  } catch (e: unknown) {
    console.log(e, 'ERROR FETCHING PRODUCT ATTRIBUTE TERMS')
    throw e
  }
}
