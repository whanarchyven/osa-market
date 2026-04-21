'use client'

import Image from 'next/image'
import { useState } from 'react'
import { parseRichText } from '@/shared/utils/richText'
import type { BackendMedia } from '@/shared/types/media'
import { getBackendMediaAlt, getBackendMediaUrl } from '@/shared/utils/media'

interface AboutStoryProps {
  zagolovok_istorii: string
  tekst_istorii: string
  gallereya: BackendMedia[]
  akcent_zagolovok: string
  akcent_podzagolovok: string
}

export function AboutStory({
  zagolovok_istorii,
  tekst_istorii,
  gallereya,
  akcent_zagolovok,
  akcent_podzagolovok,
}: AboutStoryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = gallereya?.[selectedImageIndex]

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-balance">
        {zagolovok_istorii}
      </h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="text-lg text-gray-300 leading-relaxed mb-6">
            {parseRichText(tekst_istorii)}
          </div>
          <div className="flex gap-4">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-primary font-bold text-xl">{akcent_zagolovok}</p>
              <p className="text-gray-400 text-sm mt-1">{akcent_podzagolovok}</p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl mb-4">
            {selectedImage && (
              <Image
                src={getBackendMediaUrl(selectedImage) || "/placeholder.svg"}
                alt={getBackendMediaAlt(selectedImage, `Галерея ${selectedImageIndex + 1}`)}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          {gallereya && gallereya.length > 1 && (
            <div className="flex gap-3">
              {gallereya.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <Image
                    src={getBackendMediaUrl(image) || "/placeholder.svg"}
                    alt={getBackendMediaAlt(image, `Thumbnail ${idx + 1}`)}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
