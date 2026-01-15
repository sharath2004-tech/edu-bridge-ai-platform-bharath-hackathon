import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getSession } from "@/lib/auth"
import { Course } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { ArrowLeft, BookOpen, Clock, FileText, Play, Star, Users, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'student') {
    redirect('/login')
  }

  const { id } = await params
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

  const totalLessons = course.lessons?.length || 0
  const instructorName = (course.instructor as any)?.name || 'Unknown Instructor'

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 md:p-12 animate-slideInUp">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4 border border-primary/30">
              {course.category || 'Course'}
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {course.description || 'Comprehensive course content to enhance your skills'}
            </p>
            <div className="flex flex-wrap gap-4">
              {totalLessons > 0 && (
                <Link href={`/student/courses/${id}/lessons/0`}>
                  <Button size="lg" className="gap-2">
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Course Stats */}
          <div className="space-y-4">
            {[
              { icon: Users, label: "Instructor", value: instructorName },
              { icon: BookOpen, label: "Lessons", value: totalLessons.toString() },
              { icon: Clock, label: "Duration", value: `${course.duration || 0} mins` },
              { icon: Star, label: "Level", value: course.level || 'Beginner' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-slideInLeft"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress */}
      {totalLessons > 0 && (
        <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Your Progress</h2>
            <span className="text-sm font-medium">0%</span>
          </div>
          <Progress value={0} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">0 of {totalLessons} lessons completed</p>
        </Card>
      )}

      {/* Lessons */}
      {totalLessons > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          <div className="space-y-3">
            {course.lessons?.map((lesson: any, i: number) => (
              <Card
                key={i}
                className="p-4 border border-border hover:border-primary/50 transition-all group cursor-pointer animate-slideInLeft"
                style={{ animationDelay: `${0.6 + i * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {lesson.type === 'video' ? (
                        <Video className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-primary" />
                      )}
                      <p className="text-sm font-medium text-muted-foreground">Lesson {i + 1}</p>
                    </div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {lesson.duration && (
                      <p className="text-sm text-muted-foreground mb-2">{lesson.duration} mins</p>
                    )}
                    <Link href={`/student/courses/${id}/lessons/${i}`}>
                      <Button size="sm" className="gap-1">
                        <Play className="w-3 h-3" />
                        {lesson.type === 'video' ? 'Watch' : 'View'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No lessons available for this course yet.</p>
        </Card>
      )}

      {/* Quizzes */}
      {course.quizzes && course.quizzes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Quizzes</h2>
          <div className="space-y-3">
            {course.quizzes.map((quiz: any, i: number) => (
              <Card
                key={i}
                className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
                style={{ animationDelay: `${0.8 + i * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz.questions?.length || 0} questions • Passing: {quiz.passingScore || 70}%
                    </p>
                  </div>
                  <Link href={`/student/courses/${id}/quiz/${i}`}>
                    <Button size="sm" variant="outline">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
