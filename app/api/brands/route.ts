import { NextResponse } from 'next/server'
import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { ProductBrandApi } from '@/shared/types/api'

export async function GET() {
  try {
    const result = await axiosInstance.get<ProductBrandApi[]>(API.getProductBrands)
    return NextResponse.json(result.data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json({ message: 'Failed to fetch brands' }, { status })
  }
}

