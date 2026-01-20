'use client'

import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

interface FileUploadInputProps {
  name: string
  accept: string
  maxSizeMB?: number
}

export function FileUploadInput({ name, accept, maxSizeMB = 10 }: FileUploadInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB. Please choose a smaller file or use a URL instead.`)
      e.target.value = ''
    }
  }

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-6 space-y-3 bg-muted/30">
      <div className="flex items-center gap-3">
        <Upload className="w-8 h-8 text-primary" />
        <div>
          <label className="text-sm font-semibold block">Upload File (Video, Audio, or PDF)</label>
          <p className="text-xs text-muted-foreground">Maximum file size: {maxSizeMB}MB</p>
        </div>
      </div>
      <Input 
        name={name}
        type="file" 
        accept={accept}
        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        onChange={handleFileChange}
      />
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        💡 Supported formats: MP4, WebM (video) • MP3, WAV (audio) • PDF (documents)
      </p>
      <p className="text-xs text-orange-600">
        ⚠️ For files larger than {maxSizeMB}MB, please use the URL option below
      </p>
    </div>
  )
}