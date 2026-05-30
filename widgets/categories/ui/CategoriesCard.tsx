import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import type { ProductCategoryTaxonomy } from '@/shared/types/category'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'
import { DynamicIcon } from '@/shared/ui/DynamicIcon'

interface CategoriesCardProps {
  category: ProductCategoryTaxonomy
  /** Подсветка активной категории (жёлтый бордер) */
  isActive?: boolean
  variant?: 'default' | 'compact'
}

const resolveCategoryImage = (category: ProductCategoryTaxonomy) => {
  const image = category.acf?.image ?? category.acf?.ikonka_kategorii
  return getBackendMediaUrl(image) || null
}

export function CategoriesCard({
  category,
  isActive = false,
  variant = 'default',
}: CategoriesCardProps) {
  const imageSrc = resolveCategoryImage(category)
  const categoryLink = `/catalog/${category.slug}`
  const isCompact = variant === 'compact'

  return (
    <Link
      href={categoryLink}
      className={cn(
        'group transition-all',
        isCompact
          ? cn(
              'shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium',
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/60 bg-card/80 text-foreground hover:border-primary/40',
              'lg:flex lg:h-full lg:flex-col lg:whitespace-normal lg:rounded-2xl lg:p-4 lg:text-base lg:shadow-sm lg:hover:-translate-y-1 lg:hover:shadow-lg',
              isActive &&
                'lg:ring-2 lg:ring-primary/30',
            )
          : cn(
              'flex h-full flex-col rounded-2xl border bg-card/80 p-4 shadow-sm hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg',
              isActive
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border/60',
            ),
      )}
    >
      <div
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted/10',
          isCompact && 'hidden lg:block',
        )}
      >
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={getBackendMediaAlt(category.acf?.image, category.name)}
          fill
          sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className={cn(isCompact ? 'lg:mt-4 lg:space-y-1' : 'mt-4 space-y-1')}>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'font-semibold text-foreground transition-colors group-hover:text-primary',
              isCompact
                ? 'text-sm lg:text-base'
                : 'text-base lg:text-lg',
            )}
          >
            {category.name}
          </p>
          {category.acf?.lucide_icon && (
            <DynamicIcon
              name={category.acf.lucide_icon}
              size={isCompact ? 16 : 20}
              className={cn(
                'text-white group-hover:text-primary',
                isCompact && 'hidden lg:block',
              )}
            />
          )}
        </div>
        {category.showProducts === true && (
          <p
            className={cn(
              'text-muted-foreground',
              isCompact ? 'hidden text-sm lg:block' : 'text-base',
            )}
          >
            {category.count} товаров
          </p>
        )}
      </div>
    </Link>
  )
}
