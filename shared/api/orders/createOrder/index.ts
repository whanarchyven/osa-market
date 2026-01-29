import { API } from '@/shared/api/api'
import { axiosInstance } from '@/shared/api/axios'
import type { OrderCreate, OrderCreateResponse } from '@/shared/types/order'

export const createOrder = async (
  order: OrderCreate
): Promise<OrderCreateResponse> => {
  const result = await axiosInstance.post<OrderCreateResponse>(
    API.createOrder,
    order
  )
  return result.data
}
