import Link from 'next/link'
import { LayoutGrid, User, ArrowRight } from 'lucide-react'

import { FeaturedSlider } from './FeaturedSlider'
import { HeroButtons } from './HeroButtons'
import Image from 'next/image'
import { HeroSectionProps } from '@/shared/api/pages/main/types'

export function HeroSection({
  slogan,
  opisanie,
  fakty,
  preimushhestva,
  nazvanie_bloka_s_tovarami,
  opisanie_bloka_s_tovarami,
  tovary,
  ssylka_na_video,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-108px)] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1920&h=1080&fit=crop"
        >
          <source
            src={ssylka_na_video}
            type="video/mp4"
          />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Branding */}
          <div className="space-y-8">
            {/* Large Logo */}
            <div className="space-y-4">
              <div className='flex items-center gap-2'>
                <Image src="/logo.svg" alt="OSA-shop" width={100} height={100} />
                <div className="inline-block">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="text-primary">OSA</span>
                  <span className="text-foreground">-shop</span>
                </span>
                <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent mt-2" />
              </div>
              
              </div>
            </div>

            {/* Slogan */}
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance">
                {slogan}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg text-pretty">
                {opisanie}
              </p>
            </div>

            {/* Stats (Fakty) */}
            <div className="flex flex-wrap gap-8">
              {fakty.map((fakt, index) => (
                <div key={index}>
                  <p className="text-3xl md:text-4xl font-bold text-primary">{fakt.zagolovok}</p>
                  <p className="text-sm text-muted-foreground">{fakt.opisanie}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Client component */}
            <HeroButtons />

            {/* Features (Preimushhestva) */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {preimushhestva.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {item.preimushhestvo}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Featured Slider */}
          <div className="hidden lg:block">
            <div className="max-w-md ml-auto">
              <FeaturedSlider 
                title={nazvanie_bloka_s_tovarami}
                description={opisanie_bloka_s_tovarami}
                tovary={tovary}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
      
      {/* Animated glow */}
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[128px] animate-pulse delay-1000" />
    </section>
  )
}
