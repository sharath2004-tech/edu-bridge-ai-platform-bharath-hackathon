"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, Download, FileDown, FileText, Music, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

type ContentItem = {
  _id: string
  title: string
  type: string
  description?: string
  url?: string
  text?: string
}

export default function StudentSectionPage({ params }: { params: { sectionId: string } }) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    fetchContent()
    fetchDownloadedContent()
  }, [params.sectionId])

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?section=${params.sectionId}`, { cache: "no-store" })
      const data = res.ok ? await res.json() : { data: [] }
      setItems(data.data ?? [])
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDownloadedContent = async () => {
    try {
      const res = await fetch('/api/student/offline-content')
      if (res.ok) {
        const data = await res.json()
        // Create a Set of content IDs that are downloaded
        const downloaded = new Set(data.data.map((d: any) => d.contentId || d.fileName))
        setDownloadedIds(downloaded)
      }
    } catch (error) {
      console.error('Error fetching downloaded content:', error)
    }
  }

  const handleDownload = async (item: ContentItem) => {
    if (!item.url) {
      alert('No downloadable content available')
      return
    }

    setDownloadingIds(prev => new Set(prev).add(item._id))

    try {
      // Cache the content for offline access
      if ('caches' in window) {
        const cache = await caches.open('content-cache')
        await cache.add(item.url)
      }

      // Get file size
      let fileSize = 0
      try {
        const response = await fetch(item.url, { method: 'HEAD' })
        fileSize = parseInt(response.headers.get('content-length') || '0')
      } catch (e) {
        // If HEAD fails, estimate based on type
        fileSize = item.type === 'video' ? 10000000 : item.type === 'pdf' ? 500000 : 100000
      }

      // Save to offline content database
      const saveRes = await fetch('/api/student/offline-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: null,
          contentId: item._id,
          lessonId: params.sectionId,
          contentType: item.type,
          fileName: item.title,
          fileSize: fileSize,
          fileUrl: item.url
        })
      })

      if (saveRes.ok) {
        setDownloadedIds(prev => new Set(prev).add(item._id))
        alert('Content downloaded successfully! Available in Downloads section.')
      } else {
        const errorData = await saveRes.json()
        throw new Error(errorData.error || 'Failed to save download record')
      }
    } catch (error) {
      console.error('Error downloading content:', error)
      alert(`Failed to download content: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(item._id)
        return newSet
      })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5 text-primary" />
      case "audio": return <Music className="w-5 h-5 text-primary" />
      case "pdf": return <FileDown className="w-5 h-5 text-primary" />
      default: return <FileText className="w-5 h-5 text-primary" />
    }
  }

  const canDownload = (item: ContentItem) => {
    return item.url && ['video', 'audio', 'pdf'].includes(item.type)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Section Content</h1>
          <p className="text-sm text-muted-foreground">Materials assigned to this section</p>
        </div>
        <Button 
          onClick={() => router.push('/student/downloads')} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          View Downloads
        </Button>
      </div>
      <Separator />
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No content available for this section.</div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => {
            const isDownloaded = downloadedIds.has(item._id)
            const isDownloading = downloadingIds.has(item._id)

            return (
              <Card key={item._id} className="p-4 border border-border">\n                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
                      {item.type}
                    </span>
                    {canDownload(item) && (
                      <Button
                        onClick={() => handleDownload(item)}
                        disabled={isDownloading || isDownloaded}
                        size="sm"
                        variant={isDownloaded ? "secondary" : "default"}
                        className="gap-1"
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : isDownloaded ? (
                          <>
                            <Check className="w-3 h-3" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            Save
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                
                {/* Video Player */}
                {item.type === "video" && item.url && (
                  <video controls className="w-full rounded-lg mt-2">
                    <source src={item.url} />
                    Your browser does not support video playback.
                  </video>
                )}
                
                {/* Audio Player */}
                {item.type === "audio" && item.url && (
                  <audio controls className="w-full mt-2">
                    <source src={item.url} />
                    Your browser does not support audio playback.
                  </audio>
                )}
                
                {/* PDF Link */}
                {item.type === "pdf" && item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-sm text-primary underline hover:text-primary/80 mt-2"
                  >
                    <FileDown className="w-4 h-4" />
                    View PDF
                  </a>
                )}
                
                {/* Text Content */}
                {item.type === "text" && item.text && (
                  <div className="text-sm mt-2 p-3 bg-muted rounded-lg">{item.text}</div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
