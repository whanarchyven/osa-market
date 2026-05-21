'use client'

import * as React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import type { PcAssemblyBuild } from '@/shared/types/pcAssemblyPage'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { PcAssemblyBuildModal } from './PcAssemblyBuildModal'

type PcAssemblyExamplesSectionProps = {
  builds: PcAssemblyBuild[]
  heading: string
  subtitle: string
}

export function PcAssemblyExamplesSection({
  builds,
  heading,
  subtitle,
}: PcAssemblyExamplesSectionProps) {
  const [active, setActive] = React.useState<PcAssemblyBuild | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const openBuild = React.useCallback((build: PcAssemblyBuild) => {
    setActive(build)
    setDialogOpen(true)
  }, [])

  if (!builds.length) {
    return null
  }

  return (
    <section id="primeri-sborok" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="mb-12 max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </header>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={20}
            slidesPerView={1.05}
            breakpoints={{
              640: { slidesPerView: 1.55 },
              900: { slidesPerView: 2.2 },
              1200: { slidesPerView: 2.85 },
            }}
            className="pc-build-examples pb-14"
          >
            {builds.map((build) => (
              <SwiperSlide key={build.id} className="!h-auto">
                <button
                  type="button"
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 text-left transition hover:border-primary/60 hover:shadow-[0_0_25px_rgba(255,195,0,0.2)]"
                  onClick={() => openBuild(build)}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                    <Image
                      src={build.cardImageSrc}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 92vw, (max-width: 1200px) 42vw, 34vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">
                      сборка • пример
                    </p>
                    <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2">
                      {build.title}
                    </h3>
                    <span className="mt-auto pt-3 text-xs font-semibold uppercase text-primary underline-offset-4 group-hover:underline">
                      Подробнее
                    </span>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          <style jsx global>{`
            .pc-build-examples {
              --swiper-navigation-size: 1rem;
            }
            .pc-build-examples .swiper-pagination-bullet {
              background-color: #ffc300;
              opacity: 0.4;
            }
            .pc-build-examples .swiper-pagination-bullet-active {
              background-color: #ffc300;
              opacity: 1;
            }
            .pc-build-examples .swiper-button-next,
            .pc-build-examples .swiper-button-prev {
              color: #ffc300;
              top: 46%;
              margin-top: 0;
              border-radius: 9999px;
              background: rgb(26 26 26 / 0.9);
              width: 2.75rem !important;
              height: 2.75rem !important;
              display: flex !important;
              align-items: center;
              justify-content: center !important;
            }
            .pc-build-examples .swiper-button-next:after,
            .pc-build-examples .swiper-button-prev:after {
              font-size: var(--swiper-navigation-size) !important;
              font-weight: 700;
            }
          `}</style>
        </div>
      </div>

      <PcAssemblyBuildModal
        build={active}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
