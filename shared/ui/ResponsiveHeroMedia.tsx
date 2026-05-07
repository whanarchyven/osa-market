'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type ResponsiveHeroMediaProps = {
  mobileImageSrc: string
  mobileImageAlt?: string
  videoSrc: string
  /** Постер плейера (рабочий стол); на мобиле показываем mobileImageSrc. */
  videoPoster?: string
  imageClassName?: string
  videoClassName?: string
}

/** Видео не монтируется на узких экранах — без лишней загрузки MP4. */
export function ResponsiveHeroMedia({
  mobileImageSrc,
  mobileImageAlt = '',
  videoSrc,
  videoPoster,
  imageClassName = 'object-cover',
  videoClassName = 'w-full h-full object-cover',
}: ResponsiveHeroMediaProps) {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const showImage = !mounted || !isDesktop

  return (
    <>
      {showImage && (
        <Image
          src={mobileImageSrc}
          alt={mobileImageAlt}
          fill
          priority
          sizes="100vw"
          className={imageClassName}
          {...(mobileImageAlt === '' ? { 'aria-hidden': true } : {})}
        />
      )}
      {mounted && isDesktop && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={videoPoster}
          className={videoClassName}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </>
  )
}
