"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OfflineAuth } from "@/lib/offline-auth"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function TestOfflineAuthPage() {
  const [result, setResult] = useState<any>(null)

  const testCacheSession = () => {
    try {
      // Test session data
      const testSession = {
        userId: 'test123',
        role: 'student',
        name: 'Test User',
        email: 'test@example.com',
        schoolCode: 'TEST'
      }

      console.log('Attempting to cache test session:', testSession)
      
      // Cache session
      OfflineAuth.cacheSession(testSession)
      
      // Verify it was cached
      const cached = OfflineAuth.getCachedSession()
      const rawStorage = localStorage.getItem('edubridge_offline_session')
      
      setResult({
        success: cached !== null,
        cached: cached,
        raw: rawStorage,
        isBrowser: typeof window !== 'undefined',
        hasLocalStorage: typeof localStorage !== 'undefined'
      })
      
      console.log('Cache test result:', {
        success: cached !== null,
        cached,
        raw: rawStorage
      })
    } catch (error) {
      console.error('Test failed:', error)
      setResult({
        success: false,
        error: (error as Error).message
      })
    }
  }

  const clearSession = () => {
    try {
      OfflineAuth.clearSession()
      localStorage.removeItem('edubridge_offline_session')
      setResult(null)
      console.log('Session cleared')
    } catch (error) {
      console.error('Clear failed:', error)
    }
  }

  const checkExisting = () => {
    try {
      const session = OfflineAuth.getCachedSession()
      const raw = localStorage.getItem('edubridge_offline_session')
      
      setResult({
        hasSession: session !== null,
        session,
        raw,
        parsed: raw ? JSON.parse(raw) : null
      })
      
      console.log('Existing session check:', { session, raw })
    } catch (error) {
      console.error('Check failed:', error)
      setResult({
        hasSession: false,
        error: (error as Error).message
      })
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Offline Auth Test Page</h1>
          <p className="text-muted-foreground mb-6">
            Test if session caching is working correctly
          </p>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={testCacheSession} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Test Cache Session
            </Button>
            
            <Button onClick={checkExisting} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Check Existing Session
            </Button>
            
            <Button onClick={clearSession} variant="destructive" className="gap-2">
              <XCircle className="w-4 h-4" />
              Clear Session
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {result.success || result.hasSession ? (
                <span className="text-green-600">✅ Test Result</span>
              ) : (
                <span className="text-red-600">❌ Test Result</span>
              )}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">Environment:</p>
                <ul className="text-sm space-y-1">
                  <li>Browser: {result.isBrowser !== undefined ? (result.isBrowser ? '✅' : '❌') : 'Unknown'}</li>
                  <li>localStorage: {result.hasLocalStorage !== undefined ? (result.hasLocalStorage ? '✅' : '❌') : 'Unknown'}</li>
                </ul>
              </div>

              {result.cached && (
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold mb-2 text-green-700 dark:text-green-300">Cached Session:</p>
                  <pre className="text-xs overflow-auto bg-white dark:bg-black p-2 rounded">
                    {JSON.stringify(result.cached, null, 2)}
                  </pre>
                </div>
              )}

              {result.session && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Retrieved Session:</p>
                  <pre className="text-xs overflow-auto bg-white dark:bg-black p-2 rounded">
                    {JSON.stringify(result.session, null, 2)}
                  </pre>
                </div>
              )}

              {result.raw && (
                <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border">
                  <p className="font-semibold mb-2">Raw localStorage:</p>
                  <pre className="text-xs overflow-auto bg-white dark:bg-black p-2 rounded">
                    {result.raw}
                  </pre>
                </div>
              )}

              {result.error && (
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold mb-2 text-red-700 dark:text-red-300">Error:</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-muted">
          <h3 className="font-semibold mb-3">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test Cache Session" to create a test session</li>
            <li>Check the result to see if caching works</li>
            <li>Open browser DevTools → Application → Local Storage</li>
            <li>Look for key: <code className="bg-background px-2 py-1 rounded">edubridge_offline_session</code></li>
            <li>If you see the key with JSON data, caching is working!</li>
            <li>Click "Check Existing Session" to verify retrieval</li>
            <li>Click "Clear Session" to reset</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
