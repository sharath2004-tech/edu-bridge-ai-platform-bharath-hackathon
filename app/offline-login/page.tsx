"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OfflineAuth } from "@/lib/offline-auth"
import { LogIn, User, Video, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function OfflineLoginPage() {
  const router = useRouter()
  const [cachedSession, setCachedSession] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    // Get cached session with debug info
    try {
      const session = OfflineAuth.getCachedSession()
      setCachedSession(session)
      
      // Check raw localStorage
      const rawSession = localStorage.getItem('edubridge_offline_session')
      console.log('Raw localStorage:', rawSession)
      console.log('Parsed session:', session)
      
      if (!session && rawSession) {
        setDebugInfo('Session exists in storage but failed to parse')
      } else if (session) {
        setDebugInfo('Session found and valid')
      } else {
        setDebugInfo('No session found in localStorage')
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setDebugInfo('Error: ' + (error as Error).message)
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      // Redirect to regular login when back online
      setTimeout(() => router.push('/login'), 1000)
    }
    
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  const handleOfflineLogin = () => {
    if (!cachedSession) {
      alert('No cached session found. Please login when online first.')
      return
    }

    console.log('🚀 Offline login - Redirecting to offline videos')
    console.log('Session:', cachedSession)

    // For offline access, use window.location.href for better reliability
    if (cachedSession.role === 'student') {
      // Students go to offline videos
      console.log('Navigating to: /student/offline-videos')
      window.location.href = '/student/offline-videos'
    } else {
      // Other roles go to their dashboard
      const dashboardUrl = OfflineAuth.getDashboardUrl(cachedSession.role)
      console.log('Navigating to:', dashboardUrl)
      window.location.href = dashboardUrl
    }
  }

  const goToRegularLogin = () => {
    router.push('/login')
  }

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
            <LogIn className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">You're Online!</h1>
            <p className="text-muted-foreground">
              Connection detected. Redirecting to login page...
            </p>
          </div>

          <Button onClick={goToRegularLogin} className="w-full" size="lg">
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-orange-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Offline Mode</h1>
          <p className="text-muted-foreground">
            ✅ You can access your downloaded content while offline
          </p>
        </div>

        {cachedSession ? (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                ✅ Session Found! You're logged in offline.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg text-left">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{cachedSession.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{cachedSession.role}</p>
                </div>
              </div>
              {cachedSession.email && (
                <p className="text-xs text-muted-foreground mt-2">{cachedSession.email}</p>
              )}
              {cachedSession.cachedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last online: {new Date(cachedSession.cachedAt).toLocaleDateString()} at {new Date(cachedSession.cachedAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={handleOfflineLogin} className="w-full gap-2" size="lg">
                <Video className="w-5 h-5" />
                Access Offline Videos
              </Button>
              
              {/* Direct link as fallback */}
              <a href="/student/offline-videos" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Video className="w-4 h-4" />
                  Go to Offline Videos (Direct Link)
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              Session expires: {new Date(cachedSession.expiresAt).toLocaleDateString()}
            </p>
            
            {debugInfo && (
              <p className="text-xs text-blue-600">Debug: {debugInfo}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ No cached session found
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                You need to login with internet connection at least once before offline access is available.
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg text-left">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                📝 How to enable offline access:
              </p>
              <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                <li>Connect to the internet</li>
                <li>Login to EduBridge AI</li>
                <li>Your session will be cached automatically</li>
                <li>Go offline and return to this page</li>
              </ol>
            </div>
            
            {debugInfo && (
              <div className="p-3 bg-muted rounded text-xs font-mono">
                <p className="font-semibold mb-1">Debug Info:</p>
                <p>{debugInfo}</p>
                <p className="mt-2">Check browser console for more details</p>
              </div>
            )}

            <Button onClick={goToRegularLogin} className="w-full" variant="outline">
              Try Regular Login
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Login when you have internet to cache your session for offline access
          </p>
        </div>
      </Card>
    </div>
  )
}
