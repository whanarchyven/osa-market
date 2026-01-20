'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/shared/store'
import type { RazdelKataloga } from '@/shared/types/api'

interface CatalogDropdownProps {
  razdely_kataloga: RazdelKataloga[]
}

export function CatalogDropdown({ razdely_kataloga }: CatalogDropdownProps) {
  const { isCatalogOpen, setCatalogOpen } = useUIStore()
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeCategory = razdely_kataloga[activeCategoryIndex]?.kategoriya

  useEffect(() => {
    if (isCatalogOpen && razdely_kataloga.length > 0) {
      setActiveCategoryIndex(0)
    }
  }, [isCatalogOpen, razdely_kataloga.length])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCatalogOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCatalogOpen(false)
      }
    }

    if (isCatalogOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isCatalogOpen, setCatalogOpen])

  if (!isCatalogOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div 
        ref={dropdownRef}
        className="absolute top-[120px] lg:top-[110px] left-0 right-0 bg-card border-b border-border shadow-2xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex min-h-[400px] max-h-[70vh]">
            {/* Categories list - Left side */}
            <div className="w-64 border-r border-border py-4 overflow-y-auto">
              <div className="space-y-1">
                {razdely_kataloga.map((razdel, index) => {
                  const kategoriya = razdel.kategoriya
                  const isActive = activeCategoryIndex === index
                  
                  return (
                    <button
                      key={kategoriya.ssylka_na_kategoriyu.term_id}
                      onMouseEnter={() => setActiveCategoryIndex(index)}
                      onClick={() => setActiveCategoryIndex(index)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${isActive 
                          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                          : 'text-foreground hover:bg-secondary border-l-2 border-transparent'
                        }
                      `}
                    >
                      {kategoriya.ikonka_kategorii && (
                        <Image 
                          src={kategoriya.ikonka_kategorii || "/placeholder.svg"} 
                          alt={kategoriya.naimenovanie_kategorii}
                          width={20}
                          height={20}
                          className="w-5 h-5 flex-shrink-0 object-contain"
                        />
                      )}
                      <span className="text-sm font-medium flex-1">
                        {kategoriya.naimenovanie_kategorii}
                      </span>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter groups - Right side */}
            <div className="flex-1 py-6 px-8 overflow-y-auto">
              {activeCategory && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {activeCategory.naimenovanie_kategorii}
                  </h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeCategory.gruppy_filtrov.map((gruppaItem) => {
                      const gruppa = gruppaItem.gruppa_filtrov
                      
                      return (
                        <div key={gruppa.slug_taksonomii}>
                          <h4 className="text-sm font-semibold text-primary mb-3">
                            {gruppa.zagolovok_filtra}
                          </h4>
                          <ul className="space-y-2">
                            {gruppa.varianty_filtra.map((variantItem) => {
                              const variant = variantItem.variant_filtra
                              const categorySlug = activeCategory.ssylka_na_kategoriyu.slug
                              const normalizedSlug = gruppa.slug_taksonomii.startsWith('pa_')
                                ? gruppa.slug_taksonomii
                                : `pa_${gruppa.slug_taksonomii}`
                              const params = new URLSearchParams({
                                [normalizedSlug]: variant.znachenie,
                              })
                              
                              return (
                                <li key={variant.znachenie}>
                                  <Link
                                    href={`/catalog/${categorySlug}?${params.toString()}`}
                                    onClick={() => setCatalogOpen(false)}
                                    className="text-sm text-muted-foreground hover:text-foreground hover:pl-1 transition-all"
                                  >
                                    {variant.zagolovok}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <Link
                      href={`/catalog/${activeCategory.ssylka_na_kategoriyu.slug}`}
                      onClick={() => setCatalogOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Смотреть все в категории {activeCategory.naimenovanie_kategorii}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setCatalogOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              aria-label="Закрыть каталог"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
