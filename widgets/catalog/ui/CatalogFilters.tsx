'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { useUIStore } from '@/shared/store'
import { getProductAttributeTerms } from '@/shared/api/products/attributes'
import { getBrands } from '@/shared/api/products/brands/getBrands'
import type { ProductAttributeApi, ProductAttributeTermApi } from '@/shared/types/api'

interface CatalogFiltersProps {
  attributes: ProductAttributeApi[]
  categorySlug: string
}

type AttributeFiltersAccordionProps = {
  attributes: ProductAttributeApi[]
  loadingTerms: Record<number, boolean>
  terms: Record<number, ProductAttributeTermApi[]>
  handleAccordionChange: (attributeId: number, slug: string) => void
  handleFilterChange: (slug: string, termSlug: string, checked: boolean) => void
  isChecked: (slug: string, termSlug: string) => boolean
}

/** Внутренний блок с аккордеонами по атрибутам (переиспользуется мобилка / десктоп). */
function AttributeFiltersAccordion({
  attributes,
  loadingTerms,
  terms,
  handleAccordionChange,
  handleFilterChange,
  isChecked,
}: AttributeFiltersAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {attributes.map((attr) => (
        <AccordionItem key={attr.id} value={`attr-${attr.id}`} className="border-border">
          <AccordionTrigger
            onClick={() => handleAccordionChange(attr.id, attr.slug)}
            className="py-3 text-sm font-medium text-foreground hover:no-underline"
          >
            {attr.name}
          </AccordionTrigger>
          <AccordionContent>
            {loadingTerms[attr.id] ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-pulse rounded-sm bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : terms[attr.id] ? (
              <div className="space-y-2">
                {terms[attr.id].map((term) => (
                  <label
                    key={term.id}
                    className="flex cursor-pointer items-center gap-3 py-1 text-foreground transition-colors hover:text-primary"
                  >
                    <Checkbox
                      checked={isChecked(attr.slug, term.slug)}
                      onCheckedChange={(checked) =>
                        handleFilterChange(attr.slug, term.slug, checked as boolean)
                      }
                    />
                    <span className="text-sm">{term.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="py-2 text-sm text-muted-foreground">Нет доступных опций</div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function CatalogFilters({ attributes, categorySlug }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setCatalogLoading = useUIStore((state) => state.setCatalogLoading)
  const [loadingTerms, setLoadingTerms] = useState<Record<number, boolean>>({})
  const [terms, setTerms] = useState<Record<number, ProductAttributeTermApi[]>>({})
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const sortByMenuOrder = (items: ProductAttributeTermApi[]) => {
    const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' })
    return [...items].sort((a, b) => {
      const orderA = a.menu_order ?? 0
      const orderB = b.menu_order ?? 0
      if (orderA !== orderB) return orderA - orderB
      return collator.compare(a.name, b.name)
    })
  }

  useEffect(() => {
    const filters: Record<string, string[]> = {}
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'sort') {
        filters[key] = value.split(',')
      }
    })
    setSelectedFilters(filters)
    setCatalogLoading(false)
  }, [searchParams, setCatalogLoading])

  const handleAccordionChange = async (attributeId: number, slug: string) => {
    if (terms[attributeId] || loadingTerms[attributeId]) return

    setLoadingTerms((prev) => ({ ...prev, [attributeId]: true }))

    try {
      if (slug === 'brand') {
        const brands = await getBrands()
        const mapped = brands.map<ProductAttributeTermApi>((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description ?? '',
          menu_order: brand.menu_order ?? 0,
          count: brand.count ?? 0,
          _links: brand._links,
        }))
        setTerms((prev) => ({ ...prev, [attributeId]: sortByMenuOrder(mapped) }))
      } else {
        const data = await getProductAttributeTerms(attributeId)
        setTerms((prev) => ({ ...prev, [attributeId]: sortByMenuOrder(data) }))
      }
    } catch (error) {
      console.error('Error loading terms:', error)
    } finally {
      setLoadingTerms((prev) => ({ ...prev, [attributeId]: false }))
    }
  }

  const handleFilterChange = (slug: string, termSlug: string, checked: boolean) => {
    const newFilters = { ...selectedFilters }

    if (checked) {
      newFilters[slug] = [...(newFilters[slug] || []), termSlug]
    } else {
      newFilters[slug] = (newFilters[slug] || []).filter((t) => t !== termSlug)
      if (newFilters[slug].length === 0) {
        delete newFilters[slug]
      }
    }

    setSelectedFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','))
      }
    })

    setCatalogLoading(true)
    router.push(`/catalog/${categorySlug}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const isChecked = (slug: string, termSlug: string) =>
    selectedFilters[slug]?.includes(termSlug) || false

  const accordionProps: AttributeFiltersAccordionProps = {
    attributes,
    loadingTerms,
    terms,
    handleAccordionChange,
    handleFilterChange,
    isChecked,
  }

  return (
    <div className="w-full">
      {/* Мобила: один общий аккордеон скрывает все группы фильтров */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full rounded-xl border border-border px-3">
          <AccordionItem value="catalog-filters-root" className="border-none">
            <AccordionTrigger className="py-3 text-base font-semibold text-foreground hover:no-underline">
              Фильтр товаров
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/80 pb-2 pt-2">
              <AttributeFiltersAccordion {...accordionProps} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Десктоп: заголовок + аккордеоны как раньше */}
      <div className="hidden lg:block">
        <h2 className="mb-4 text-base font-semibold text-foreground">Фильтр товаров</h2>
        <AttributeFiltersAccordion {...accordionProps} />
      </div>
    </div>
  )
}
