import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image: string
  category: string
  subcategory?: string
  brand?: string
  rating?: number
  reviews?: number
  inStock: boolean
  excerpt?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
}

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'osa-auth-storage',
    }
  )
)

// Cart Store
interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'osa-cart-storage',
    }
  )
)

// Favorites Store
interface FavoritesState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) {
            return state
          }
          return { items: [...state.items, product] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id)
          if (exists) {
            return { items: state.items.filter((item) => item.id !== product.id) }
          }
          return { items: [...state.items, product] }
        }),
      isFavorite: (productId) => get().items.some((item) => item.id === productId),
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'osa-favorites-storage',
    }
  )
)

// Shop Store (cart + favorites in one place)
interface ShopState {
  favorites: Product[]
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleFavorite: (product: Product) => void
  addFavorite: (product: Product) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  getCartTotalItems: () => number
  getCartTotalPrice: () => number
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      favorites: [],
      cart: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { cart: [...state.cart, { ...product, quantity }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.id !== productId)
              : state.cart.map((item) =>
                  item.id === productId ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.favorites.some((item) => item.id === product.id)
          return {
            favorites: exists
              ? state.favorites.filter((item) => item.id !== product.id)
              : [...state.favorites, product],
          }
        }),
      addFavorite: (product) =>
        set((state) =>
          state.favorites.some((item) => item.id === product.id)
            ? state
            : { favorites: [...state.favorites, product] }
        ),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        })),
      isFavorite: (productId) =>
        get().favorites.some((item) => item.id === productId),
      getCartTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
      getCartTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'osa-MARKET-storage',
    }
  )
)

// UI Store (for modals, dropdowns, etc.)
interface UIState {
  isCatalogOpen: boolean
  isSearchFocused: boolean
  isCallbackModalOpen: boolean
  isMobileMenuOpen: boolean
  isCatalogLoading: boolean
  toggleCatalog: () => void
  setCatalogOpen: (open: boolean) => void
  setSearchFocused: (focused: boolean) => void
  setCallbackModalOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setCatalogLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isCatalogOpen: false,
  isSearchFocused: false,
  isCallbackModalOpen: false,
  isMobileMenuOpen: false,
  isCatalogLoading: false,
  toggleCatalog: () => set((state) => ({ isCatalogOpen: !state.isCatalogOpen })),
  setCatalogOpen: (open) => set({ isCatalogOpen: open }),
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
  setCallbackModalOpen: (open) => set({ isCallbackModalOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCatalogLoading: (loading) => set({ isCatalogLoading: loading }),
}))
