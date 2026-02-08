import Image from 'next/image'
import Link from 'next/link'

import type { ProductCategoryTaxonomy } from '@/shared/types/category'
import { DynamicIcon } from '@/shared/ui/DynamicIcon'

interface CategoriesCardProps {
  category: ProductCategoryTaxonomy
  /** Подсветка активной категории (жёлтый бордер) */
  isActive?: boolean
}

const resolveCategoryImage = (category: ProductCategoryTaxonomy) => {
  const image = category.acf?.image ?? category.acf?.ikonka_kategorii
  if (typeof image === 'string') return image
  if (image && typeof image === 'object' && 'url' in image) return image.url ?? null
  return null
}

export function CategoriesCard({
  category,
  isActive = false,
}: CategoriesCardProps) {
  const imageSrc = resolveCategoryImage(category)
  const categoryLink = `/catalog/${category.slug}`

  return (
    <Link
      href={categoryLink}
      className={`group flex h-full flex-col rounded-2xl border bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${
        isActive
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-border/60'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted/10">
        <Image
            src={imageSrc || '/placeholder.svg'}
            alt={category.name}
            fill
            sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {category.name}
          </p>
          {category.acf?.lucide_icon && (
            <DynamicIcon
              name={category.acf.lucide_icon}
              size={20}
              className="text-white group-hover:text-primary"
            />
          )}
        </div>
        <p className="text-base text-muted-foreground">
          {category.count} товаров
        </p>
      </div>
    </Link>
  )
}

