'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo.svg" alt="OSA-MARKET" width={40} height={40} />
      <div className="relative">
        <span className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-primary">OSA</span>
          <span className="text-foreground">-MARKET</span>
        </span>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
      </div>
    </Link>
  )
}
