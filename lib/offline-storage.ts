/**
 * Offline Video Storage using IndexedDB
 * Stores videos locally so students can watch them offline
 */

const DB_NAME = 'EduBridgeOffline'
const DB_VERSION = 1
const STORE_NAME = 'videos'

interface StoredVideo {
  id: string
  courseId: string
  lessonId: string
  title: string
  blob: Blob
  fileUrl: string
  downloadedAt: number
  size: number
}

class OfflineStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('courseId', 'courseId', { unique: false })
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false })
        }
      }
    })
  }

  async saveVideo(video: StoredVideo): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(video)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getVideo(id: string): Promise<StoredVideo | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllVideos(): Promise<StoredVideo[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteVideo(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getTotalSize(): Promise<number> {
    const videos = await this.getAllVideos()
    return videos.reduce((total, video) => total + video.size, 0)
  }

  async downloadVideo(url: string, videoInfo: Omit<StoredVideo, 'blob' | 'size'>): Promise<string> {
    try {
      console.log('📥 Downloading video for offline use:', url)
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch video')
      
      const blob = await response.blob()
      
      const video: StoredVideo = {
        ...videoInfo,
        blob,
        size: blob.size,
      }

      await this.saveVideo(video)
      
      // Return blob URL for immediate playback
      const blobUrl = URL.createObjectURL(blob)
      console.log('✅ Video saved offline, size:', (blob.size / 1024 / 1024).toFixed(2), 'MB')
      
      return blobUrl
    } catch (error) {
      console.error('❌ Failed to download video:', error)
      throw error
    }
  }

  async getVideoUrl(id: string): Promise<string | null> {
    const video = await this.getVideo(id)
    if (!video) return null
    
    return URL.createObjectURL(video.blob)
  }
}

export const offlineStorage = new OfflineStorage()

// Helper function to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
