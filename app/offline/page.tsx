"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, Video, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function OfflinePage() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      // Auto reload when back online
      setTimeout(() => window.location.reload(), 1000)
    }
    
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const goToOfflineVideos = () => {
    router.push('/student/offline-videos')
  }

  const retry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-muted/50 to-background">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
          <p className="text-muted-foreground">
            {isOnline 
              ? "Connection restored! Refreshing..."
              : "No internet connection. But you can still watch your downloaded videos!"
            }
          </p>
        </div>

        {!isOnline && (
          <div className="space-y-3">
            <Button onClick={goToOfflineVideos} className="w-full gap-2" size="lg">
              <Video className="w-5 h-5" />
              View Offline Videos
            </Button>

            <Button onClick={retry} className="w-full gap-2" variant="outline">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {isOnline && (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Reconnecting...</span>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Download videos when you have internet to watch them later offline
          </p>
        </div>
      </Card>
    </div>
  )
}
