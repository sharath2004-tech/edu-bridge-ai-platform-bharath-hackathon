/**
 * Bunny.net Helper Functions
 * Optimizes media URLs for better performance
 */

export function getOptimizedUrl(url: string, options?: {
  width?: number
  height?: number
}): string {
  if (!url || !url.includes('b-cdn.net')) {
    return url
  }

  const { width, height } = options || {}

  try {
    // Bunny.net supports query parameters for image optimization
    const urlObj = new URL(url)
    
    if (width) urlObj.searchParams.set('width', width.toString())
    if (height) urlObj.searchParams.set('height', height.toString())
    
    return urlObj.toString()
  } catch (error) {
    console.error('Error optimizing Bunny.net URL:', error)
    return url
  }
}

export function getThumbnailUrl(url: string): string {
  return getOptimizedUrl(url, {
    width: 400,
    height: 300,
  })
}

export function getVideoThumbnail(videoUrl: string): string {
  // For Bunny.net videos, you can use the Stream API for thumbnails
  // For now, return the video URL as-is
  return videoUrl
}
