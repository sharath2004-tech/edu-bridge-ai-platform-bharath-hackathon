"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VideoPlayerWithError } from "@/components/video-player-with-error"
import { formatBytes, offlineStorage } from "@/lib/offline-storage"
import {
    Download,
    HardDrive,
    Play,
    Search,
    Trash2,
    Video,
    WifiOff,
    X
} from "lucide-react"
import { useEffect, useState } from "react"

type StoredVideo = {
  id: string
  courseId: string
  lessonId: string
  title: string
  fileUrl: string
  downloadedAt: number
  size: number
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<StoredVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalSize, setTotalSize] = useState(0)
  const [playingVideo, setPlayingVideo] = useState<StoredVideo | null>(null)
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    loadOfflineVideos()

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineVideos = async () => {
    try {
      setLoading(true)
      const videos = await offlineStorage.getAllVideos()
      setDownloads(videos)
      
      const total = await offlineStorage.getTotalSize()
      setTotalSize(total)
    } catch (error) {
      console.error('Error loading offline videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video from offline storage?')) return

    try {
      await offlineStorage.deleteVideo(id)
      await loadOfflineVideos()
      alert('✅ Video deleted')
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('❌ Failed to delete video')
    }
  }

  const clearAllDownloads = async () => {
    if (!confirm('Delete ALL offline videos? This cannot be undone.')) return

    try {
      for (const video of downloads) {
        await offlineStorage.deleteVideo(video.id)
      }
      await loadOfflineVideos()
      alert('✅ All videos deleted')
    } catch (error) {
      console.error('Error clearing downloads:', error)
      alert('❌ Failed to clear downloads')
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredDownloads = downloads.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Download className="w-8 h-8" />
            Offline Downloads
          </h1>
          <p className="text-muted-foreground">Watch videos without internet</p>
        </div>
        
        {!isOnline && (
          <Badge variant="outline" className="gap-2 py-2 px-4">
            <WifiOff className="w-4 h-4" />
            Offline Mode
          </Badge>
        )}
      </div>

      {/* Stats Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Videos</p>
              <p className="text-2xl font-bold">{downloads.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <HardDrive className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            {downloads.length > 0 && (
              <Button 
                onClick={clearAllDownloads} 
                variant="destructive" 
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <WifiOff className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Offline Access Available</p>
            <p>Downloaded videos are stored in your browser and can be watched without internet connection. Perfect for studying on the go!</p>
          </div>
        </div>
      </Card>

      {/* Search */}
      {downloads.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search downloaded videos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{playingVideo.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPlayingVideo(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <VideoPlayerWithError
                videoUrl={playingVideo.fileUrl}
                title={playingVideo.title}
                courseId={playingVideo.courseId}
                lessonId={playingVideo.lessonId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Downloads List */}
      {filteredDownloads.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Offline Videos</h3>
          <p className="text-muted-foreground mb-4">
            {downloads.length === 0
              ? 'Download videos from lessons to watch them offline'
              : 'No videos match your search'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDownloads.map((video) => (
            <Card key={video.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate">{video.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatBytes(video.size)}
                    </span>
                    <span>•</span>
                    <span>Downloaded {formatDate(video.downloadedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => setPlayingVideo(video)}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </Button>
                  <Button
                    onClick={() => handleDelete(video.id)}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
