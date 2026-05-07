'use client'

import * as React from 'react'
import Image from 'next/image'

import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

import type { PcAssemblyBuild } from '@/shared/types/pcAssemblyPage'

import 'swiper/css'
import 'swiper/css/navigation'

import { getPcAssemblyIcon } from '@/widgets/pc-assembly/lib/icons'

type PcAssemblyBuildModalProps = {
  build: PcAssemblyBuild | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ModalGallery({ images }: { images: string[] }) {
  const mainRef = React.useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const galleryKey = images.join('|')

  if (images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-xl bg-muted/40 border border-border/60" />
    )
  }

  if (images.length === 1) {
    const src = images[0]
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20">
        <div className="relative aspect-video w-full">
          <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 96vw, 45vw" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Swiper
        key={galleryKey}
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={8}
        style={
          {
            '--swiper-navigation-color': '#ffc300',
            '--swiper-theme-color': '#ffc300',
          } as React.CSSProperties
        }
        onSwiper={(s) => {
          mainRef.current = s
        }}
        onSlideChange={(s) => {
          setActiveIndex(s.activeIndex)
        }}
        className="pc-assembly-modal-gallery aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 [--swiper-navigation-size:44px] [&_.swiper-button-next]:text-[#ffc300] [&_.swiper-button-prev]:text-[#ffc300] [&_.swiper-button-next:after]:text-[#ffc300] [&_.swiper-button-prev:after]:text-[#ffc300]"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`slide-${i}`}>
            <div className="relative aspect-video w-full">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 96vw, 45vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Миниатюры без Swiper Thumbs: стабильно с Next/Image и модалкой */}
      <div
        role="tablist"
        aria-label="Миниатюры галереи"
        className="flex gap-2 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]"
      >
        {images.map((src, i) => {
          const selected = i === activeIndex
          return (
            <button
              key={`thumb-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                mainRef.current?.slideTo(i)
                setActiveIndex(i)
              }}
              className={cn(
                'relative h-14 w-[4.75rem] shrink-0 overflow-hidden rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-16 md:w-[6.25rem]',
                selected
                  ? 'border-primary opacity-100 ring-2 ring-primary/80 ring-offset-2 ring-offset-background'
                  : 'border-border/50 opacity-65 hover:border-primary/50 hover:opacity-100'
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="100px"
                draggable={false}
              />
            </button>
          )
        })}
      </div>

      <style jsx global>{`
        .pc-assembly-modal-gallery .swiper-button-next,
        .pc-assembly-modal-gallery .swiper-button-prev {
          color: #ffc300 !important;
        }
        .pc-assembly-modal-gallery .swiper-button-next:after,
        .pc-assembly-modal-gallery .swiper-button-prev:after {
          font-size: 22px !important;
          font-weight: 900;
          color: #ffc300 !important;
        }
        .pc-assembly-modal-gallery .swiper-button-disabled {
          opacity: 0.25;
          color: #ffc300 !important;
        }
      `}</style>
    </div>
  )
}

export function PcAssemblyBuildModal({
  build,
  open,
  onOpenChange,
}: PcAssemblyBuildModalProps) {
  if (!build) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-6 border-border/70 bg-background p-5 sm:p-8 max-h-[92vh] max-w-[min(100vw-1.5rem,1100px)] overflow-y-auto sm:max-w-5xl"
        showCloseButton
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0">
            <ModalGallery images={build.gallerySrcs} />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <DialogTitle className="text-left text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {build.title}
            </DialogTitle>
            {build.modalIntro ? (
              <DialogDescription className="text-left text-sm text-muted-foreground">
                {build.modalIntro}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                Карточка примера сборки
              </DialogDescription>
            )}

            {build.advantages.length ? (
              <div className="grid grid-cols-2 gap-3">
                {build.advantages.map((adv) => {
                  const Icon = adv.iconSrc
                    ? null
                    : getPcAssemblyIcon(adv.iconKey)
                  return (
                    <div
                      key={`${adv.title}-${adv.description}`}
                      className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-3"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary overflow-hidden relative">
                        {adv.iconSrc ? (
                          <Image
                            src={adv.iconSrc}
                            alt=""
                            fill
                            className="object-contain p-1.5"
                            sizes="40px"
                          />
                        ) : (
                          Icon && <Icon className="size-5" aria-hidden />
                        )}
                      </div>
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        {adv.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {adv.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : null}

            {build.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {build.description}
              </p>
            ) : null}

            <div className="space-y-3 rounded-2xl border border-primary/25 bg-card/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Отзыв покупателя
              </p>
              <div className="flex gap-4">
                {build.review.photoSrc ? (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-muted">
                    <Image
                      src={build.review.photoSrc}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {[build.review.firstName, build.review.lastName]
                      .filter(Boolean)
                      .join(' ')
                      .trim() || 'Покупатель'}
                  </p>
                  {build.review.text ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {build.review.text}
                    </p>
                  ) : null}
                </div>
              </div>

              {build.review.videoFileSrc ? (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black">
                  <video
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={build.review.videoFileSrc} type="video/mp4" />
                  </video>
                </div>
              ) : build.review.videoEmbedSrc ? (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black">
                  <iframe
                    src={build.review.videoEmbedSrc}
                    title="Видео-отзыв"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
