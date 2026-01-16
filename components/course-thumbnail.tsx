"use client"

import { useState } from "react"

interface CourseThumbnailProps {
  thumbnail?: string
  title: string
}

export function CourseThumbnail({ thumbnail, title }: CourseThumbnailProps) {
  const [imageError, setImageError] = useState(false)

  if (!thumbnail || imageError) {
    return (
      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all"></div>
    )
  }

  // Optimize Bunny.net URL
  const getOptimizedUrl = (url: string) => {
    if (!url.includes('b-cdn.net')) return url
    
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('width', '400')
      urlObj.searchParams.set('height', '300')
      return urlObj.toString()
    } catch {
      return url
    }
  }

  return (
    <div className="h-32 overflow-hidden bg-muted">
      <img 
        src={getOptimizedUrl(thumbnail)} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        onError={() => {
          console.error('Failed to load thumbnail:', thumbnail)
          setImageError(true)
        }}
      />
    </div>
  )
}
