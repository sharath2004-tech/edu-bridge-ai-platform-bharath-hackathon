'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileUploadInput } from "@/components/file-upload-input"
import { Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface UploadFormProps {
  sections: { _id: string; name: string }[]
}

export function UploadForm({ sections }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/teacher/upload-content', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Reset form and refresh page
      e.currentTarget.reset()
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        Upload Multimedia Content
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload videos, audio files, PDFs, or add text content to your sections
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Title *</label>
            <Input name="title" placeholder="e.g., Introduction to Mathematics" required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Type *</label>
            <select name="type" className="w-full px-4 py-2 border border-border rounded-lg bg-background" required>
              <option value="video">📹 Video</option>
              <option value="audio">🎵 Audio</option>
              <option value="pdf">📄 PDF Document</option>
              <option value="text">📝 Text</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input name="description" placeholder="Brief description of the content" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Assign to Section *</label>
          <select name="section" className="w-full px-4 py-2 border border-border rounded-lg bg-background" required>
            {sections.length === 0 ? (
              <option value="">⚠️ No sections available - Create one first</option>
            ) : (
              <>
                <option value="">-- Select a section --</option>
                {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </>
            )}
          </select>
        </div>

        <FileUploadInput 
          name="file" 
          accept="video/*,audio/*,application/pdf" 
          maxSizeMB={10} 
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Or Enter File URL</label>
          <Input name="url" placeholder="https://example.com/video.mp4" />
          <p className="text-xs text-muted-foreground">If file is already hosted, paste URL here instead of uploading</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Content (for Text type only)</label>
          <textarea 
            name="text" 
            placeholder="Enter your text content here..."
            className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>
        
        <Button type="submit" className="w-full" size="lg" disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload and Save Content'}
        </Button>
      </form>
    </Card>
  )
}