"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Download,
    FileText,
    HardDrive,
    Search,
    Trash2,
    Video,
    WifiOff
} from "lucide-react"
import { useEffect, useState } from "react"

type OfflineContent = {
  _id: string
  course: {
    _id: string
    title: string
    thumbnail?: string
  }
  contentType: 'video' | 'pdf' | 'notes' | 'quiz'
  fileName: string
  fileSize: number
  downloadedAt: string
  lastAccessedAt: string
  syncStatus: 'pending' | 'synced' | 'outdated'
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<OfflineContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalSize, setTotalSize] = useState(0)

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const res = await fetch('/api/student/offline-content')
      if (res.ok) {
        const data = await res.json()
        setDownloads(data.data)
        
        const total = data.data.reduce((sum: number, item: OfflineContent) => sum + item.fileSize, 0)
        setTotalSize(total)
      }
    } catch (error) {
      console.error('Error fetching downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this download?')) return

    try {
      const res = await fetch(`/api/student/offline-content?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDownloads(downloads.filter(d => d._id !== id))
        
        // Clear from cache
        if ('caches' in window) {
          const cache = await caches.open('video-cache')
          const keys = await cache.keys()
          for (const request of keys) {
            if (request.url.includes(id)) {
              await cache.delete(request)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error deleting download:', error)
    }
  }

  const clearAllCache = async () => {
    if (!confirm('Clear all downloads? This cannot be undone.')) return

    try {
      if ('caches' in window) {
        await caches.delete('video-cache')
      }

      for (const download of downloads) {
        await fetch(`/api/student/offline-content?id=${download._id}`, {
          method: 'DELETE'
        })
      }

      setDownloads([])
      setTotalSize(0)
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />
      case 'pdf': return <FileText className="w-5 h-5" />
      default: return <Download className="w-5 h-5" />
    }
  }

  const filteredDownloads = downloads.filter(d =>
    d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.course.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Download className="w-8 h-8" />
            Downloads
          </h1>
          <p className="text-muted-foreground">Manage your offline content</p>
        </div>

        <Button onClick={clearAllCache} variant="outline" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Storage Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-900 mb-1">Total Downloads</p>
              <p className="text-2xl font-bold text-blue-600">{downloads.length}</p>
            </div>
            <Download className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-900 mb-1">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600">{formatSize(totalSize)}</p>
            </div>
            <HardDrive className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-900 mb-1">Offline Mode</p>
              <p className="text-lg font-bold text-green-600">
                {navigator.onLine ? 'Online' : 'Offline'}
              </p>
            </div>
            <WifiOff className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search downloads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Downloads List */}
      <div className="space-y-3">
        {filteredDownloads.length === 0 ? (
          <Card className="p-12 text-center">
            <Download className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No downloads yet</p>
            <p className="text-sm text-muted-foreground">
              Download videos and content to access them offline
            </p>
          </Card>
        ) : (
          filteredDownloads.map((download, i) => (
            <Card
              key={download._id}
              className="p-4 hover:shadow-md transition-all animate-slideInLeft"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {getIcon(download.contentType)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{download.fileName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{download.course.title}</p>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{formatSize(download.fileSize)}</span>
                      <span>•</span>
                      <span>Downloaded {new Date(download.downloadedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge variant={download.syncStatus === 'synced' ? 'default' : 'secondary'} className="text-xs">
                        {download.syncStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDelete(download._id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
