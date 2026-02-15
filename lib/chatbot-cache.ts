/**
 * Simple in-memory cache for chatbot database queries
 * Reduces database load for frequently accessed data
 */

interface CacheEntry {
  data: any
  timestamp: number
}

class ChatbotCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly TTL = 5 * 60 * 1000 // 5 minutes

  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clear(): void {
    this.cache.clear()
  }

  // Clear specific pattern keys
  clearPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

export const chatbotCache = new ChatbotCache()
