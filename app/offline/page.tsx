"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, RefreshCw, WifiOff } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-muted/50 to-background">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
          <p className="text-muted-foreground">
            No internet connection detected. You can still access your downloaded content.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/student/downloads">
            <Button className="w-full" variant="default">
              View Downloads
            </Button>
          </Link>

          <Button onClick={handleRefresh} className="w-full" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link href="/student/dashboard">
            <Button className="w-full" variant="ghost">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            Downloaded content is available in the Downloads section. 
            Connect to the internet to access new content.
          </p>
        </div>
      </Card>
    </div>
  )
}
