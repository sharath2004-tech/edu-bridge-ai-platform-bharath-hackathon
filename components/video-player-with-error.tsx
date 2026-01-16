"use client"

import { offlineStorage } from "@/lib/offline-storage"
import { CheckCircle, Download, WifiOff, Maximize2, Minimize2, Monitor } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Button } from "./ui/button"

type VideoSize = 'small' | 'medium' | 'large' | 'full'

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
  const [videoSize, setVideoSize] = useState<VideoSize>('medium')
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoId = `${courseId}-${lessonId}`

  // Size configurations
  const sizeClasses = {
    small: 'max-w-md',    // ~448px
    medium: 'max-w-2xl',  // ~672px
    large: 'max-w-4xl',   // ~896px
    full: 'w-full'        // 100%
  }

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

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (error) {
      console.error('PiP failed:', error)
    }
  }

  const cycleSize = () => {
    const sizes: VideoSize[] = ['small', 'medium', 'large', 'full']
    const currentIndex = sizes.indexOf(videoSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setVideoSize(sizes[nextIndex])
  }

  const currentVideoUrl = (!isOnline && offlineUrl) ? offlineUrl : videoUrl

  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Video Size: {videoSize}</span>
          <Button onClick={cycleSize} variant="outline" size="sm" className="gap-2">
            <Maximize2 className="w-4 h-4" />
            Resize ({videoSize})
          </Button>
        </div>
        <div className={`${sizeClasses[videoSize]} mx-auto aspect-video`}>
          <iframe
            src={videoUrl.replace('watch?v=', 'embed/')}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title={title}
          />
        </div>
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
      {/* Size Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Video Size:</span>
          <div className="flex gap-1">
            <Button 
              onClick={() => setVideoSize('small')} 
              variant={videoSize === 'small' ? 'default' : 'outline'}
              size="sm"
            >
              Small
            </Button>
            <Button 
              onClick={() => setVideoSize('medium')} 
              variant={videoSize === 'medium' ? 'default' : 'outline'}
              size="sm"
            >
              Medium
            </Button>
            <Button 
              onClick={() => setVideoSize('large')} 
              variant={videoSize === 'large' ? 'default' : 'outline'}
              size="sm"
            >
              Large
            </Button>
            <Button 
              onClick={() => setVideoSize('full')} 
              variant={videoSize === 'full' ? 'default' : 'outline'}
              size="sm"
            >
              Full
            </Button>
          </div>
        </div>
        
        <Button onClick={togglePictureInPicture} variant="outline" size="sm" className="gap-2">
          <Monitor className="w-4 h-4" />
          Picture-in-Picture
        </Button>
      </div>

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
          <div className={`${sizeClasses[videoSize]} mx-auto`}>
            <video 
              ref={videoRef}
              key={currentVideoUrl}
              controls 
              controlsList="nodownload"
              className="w-full rounded-lg bg-black shadow-lg"
              preload="metadata"
              onError={() => setVideoError(true)}
            >
              <source src={currentVideoUrl} type="video/mp4" />
              <source src={currentVideoUrl} type="video/webm" />
              <source src={currentVideoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
          
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
