/**
 * Cloudinary Helper Functions
 * Transforms Cloudinary URLs for optimized delivery
 */

export function getCloudinaryUrl(url: string, options?: {
  width?: number
  height?: number
  crop?: string
  quality?: string
  format?: string
}): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options || {}

  try {
    // Extract the public ID from the URL
    const parts = url.split('/upload/')
    if (parts.length !== 2) return url

    const [baseUrl, assetPath] = parts
    
    // Build transformation string
    const transformations: string[] = []
    
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    if (crop) transformations.push(`c_${crop}`)
    if (quality) transformations.push(`q_${quality}`)
    if (format) transformations.push(`f_${format}`)
    
    const transformStr = transformations.join(',')
    
    // Return transformed URL
    return `${baseUrl}/upload/${transformStr}/${assetPath}`
  } catch (error) {
    console.error('Error transforming Cloudinary URL:', error)
    return url
  }
}

export function getThumbnailUrl(url: string): string {
  return getCloudinaryUrl(url, {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  })
}

export function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
    return videoUrl
  }

  try {
    // For videos, get a thumbnail at 1 second
    const parts = videoUrl.split('/upload/')
    if (parts.length !== 2) return videoUrl

    const [baseUrl, assetPath] = parts
    const transformStr = 'w_400,h_300,c_fill,so_1.0,f_jpg'
    
    return `${baseUrl}/upload/${transformStr}/${assetPath}`
  } catch (error) {
    console.error('Error generating video thumbnail:', error)
    return videoUrl
  }
}
