"use client"

// Offline authentication manager
// Stores user session in localStorage for offline access

export interface OfflineSession {
  userId: string
  role: string
  name: string
  email?: string
  schoolCode?: string
  cachedAt: number
  expiresAt: number
}

const STORAGE_KEY = 'edubridge_offline_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export class OfflineAuth {
  /**
   * Cache user session for offline access
   */
  static cacheSession(session: Omit<OfflineSession, 'cachedAt' | 'expiresAt'>): void {
    try {
      const offlineSession: OfflineSession = {
        ...session,
        cachedAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineSession))
      console.log('✅ Session cached for offline access')
    } catch (error) {
      console.error('Failed to cache session:', error)
    }
  }

  /**
   * Get cached session if available and valid
   */
  static getCachedSession(): OfflineSession | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const session: OfflineSession = JSON.parse(stored)
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get cached session:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated (online or offline)
   */
  static isAuthenticated(): boolean {
    // Check online session first (cookie)
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('edubridge_session='))
      
      if (cookie) return true
    }

    // Check offline cached session
    return this.getCachedSession() !== null
  }

  /**
   * Clear cached session
   */
  static clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('✅ Offline session cleared')
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  /**
   * Check if currently offline
   */
  static isOffline(): boolean {
    return typeof navigator !== 'undefined' && !navigator.onLine
  }

  /**
   * Get user role (from cookie or cached session)
   */
  static getUserRole(): string | null {
    // Try online session first
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('edubridge_session='))
      
      if (cookie) {
        try {
          const value = cookie.split('=')[1]
          const session = JSON.parse(decodeURIComponent(value))
          return session.role
        } catch {
          // Continue to offline check
        }
      }
    }

    // Try offline session
    const cachedSession = this.getCachedSession()
    return cachedSession?.role || null
  }

  /**
   * Get dashboard URL for user role
   */
  static getDashboardUrl(role?: string): string {
    const userRole = role || this.getUserRole()
    
    switch (userRole) {
      case 'super-admin':
        return '/super-admin/dashboard'
      case 'admin':
        return '/admin/dashboard'
      case 'principal':
        return '/principal/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/login'
    }
  }

  /**
   * Check if user can access offline content
   */
  static canAccessOffline(): boolean {
    return this.isOffline() && this.getCachedSession() !== null
  }
}
