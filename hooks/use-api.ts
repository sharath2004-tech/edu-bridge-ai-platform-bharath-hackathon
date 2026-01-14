'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ApiResponse } from '@/types'

interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: () => Promise<void>
  reset: () => void
}

export function useApi<T>(
  fetchFn: () => Promise<Response>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { immediate = true, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetchFn()
      const json: ApiResponse<T> = await res.json()
      
      if (!res.ok || !json.success) {
        const errorMsg = json.error || 'Request failed'
        setError(errorMsg)
        onError?.(errorMsg)
        return
      }
      
      setData(json.data ?? null)
      onSuccess?.(json.data as T)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { data, loading, error, execute, reset }
}

// Mutation hook for POST/PUT/DELETE operations
interface UseMutationOptions<T, P> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

interface UseMutationReturn<T, P> {
  data: T | null
  loading: boolean
  error: string | null
  mutate: (payload: P) => Promise<T | null>
  reset: () => void
}

export function useMutation<T, P = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options: UseMutationOptions<T, P> = {}
): UseMutationReturn<T, P> {
  const { onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (payload: P): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      
      const json: ApiResponse<T> = await res.json()
      
      if (!res.ok || !json.success) {
        const errorMsg = json.error || 'Request failed'
        setError(errorMsg)
        onError?.(errorMsg)
        return null
      }
      
      setData(json.data ?? null)
      onSuccess?.(json.data as T)
      return json.data ?? null
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error'
      setError(errorMsg)
      onError?.(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [url, method, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, mutate, reset }
}

// Session hook
interface SessionData {
  id: string
  role: string
  name: string
  email: string
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Parse session from cookie on client side
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift()
      }
      return undefined
    }

    try {
      const sessionCookie = getCookie('edubridge_session')
      if (sessionCookie) {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie))
        setSession(parsed)
      }
    } catch {
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setSession(null)
    window.location.href = '/login'
  }, [])

  return { session, loading, logout }
}
