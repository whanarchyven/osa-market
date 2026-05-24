export type OrderLineItemCreate = {
  product_id: number
  quantity: number
}

export type OrderAddress = {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address_1?: string
}

export type OrderCreate = {
  payment_method?: string
  payment_method_title?: string
  set_paid?: boolean
  customer_id?: number
  customer_note?: string
  billing: OrderAddress
  shipping?: OrderAddress
  line_items: OrderLineItemCreate[]
}

export type OrderCreateResponse = {
  id: number
  status: string
  total: string
  number?: string
}

export type OrderLineItem = {
  id: number
  name: string
  quantity: number
  total: string
  price?: number
  product_id?: number
}

export type AccountOrder = {
  id: number
  status: string
  total: string
  currency: string
  date_created: string
  line_items: OrderLineItem[]
}
