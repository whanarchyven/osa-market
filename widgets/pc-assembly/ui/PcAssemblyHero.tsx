'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ResponsiveHeroMedia } from '@/shared/ui/ResponsiveHeroMedia'

export type PcAssemblyHeroProps = {
  badge: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
  heroVideoSrc?: string
}

export function PcAssemblyHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  heroVideoSrc,
}: PcAssemblyHeroProps) {
  const hasMedia = Boolean(heroVideoSrc)

  return (
    <section
      className={`relative overflow-hidden border-b border-border/60 bg-[#101010] ${
        hasMedia
          ? 'flex min-h-[min(72vh,680px)] items-center lg:min-h-[calc(100vh-132px)]'
          : ''
      }`}
    >
      {hasMedia ? (
        <>
          <div className="absolute inset-0 z-0">
            <div
              className={`relative w-full ${
                hasMedia
                  ? 'min-h-[min(72vh,680px)] lg:min-h-[calc(100vh-132px)]'
                  : ''
              }`}
            >
              <ResponsiveHeroMedia
                mobileImageSrc="/mobile_temlate.jpg"
                videoSrc={heroVideoSrc!}
                videoPoster="/mobile_temlate.jpg"
                imageClassName="absolute inset-0 object-cover"
                videoClassName="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/48" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/55" />
          </div>
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-primary/12 blur-[120px]" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-56 w-56 rounded-full bg-primary/8 blur-[100px]" />
        </>
      )}

      <div
        className={`container relative z-[1] mx-auto px-4 ${
          hasMedia ? 'py-16 md:py-20 lg:py-24' : 'py-20 md:py-28'
        }`}
      >
        <div className="max-w-3xl space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            {badge}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl text-pretty max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="#zapis-na-sborku">{primaryCta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary/50 bg-transparent px-8 text-foreground hover:bg-primary/10 hover:text-foreground"
            >
              <Link href="#primeri-sborok">{secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
