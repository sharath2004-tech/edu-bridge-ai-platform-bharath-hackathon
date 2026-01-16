"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lessons, setLessons] = useState([{ title: "", description: "", content: "", videoUrl: "", duration: 0 }])
  const [sections, setSections] = useState<any[]>([])
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections')
      if (res.ok) {
        const data = await res.json()
        setSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const addLesson = () => {
    setLessons([...lessons, { title: "", description: "", content: "", videoUrl: "", duration: 0 }])
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
  }

  const updateLesson = (index: number, field: string, value: any) => {
    const updated = [...lessons]
    updated[index] = { ...updated[index], [field]: value }
    setLessons(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Upload thumbnail if exists
      let thumbnail = ""
      const thumbnailFile = (window as any).thumbnailFile
      if (thumbnailFile) {
        const thumbFormData = new FormData()
        thumbFormData.append('file', thumbnailFile)
        
        const thumbRes = await fetch('/api/upload', {
          method: 'POST',
          body: thumbFormData,
        })
        
        if (thumbRes.ok) {
          const thumbData = await thumbRes.json()
          thumbnail = thumbData.url
        }
      }
      
      // Upload files for lessons that have them
      const processedLessons = await Promise.all(
        lessons.map(async (lesson, idx) => {
          let videoUrl = lesson.videoUrl
          
          // If lesson has a file, upload it
          if ((lesson as any).file) {
            const fileFormData = new FormData()
            fileFormData.append('file', (lesson as any).file)
            
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: fileFormData,
            })
            
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              videoUrl = uploadData.url
            }
          }
          
          return {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl,
            duration: lesson.duration,
            order: idx
          }
        })
      )
      
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        level: formData.get("level"),
        price: Number(formData.get("price")),
        duration: Number(formData.get("duration")),
        lessons: processedLessons,
        status: formData.get("status") || "draft",
        thumbnail,
        sections: selectedSections,
      }

      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/teacher/courses")
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to create course")
      }
    } catch (error) {
      alert("Error creating course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-muted-foreground">Design and publish your course content</p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Course Title *</label>
            <Input name="title" placeholder="e.g., Introduction to JavaScript" required />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description *</label>
            <Textarea 
              name="description" 
              placeholder="Describe what students will learn..." 
              rows={4}
              required 
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Course Thumbnail</label>
            {thumbnailPreview && (
              <div className="mb-3 relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setThumbnailPreview(null)
                    ;(window as any).thumbnailFile = null
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    (window as any).thumbnailFile = file
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setThumbnailPreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Click to upload thumbnail</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <Input name="category" placeholder="e.g., Programming" required />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level *</label>
              <select name="level" className="w-full px-4 py-2 border rounded-lg" required>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price (USD)</label>
              <Input name="price" type="number" min="0" step="0.01" defaultValue="0" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input name="duration" type="number" min="0" defaultValue="0" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select name="status" className="w-full px-4 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Assign to Sections (optional)</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {sections.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sections available</p>
              ) : (
                sections.map((section) => (
                  <label key={section._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSections([...selectedSections, section._id])
                        } else {
                          setSelectedSections(selectedSections.filter(id => id !== section._id))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{section.name}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Students in selected sections will see this course</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Lessons</h3>
            <Button type="button" onClick={addLesson} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </div>

          {lessons.map((lesson, idx) => (
            <Card key={idx} className="p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Lesson {idx + 1}</h4>
                {lessons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLesson(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <Input
                placeholder="Lesson title"
                value={lesson.title}
                onChange={(e) => updateLesson(idx, "title", e.target.value)}
                required
              />

              <Textarea
                placeholder="Lesson description"
                value={lesson.description}
                onChange={(e) => updateLesson(idx, "description", e.target.value)}
                rows={2}
              />

              <Textarea
                placeholder="Lesson content"
                value={lesson.content}
                onChange={(e) => updateLesson(idx, "content", e.target.value)}
                rows={4}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Video/PDF URL or Upload File</label>
                <Input
                  placeholder="Paste URL (e.g., YouTube link, PDF link)"
                  value={lesson.videoUrl}
                  onChange={(e) => updateLesson(idx, "videoUrl", e.target.value)}
                />
                <div className="mt-3 border-2 border-dashed border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <input
                        id={`lesson-file-${idx}`}
                        type="file"
                        accept="video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            updateLesson(idx, "file", file)
                            updateLesson(idx, "fileName", file.name)
                          }
                        }}
                      />
                      <label htmlFor={`lesson-file-${idx}`} className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            {(lesson as any).fileName || "Choose File"}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Video, Audio, PDF, Word, PowerPoint (Max 50MB)
                      </p>
                    </div>
                    {(lesson as any).fileName && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateLesson(idx, "file", null)
                          updateLesson(idx, "fileName", "")
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={lesson.duration}
                onChange={(e) => updateLesson(idx, "duration", Number(e.target.value))}
              />
            </Card>
          ))}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
