'use client'

import { toast } from 'sonner'
import type { Product } from '@/shared/store'
import { useShopStore } from '@/shared/store'

export function useAddToCartWithToast() {
  const addToCart = useShopStore((state) => state.addToCart)

  return (product: Product, quantity = 1) => {
    addToCart(product, quantity)

    toast.success('Товар добавлен в корзину', {
      description: product.name,
    })
  }
}
