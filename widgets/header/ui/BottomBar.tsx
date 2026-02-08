'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, User, Heart, ShoppingCart, LayoutGrid, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { useAuthStore, useShopStore, useUIStore } from '@/shared/store'
import { useAuthSync } from '@/shared/hooks/useAuthSync'
import type { ProductApi } from '@/shared/types/product'

interface BottomBarProps {
  nomer_telefona?: string
}

const normalizePhone = (value?: string) => value?.replace(/\s+/g, '') ?? ''

export function BottomBar({ nomer_telefona }: BottomBarProps) {
  useAuthSync()

  const { isCatalogOpen, toggleCatalog, isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const { favorites, getCartTotalItems } = useShopStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ProductApi[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const totalCartItems = getCartTotalItems()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const phoneValue = nomer_telefona?.trim() ?? ''
  const phoneHref = phoneValue ? `tel:${normalizePhone(phoneValue)}` : ''

  useEffect(() => {
    const trimmedQuery = searchQuery.trim()

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current)
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }

    if (trimmedQuery.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      setSearchError(null)
      return
    }

    setIsSearching(true)
    setSearchError(null)

    searchTimeoutRef.current = window.setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch(
          `/api/proxy/wc/v3/products?search=${encodeURIComponent(trimmedQuery)}&per_page=10&status=publish`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Ошибка поиска')
        }

        const data = (await response.json()) as ProductApi[]
        setSearchResults(data)
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          setSearchResults([])
          setSearchError('Не удалось выполнить поиск')
        }
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16 lg:h-14">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex-shrink-0">
            <Logo className="scale-90" />
          </div>

          {/* Catalog button */}
          <Link
            href="/catalog/pcs"
            className={`
              hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all
              ${isCatalogOpen 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }
            `}
          >
            {isCatalogOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <LayoutGrid className="w-5 h-5" />
            )}
            <span>Каталог товаров</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:block max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsSearchOpen(false), 150)
                }}
                placeholder="Введите запрос..."
                className="w-full h-10 lg:h-11 pl-4 pr-24 bg-input border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-1.5 lg:py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Найти</span>
              </button>

              {isSearchOpen && (searchResults.length > 0 || isSearching || searchError) && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-40"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <div className="max-h-80 overflow-y-auto">
                    {isSearching && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        Идёт поиск...
                      </div>
                    )}
                    {searchError && (
                      <div className="px-4 py-3 text-sm text-destructive">
                        {searchError}
                      </div>
                    )}
                    {!isSearching && !searchError && searchResults.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        Ничего не найдено
                      </div>
                    )}
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {product.images?.[0]?.src ? (
                            <img
                              src={product.images[0].src}
                              alt={product.images[0].alt || product.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {product.price} ₽
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Action icons */}
          <div className="flex items-center gap-1 lg:gap-2">
          <Link
            href={isAuthenticated ? '/account' : '/login'}
            className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors group"
            aria-label="Личный кабинет"
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="hidden lg:block text-xs mt-0.5 group-hover:text-primary">
              {isAuthenticated ? 'Кабинет' : 'Войти'}
            </span>
          </Link>

            <Link
              href="/favorites"
              className="relative flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors group"
              aria-label="Избранное"
            >
              <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:block text-xs mt-0.5 group-hover:text-primary">Избранное</span>
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 lg:top-0 lg:right-0 w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] lg:text-xs font-bold rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors group"
              aria-label="Корзина"
            >
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:block text-xs mt-0.5 group-hover:text-primary">Корзина</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 lg:top-0 lg:right-0 w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] lg:text-xs font-bold rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  toggleCatalog()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                <LayoutGrid className="w-5 h-5" />
                Каталог товаров
              </button>
              
              <Link
                href="/promos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Акции
              </Link>
              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Новости
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                О нас
              </Link>
              
              {phoneValue && (
                <div className="pt-4 border-t border-border">
                  <a
                    href={phoneHref}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {phoneValue}
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
