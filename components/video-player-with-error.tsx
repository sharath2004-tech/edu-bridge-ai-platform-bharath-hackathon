"use client"

import { Download, CheckCircle, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { offlineStorage } from "@/lib/offline-storage"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  courseId?: string
  lessonId?: string
}

export function VideoPlayerWithError({ videoUrl, title, courseId, lessonId }: VideoPlayerProps) {
  const [videoError, setVideoError] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [offlineUrl, setOfflineUrl] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  const videoId = `${courseId}-${lessonId}`

  useEffect(() => {
    checkOfflineAvailability()

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [videoId])

  const checkOfflineAvailability = async () => {
    if (courseId && lessonId) {
      try {
        const url = await offlineStorage.getVideoUrl(videoId)
        if (url) {
          setIsOfflineAvailable(true)
          setOfflineUrl(url)
        }
      } catch (error) {
        console.error('Error checking offline:', error)
      }
    }
  }

  const handleDownloadOffline = async () => {
    if (!courseId || !lessonId) {
      handleRegularDownload()
      return
    }

    setIsDownloading(true)

    try {
      const url = await offlineStorage.downloadVideo(videoUrl, {
        id: videoId,
        courseId,
        lessonId,
        title,
        fileUrl: videoUrl,
        downloadedAt: Date.now(),
      })

      setOfflineUrl(url)
      setIsOfflineAvailable(true)
      alert('✅ Video saved for offline viewing!')
    } catch (error) {
      console.error('Download failed:', error)
      alert('❌ Failed to download video.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleRegularDownload = async () => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title + '.' + (videoUrl.split('.').pop() || 'mp4')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      window.open(videoUrl, '_blank')
    }
  }

  const handleDeleteOffline = async () => {
    if (!courseId || !lessonId) return
    try {
      await offlineStorage.deleteVideo(videoId)
      setIsOfflineAvailable(false)
      setOfflineUrl(null)
      alert('✅ Offline video deleted')
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const currentVideoUrl = (!isOnline && offlineUrl) ? offlineUrl : videoUrl

  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    return (
      <div className="aspect-video">
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          className="w-full h-full"
          allowFullScreen
          title={title}
        />
      </div>
    )
  }

  if (videoUrl.endsWith('.pdf')) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-muted border rounded-lg overflow-hidden">
          <iframe src={videoUrl} className="w-full h-full" title={title} />
        </div>
        <Button onClick={handleRegularDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!isOnline && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-orange-600" />
          <span className="text-sm text-orange-700 dark:text-orange-300">
            {offlineUrl ? '✅ Playing from offline storage' : '⚠️ You are offline'}
          </span>
        </div>
      )}

      {!videoError && (
        <>
          <video 
            key={currentVideoUrl}
            controls 
            controlsList="nodownload"
            className="w-full rounded-lg bg-black"
            preload="metadata"
            onError={() => setVideoError(true)}
          >
            <source src={currentVideoUrl} type="video/mp4" />
            <source src={currentVideoUrl} type="video/webm" />
            <source src={currentVideoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          
          <div className="flex gap-2 flex-wrap">
            {isOfflineAvailable ? (
              <>
                <Button variant="outline" className="gap-2" disabled>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Available Offline
                </Button>
                <Button onClick={handleDeleteOffline} variant="destructive" size="sm">
                  Remove Offline
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleDownloadOffline} 
                className="gap-2"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download for Offline'}
              </Button>
            )}
            
            <Button onClick={handleRegularDownload} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Save to Device
            </Button>
          </div>
        </>
      )}
      
      {videoError && (
        <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Video Failed to Load</h3>
          {isOfflineAvailable ? (
            <Button onClick={() => window.location.reload()} className="mt-3">
              Try Offline Version
            </Button>
          ) : (
            <Button 
              onClick={handleDownloadOffline}
              className="mt-3 gap-2"
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              Download for Offline
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
