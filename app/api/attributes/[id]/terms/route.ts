import { NextResponse } from 'next/server'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductAttributeTermApi } from '@/shared/types/api'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const attributeId = Number(id)
  if (!Number.isFinite(attributeId)) {
    return NextResponse.json({ message: 'Invalid attribute id' }, { status: 400 })
  }

  try {
    const result = await axiosInstance.get<ProductAttributeTermApi[]>(
      API.getProductAttributeTerms(attributeId)
    )
    return NextResponse.json(result.data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json(
      { message: 'Failed to fetch attribute terms' },
      { status }
    )
  }
}

