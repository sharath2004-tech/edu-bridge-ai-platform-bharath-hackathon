"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data.data)
        setLessons(data.data.lessons || [])
        setThumbnailPreview(data.data.thumbnail || "")
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Upload thumbnail if changed
      let thumbnail = thumbnailPreview
      if ((window as any).thumbnailFile) {
        const thumbFormData = new FormData()
        thumbFormData.append('file', (window as any).thumbnailFile)
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: thumbFormData,
        })
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          thumbnail = uploadData.url
        }
      }

      // Process lessons with file uploads
      const processedLessons = await Promise.all(
        lessons.map(async (lesson, idx) => {
          let videoUrl = lesson.videoUrl || ""
          
          // If lesson has a new file, upload it
          if ((lesson as any).file) {
            console.log(`Uploading video for lesson ${idx + 1}:`, (lesson as any).file.name)
            const fileFormData = new FormData()
            fileFormData.append('file', (lesson as any).file)
            
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: fileFormData,
            })
            
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              videoUrl = uploadData.url
              console.log(`✅ Video uploaded successfully:`, videoUrl)
            } else {
              const errorData = await uploadRes.json()
              console.error(`❌ Video upload failed:`, errorData)
              alert(`Failed to upload video for lesson ${idx + 1}: ${errorData.error || 'Unknown error'}`)
            }
          }
          
          return {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content || 'Lesson content',
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
      }

      const res = await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push(`/teacher/courses/${params.id}`)
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to update course")
      }
    } catch (error) {
      alert("Error updating course")
    } finally {
      setLoading(false)
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

  if (!course) {
    return <div className="text-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
        <p className="text-muted-foreground">Update your course content</p>
      </div>

      {/* Cloudinary Setup Notice */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            ☁️
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Cloudinary Cloud Storage Enabled</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Videos are now uploaded to <strong>Cloudinary</strong> and will persist on Vercel deployments!
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-4 list-disc">
              <li><strong>Setup Required</strong> - Add Cloudinary credentials to .env.local (see CLOUDINARY_SETUP.md)</li>
              <li><strong>Free Tier</strong> - 25GB storage, 25GB bandwidth/month</li>
              <li><strong>Max Size</strong> - 100MB per video file</li>
            </ul>
          </div>
        </div>
      </Card>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Course Title *</label>
            <Input name="title" defaultValue={course.title} placeholder="e.g., Introduction to JavaScript" required />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description *</label>
            <Textarea 
              name="description" 
              defaultValue={course.description}
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
                    setThumbnailPreview("")
                    delete (window as any).thumbnailFile
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
              <Input name="category" defaultValue={course.category} placeholder="e.g., Programming" required />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level *</label>
              <select name="level" defaultValue={course.level} className="w-full px-4 py-2 border rounded-lg" required>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price (USD)</label>
              <Input name="price" type="number" min="0" step="0.01" defaultValue={course.price || 0} />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input name="duration" type="number" min="0" defaultValue={course.duration || 0} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select name="status" defaultValue={course.status} className="w-full px-4 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Course Lessons</h3>
            <Button type="button" onClick={addLesson} variant="outline" size="sm">
              Add Lesson
            </Button>
          </div>

          {lessons.map((lesson, idx) => (
            <Card key={idx} className="p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Lesson {idx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLesson(idx)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
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
            {loading ? "Updating..." : "Update Course"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
