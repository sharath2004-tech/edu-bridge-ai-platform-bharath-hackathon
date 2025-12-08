"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    CheckCircle,
    Download,
    Loader2,
    Maximize,
    Pause,
    Play,
    Volume2,
    VolumeX,
    WifiOff
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

type VideoPlayerProps = {
  videoUrl: string
  title: string
  lessonId?: string
  courseId?: string
  onProgress?: (progress: number) => void
}

export function VideoPlayer({ videoUrl, title, lessonId, courseId, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    checkOfflineStatus()
    checkIfDownloaded()
    
    window.addEventListener('online', () => setIsOffline(false))
    window.addEventListener('offline', () => setIsOffline(true))
    
    return () => {
      window.removeEventListener('online', () => setIsOffline(false))
      window.removeEventListener('offline', () => setIsOffline(true))
    }
  }, [])

  const checkOfflineStatus = () => {
    setIsOffline(!navigator.onLine)
  }

  const checkIfDownloaded = async () => {
    if ('caches' in window && courseId && lessonId) {
      const cache = await caches.open('video-cache')
      const response = await cache.match(videoUrl)
      setIsDownloaded(!!response)
    }
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    
    if (duration > 0 && onProgress) {
      const progress = (videoRef.current.currentTime / duration) * 100
      onProgress(progress)
    }
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const vol = parseFloat(e.target.value)
    videoRef.current.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const downloadVideo = async () => {
    if (!('caches' in window)) {
      alert('Offline downloads not supported in this browser')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      const response = await fetch(videoUrl)
      const reader = response.body?.getReader()
      const contentLength = parseInt(response.headers.get('Content-Length') || '0')
      
      let receivedLength = 0
      const chunks = []

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          chunks.push(value)
          receivedLength += value.length
          
          const progress = (receivedLength / contentLength) * 100
          setDownloadProgress(progress)
        }
      }

      const blob = new Blob(chunks)
      const cache = await caches.open('video-cache')
      const cachedResponse = new Response(blob, {
        headers: { 'Content-Type': 'video/mp4' }
      })
      
      await cache.put(videoUrl, cachedResponse)
      
      // Save metadata
      await fetch('/api/student/offline-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonId,
          contentType: 'video',
          fileName: title,
          fileSize: contentLength
        })
      })

      setIsDownloaded(true)
      setDownloadProgress(100)
      
      // Award XP for downloading content
      await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download_content',
          xpAmount: 5
        })
      })
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black aspect-video group">
        {isOffline && !isDownloaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
            <WifiOff className="w-16 h-16 text-white mb-4" />
            <p className="text-white text-lg">You're offline</p>
            <p className="text-white/70 text-sm">Download this video to watch offline</p>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 mb-3 accent-primary cursor-pointer"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={handlePlayPause} className="text-white hover:text-primary transition">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-primary transition">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 accent-primary cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleFullscreen} className="text-white hover:text-primary transition">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {isDownloaded ? 'Available offline' : 'Download to watch offline'}
            </p>
          </div>

          {isDownloaded ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="w-4 h-4" />
              Downloaded
            </Badge>
          ) : isDownloading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{Math.round(downloadProgress)}%</span>
            </div>
          ) : (
            <Button onClick={downloadVideo} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {isDownloading && (
          <Progress value={downloadProgress} className="mt-3" />
        )}
      </div>
    </Card>
  )
}
