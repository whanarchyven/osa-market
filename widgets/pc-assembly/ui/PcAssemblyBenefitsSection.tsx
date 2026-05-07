'use client'

import Image from 'next/image'
import * as React from 'react'

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { PcAssemblyBenefitSlide } from '@/shared/types/pcAssemblyPage'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { getPcAssemblyIcon } from '@/widgets/pc-assembly/lib/icons'

type PcAssemblyBenefitsSectionProps = {
  benefits: PcAssemblyBenefitSlide[]
  heading: string
  subtitle: string
}

const prevCls = 'pc-assembly-cover-prev'
const nextCls = 'pc-assembly-cover-next'

export function PcAssemblyBenefitsSection({
  benefits,
  heading,
  subtitle,
}: PcAssemblyBenefitsSectionProps) {
  const [{ depth, rotate }, setCover] = React.useState({ depth: 88, rotate: -9 })

  React.useEffect(() => {
    const sync = () => {
      const w = window.innerWidth
      if (w < 480) setCover({ depth: 48, rotate: -4 })
      else if (w < 768) setCover({ depth: 64, rotate: -6 })
      else if (w < 1024) setCover({ depth: 76, rotate: -8 })
      else setCover({ depth: 96, rotate: -10 })
    }
    sync()
    window.addEventListener('resize', sync, { passive: true })
    return () => window.removeEventListener('resize', sync)
  }, [])

  if (!benefits.length) return null

  const useLoop = benefits.length >= 4

  return (
    <section id="pc-assembly-benefits" className="bg-card/40 py-14 md:py-24">
      <div className="container mx-auto max-w-[100vw] px-4">
        <header className=" mx-auto mb-10 max-w-2xl space-y-3 text-center md:mb-14">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </header>

        <div className="relative">
          {/* Боковые кнопки — внутри padding, не выпирают за экран */}
          <button
            type="button"
            aria-label="Предыдущее преимущество"
            className={`${prevCls} absolute left-0 top-[40%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/70 bg-background/95 p-0 text-primary shadow-md transition hover:bg-primary hover:text-black sm:flex lg:left-1`}
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="m15 6-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Следующее преимущество"
            className={`${nextCls} absolute right-0 top-[40%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/70 bg-background/95 p-0 text-primary shadow-md transition hover:bg-primary hover:text-black sm:flex lg:right-1`}
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="m9 6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Клип по горизонтали — coverflow не уезжает за вьюпорт */}
          <div className="relative -mx-1 overflow-x-clip px-11 sm:-mx-0 sm:px-14 lg:mx-auto lg:max-w-5xl">
            {/* <div className="pointer-events-none absolute inset-y-8 left-0 z-10 w-10 bg-gradient-to-r from-[#101010] to-transparent md:w-14" />
            <div className="pointer-events-none absolute inset-y-8 right-0 z-10 w-10 bg-gradient-to-l from-[#101010] to-transparent md:w-14" /> */}

            <Swiper
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              centeredSlides
              effect="coverflow"
              autoplay={{
                delay: 4500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              watchOverflow
              coverflowEffect={{
                rotate,
                stretch: 0,
                depth,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: `.${prevCls}`,
                nextEl: `.${nextCls}`,
              }}
              slidesPerView="auto"
              spaceBetween={14}
              loop={useLoop}
              breakpoints={{
                640: { spaceBetween: 18 },
                1024: { spaceBetween: 22 },
              }}
              className="pc-assembly-cover pb-14 !overflow-hidden [&_.swiper-pagination]:static [&_.swiper-pagination]:pt-10"
            >
              {benefits.map((item) => {
                const Icon = item.iconSrc ? null : getPcAssemblyIcon(item.iconKey)
                return (
                  <SwiperSlide
                    key={item.id}
                    className="!h-auto !w-[min(calc(100vw-7rem),19rem)] !max-w-[min(calc(100vw-7rem),19rem)] sm:!w-[20.5rem] sm:!max-w-[20.5rem] md:!w-[22rem] md:!max-w-[22rem]"
                  >
                    <article className="mx-auto flex h-full min-h-[260px] flex-col items-center rounded-3xl border border-primary/35 bg-[#161616]/90 px-5 py-8 text-center shadow-inner shadow-primary/10 backdrop-blur-sm sm:min-h-[280px] sm:px-6 sm:py-10">
                      <div className="mb-5 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/18 text-primary sm:mb-6">
                        {item.iconSrc ? (
                          <span className="relative size-8 sm:size-9">
                            <Image
                              src={item.iconSrc}
                              alt=""
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </span>
                        ) : (
                          Icon && <Icon className="size-7" aria-hidden />
                        )}
                      </div>
                      <h3 className="mb-3 text-lg font-bold text-foreground sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </article>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <style jsx global>{`
            .pc-assembly-cover .swiper-pagination-bullet {
              background-color: #ffc300;
              opacity: 0.35;
              margin: 0 6px !important;
            }
            .pc-assembly-cover .swiper-pagination-bullet-active {
              background-color: #ffc300;
              opacity: 1;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
