import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { Course } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, FileText, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ id: string; lessonId: string }> 
}) {
  const session = await getSession()
  if (!session || session.role !== 'student') {
    redirect('/login')
  }

  const { id, lessonId } = await params
  const lessonIndex = parseInt(lessonId)

  await connectDB()
  const course = await Course.findById(id).populate('instructor', 'name').lean()
  
  if (!course) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </Card>
      </div>
    )
  }

  const lessons = course.lessons || []
  
  if (lessonIndex < 0 || lessonIndex >= lessons.length) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <Link href={`/student/courses/${id}`} className="flex items-center gap-2 text-primary hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
          <p className="text-muted-foreground">The lesson you're looking for doesn't exist in this course.</p>
        </Card>
      </div>
    )
  }

  const lesson = lessons[lessonIndex]
  const hasPrevious = lessonIndex > 0
  const hasNext = lessonIndex < lessons.length - 1

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/student/courses/${id}`} className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <div className="text-sm text-muted-foreground">
          Lesson {lessonIndex + 1} of {lessons.length}
        </div>
      </div>

      {/* Course Title */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">{course.title}</p>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground mt-2">{lesson.description}</p>
        )}
      </div>

      {/* Video/Content Player */}
      {lesson.videoUrl ? (
        <Card className="p-0 overflow-hidden">
          {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
            <div className="aspect-video">
              <iframe
                src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          ) : lesson.videoUrl.endsWith('.pdf') ? (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <FileText className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="font-semibold mb-2">PDF Document</h3>
                  <a 
                    href={lesson.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <video controls className="w-full bg-black" onError={(e) => {
                console.error('Video failed to load:', lesson.videoUrl)
                e.currentTarget.style.display = 'none'
                const errorDiv = document.getElementById('video-error')
                if (errorDiv) errorDiv.style.display = 'block'
              }}>
                <source src={lesson.videoUrl} type="video/mp4" />
                <source src={lesson.videoUrl} type="video/webm" />
                <source src={lesson.videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              <div id="video-error" style={{ display: 'none' }} className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
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
                    Video URL: {lesson.videoUrl}
                  </p>
                </div>
                <a 
                  href={lesson.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                >
                  Try opening directly
                </a>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">No video content available for this lesson</p>
        </Card>
      )}

      {/* Lesson Content */}
      {lesson.content && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Lesson Content
          </h2>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{lesson.content}</p>
          </div>
        </Card>
      )}

      {/* Duration */}
      {lesson.duration > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-primary" />
            <span className="font-medium">Duration:</span>
            <span className="text-muted-foreground">{lesson.duration} minutes</span>
          </div>
        </Card>
      )}

      {/* Progress Actions */}
      <Card className="p-6 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Mark as Complete</h3>
          <Button size="sm" variant="outline" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Complete Lesson
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your progress by marking lessons as complete.
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        {hasPrevious ? (
          <Link href={`/student/courses/${id}/lessons/${lessonIndex - 1}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous Lesson
            </Button>
          </Link>
        ) : (
          <div />
        )}
        
        {hasNext ? (
          <Link href={`/student/courses/${id}/lessons/${lessonIndex + 1}`}>
            <Button className="gap-2">
              Next Lesson
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/student/courses/${id}`}>
            <Button className="gap-2">
              Back to Course Overview
              <CheckCircle className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
