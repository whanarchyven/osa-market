import Image from 'next/image'
import Link from 'next/link'

import type { ProductCategoryTaxonomy } from '@/shared/types/category'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'
import { DynamicIcon } from '@/shared/ui/DynamicIcon'
import { cn } from '@/lib/utils'

interface CategoriesCardProps {
  category: ProductCategoryTaxonomy
  /** Подсветка активной категории (жёлтый бордер) */
  isActive?: boolean
  /** Компактная карточка для ряда субкатегорий */
  compact?: boolean
  /** Ещё меньше — для горизонтального скролла на мобилке */
  narrow?: boolean
}

const resolveCategoryImage = (category: ProductCategoryTaxonomy) => {
  const image = category.acf?.image ?? category.acf?.ikonka_kategorii
  return getBackendMediaUrl(image) || null
}

export function CategoriesCard({
  category,
  isActive = false,
  compact = false,
  narrow = false,
}: CategoriesCardProps) {
  const imageSrc = resolveCategoryImage(category)
  const categoryLink = `/catalog/${category.slug}`

  return (
    <Link
      href={categoryLink}
      className={cn(
        'group flex h-full flex-col rounded-2xl border bg-card/80 shadow-sm transition-all hover:border-primary/40',
        !narrow && 'hover:-translate-y-1 hover:shadow-lg',
        narrow && 'rounded-xl p-2 hover:shadow-md',
        !narrow && compact && 'p-3',
        !narrow && !compact && 'p-4',
        isActive
          ? narrow
            ? 'border-primary ring-1 ring-primary/40'
            : 'border-primary ring-2 ring-primary/30'
          : 'border-border/60'
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted/10',
          narrow && 'aspect-square max-h-[52px]',
          compact && !narrow && 'aspect-[5/3]',
          !compact && !narrow && 'aspect-[4/3]'
        )}
      >
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={getBackendMediaAlt(category.acf?.image, category.name)}
          fill
          sizes={
            narrow
              ? '120px'
              : compact
                ? '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw'
                : '(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw'
          }
          className={cn(
            'object-contain transition-transform duration-300 group-hover:scale-105',
            narrow && 'p-1',
            compact && !narrow && 'p-2',
            !compact && !narrow && 'p-4'
          )}
        />
      </div>

      <div
        className={cn(
          narrow && 'mt-1.5 space-y-0',
          compact && !narrow && 'mt-2 space-y-0.5',
          !compact && !narrow && 'mt-4 space-y-1'
        )}
      >
        <div
          className={cn(
            'flex gap-2',
            narrow ? 'flex-col items-stretch' : 'items-center'
          )}
        >
          <p
            className={cn(
              'font-semibold text-foreground transition-colors group-hover:text-primary',
              narrow && 'text-center text-[11px] leading-tight line-clamp-2',
              compact && !narrow && 'text-base',
              !compact && !narrow && 'text-xl'
            )}
          >
            {category.name}
          </p>
          {category.acf?.lucide_icon && !narrow && (
            <DynamicIcon
              name={category.acf.lucide_icon}
              size={compact ? 16 : 20}
              className="text-white group-hover:text-primary"
            />
          )}
        </div>
        {(category.showProducts === true || compact || narrow) && (
          <p
            className={cn(
              'text-muted-foreground',
              narrow && 'text-center text-[10px] leading-none',
              compact && !narrow && 'text-xs',
              !compact && !narrow && 'text-base'
            )}
          >
            {category.count} товаров
          </p>
        )}
      </div>
    </Link>
  )
}
