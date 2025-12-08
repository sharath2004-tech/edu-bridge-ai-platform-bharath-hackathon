// Service Worker for Offline Video Playback
const CACHE_NAME = 'edubridge-v1'
const VIDEO_CACHE = 'video-cache'

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/manifest.json'
      ])
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== VIDEO_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event with offline support
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Handle video requests
  if (request.url.includes('video') || request.url.endsWith('.mp4')) {
    event.respondWith(
      caches.open(VIDEO_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          }).catch(() => {
            // Return offline page if network fails
            return caches.match('/offline')
          })
        })
      })
    )
    return
  }

  // Handle other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Try to serve from cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Return offline page as fallback
          return caches.match('/offline')
        })
      })
  )
})

// Background sync for content updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-content') {
    event.waitUntil(syncContent())
  }
})

async function syncContent() {
  try {
    const cache = await caches.open(VIDEO_CACHE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await fetch(request)
      if (response && response.status === 200) {
        await cache.put(request, response)
      }
    }
  } catch (error) {
    console.error('Sync failed:', error)
  }
}
