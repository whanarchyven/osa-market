'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ProductBrandApi } from '@/shared/types/product'

interface BrandsMarqueeProps {
  titleHtml: string
  firstGroup: ProductBrandApi[]
  secondGroup: ProductBrandApi[]
}

const titleClassName =
  'text-2xl md:text-3xl font-bold text-foreground text-center [&_strong]:text-primary [&_strong]:font-bold'

function BrandCard({ brand }: { brand: ProductBrandApi }) {
  const imageUrl = brand.image?.src

  return (
    <div className="mx-3 flex min-h-[110px] w-auto items-center justify-center rounded-2xl border border-border/60 bg-white px-7 py-5">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={brand.image?.alt || brand.name}
          width={160}
          height={64}
          sizes="160px"
          className="max-h-16 w-auto max-w-[200px] object-contain"
        />
      ) : (
        <span className="text-sm font-semibold text-foreground">
          {brand.name}
        </span>
      )}
    </div>
  )
}

export function BrandsMarquee({
  titleHtml,
  firstGroup,
  secondGroup,
}: BrandsMarqueeProps) {
  if (!firstGroup.length && !secondGroup.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <div
            className={titleClassName}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        </div>

        <div className="space-y-6">
          {firstGroup.length > 0 && (
            <Marquee
              speed={45}
              gradient
              gradientColor="rgb(16,16,16)"
              gradientWidth={80}
              autoFill
            >
              {firstGroup.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </Marquee>
          )}

          {secondGroup.length > 0 && (
            <Marquee
              speed={45}
              direction="right"
              gradient
              gradientColor="rgb(16,16,16)"
              gradientWidth={80}
              autoFill
            >
              {secondGroup.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </Marquee>
          )}
        </div>
      </div>
    </section>
  )
}
