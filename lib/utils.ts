import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transform Bunny CDN URLs to use the correct CDN hostname
 * Fixes various URL formats:
 * - storage.bunnycdn.com/edu-bridge/ → edubridge-storage.b-cdn.net/
 * - edu-bridge.b-cdn.net/ → edubridge-storage.b-cdn.net/
 */
export function fixBunnyCdnUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  
  const CDN_HOSTNAME = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME || 'edubridge-storage.b-cdn.net'
  
  // Fix storage URLs (should never be used publicly)
  if (url.includes('storage.bunnycdn.com/edu-bridge')) {
    return url.replace(/https?:\/\/storage\.bunnycdn\.com\/edu-bridge\//g, `https://${CDN_HOSTNAME}/`)
  }
  
  // Fix old CDN hostname
  if (url.includes('edu-bridge.b-cdn.net')) {
    return url.replace(/https?:\/\/edu-bridge\.b-cdn\.net\//g, `https://${CDN_HOSTNAME}/`)
  }
  
  return url
}
