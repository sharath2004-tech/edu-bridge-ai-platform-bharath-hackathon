"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function OfflineDetector() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleOffline = () => {
      // If user goes offline and not already on offline pages, redirect
      if (!pathname.includes('/offline-videos') && !pathname.includes('/offline')) {
        // Store the current path to return to when back online
        localStorage.setItem('preOfflinePath', pathname)
        
        // Check if user has offline videos
        const hasOfflineContent = checkOfflineContent()
        
        if (hasOfflineContent) {
          router.push('/student/offline-videos')
        } else {
          router.push('/offline')
        }
      }
    }

    const handleOnline = () => {
      // When back online, return to previous path if available
      const prevPath = localStorage.getItem('preOfflinePath')
      if (prevPath && (pathname.includes('/offline-videos') || pathname.includes('/offline'))) {
        localStorage.removeItem('preOfflinePath')
        router.push(prevPath)
      }
    }

    // Check if offline content exists in IndexedDB
    const checkOfflineContent = (): boolean => {
      try {
        const dbRequest = indexedDB.open('EduBridgeOffline', 1)
        dbRequest.onsuccess = () => {
          const db = dbRequest.result
          const transaction = db.transaction(['videos'], 'readonly')
          const store = transaction.objectStore('videos')
          const countRequest = store.count()
          
          countRequest.onsuccess = () => {
            return countRequest.result > 0
          }
        }
        return false
      } catch {
        return false
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Initial check
    if (!navigator.onLine) {
      handleOffline()
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [pathname, router])

  return null
}
