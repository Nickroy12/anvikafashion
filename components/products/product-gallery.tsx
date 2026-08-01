"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ZoomIn } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  alt: string
  discount?: number
}

export function ProductGallery({ images, alt, discount }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] md:aspect-auto md:h-[700px] rounded-3xl overflow-hidden bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50">
        No image available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative aspect-[4/5] md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden bg-muted/20 border border-border/50 shadow-sm group cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        {discount !== undefined && discount > 0 && (
          <div className="absolute top-6 left-6 z-10 bg-red-600/95 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1 animate-in zoom-in duration-500">
            -{discount}% OFF
          </div>
        )}
        
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div 
          className="flex items-center gap-3 overflow-x-auto pb-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                idx === selectedIndex 
                  ? "border-primary shadow-md scale-[1.02]" 
                  : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02] bg-muted/20"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[60]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative w-[95vw] h-[95vh] md:w-[85vw] md:h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${alt} Zoomed`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          
          {/* Lightbox Thumbnails */}
          {images.length > 1 && (
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto px-4 pb-2 z-[60]"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedIndex 
                      ? "border-white shadow-lg scale-105" 
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
