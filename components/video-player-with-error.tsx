"use client"

import { FileText } from "lucide-react"
import { useState } from "react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
}

export function VideoPlayerWithError({ videoUrl, title }: VideoPlayerProps) {
  const [videoError, setVideoError] = useState(false)

  // Handle YouTube videos
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

  // Handle PDF files
  if (videoUrl.endsWith('.pdf')) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <FileText className="w-16 h-16 mx-auto text-primary" />
          <div>
            <h3 className="font-semibold mb-2">PDF Document</h3>
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open PDF in New Tab
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Handle regular video files
  return (
    <div className="space-y-2">
      {!videoError && (
        <video 
          controls 
          className="w-full bg-black" 
          onError={(e) => {
            console.error('Video failed to load:', videoUrl)
            setVideoError(true)
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {videoError && (
        <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Video Failed to Load</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            The video file could not be loaded. This may happen if:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 ml-4 list-disc space-y-1 mb-3">
            <li>The file was uploaded on Vercel (files don't persist)</li>
            <li>The video URL is invalid or inaccessible</li>
            <li>The file format is not supported</li>
          </ul>
          <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border">
            <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-400">
              Video URL: {videoUrl}
            </p>
          </div>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
          >
            Try opening directly
          </a>
        </div>
      )}
    </div>
  )
}
