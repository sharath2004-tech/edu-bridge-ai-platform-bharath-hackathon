import { DeleteCourseButton } from "@/components/delete-course-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Course } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { Award, BookOpen, Clock, PlayCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  await connectDB()
  const course = await Course.findById(id).populate('instructor', 'name email').lean()

  if (!course) {
    return <div>Course not found</div>
  }

  const courseData = {
    _id: String(course._id),
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    duration: course.duration,
    lessons: course.lessons || [],
    quizzes: course.quizzes || [],
    instructor: course.instructor ? {
      name: (course.instructor as any).name,
      email: (course.instructor as any).email
    } : null,
    thumbnail: course.thumbnail
  }

  const isTeacher = session.role === 'teacher' && String(course.instructor._id) === session.id

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={session.role === 'teacher' ? '/teacher/courses' : '/student/courses'} className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
          <p className="text-muted-foreground">{courseData.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{courseData.category}</span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">{courseData.level}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{courseData.duration} mins</span>
            </div>
          </div>
          {courseData.instructor && (
            <p className="text-sm text-muted-foreground mt-2">Instructor: {courseData.instructor.name}</p>
          )}
        </div>
        {isTeacher && (
          <div className="flex gap-2">
            <Link href={`/teacher/courses/${id}/quiz/create`}>
              <Button variant="outline" size="sm">Add Quiz</Button>
            </Link>
            <Link href={`/teacher/courses/${id}/edit`}>
              <Button size="sm">Edit Course</Button>
            </Link>
            <DeleteCourseButton courseId={id} />
          </div>
        )}
      </div>

      <Separator />

      {/* Course Content */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Course Content</h2>
          
          {courseData.lessons.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No lessons added yet</p>
            </Card>
          ) : (
            courseData.lessons.map((lesson: any, idx: number) => (
              <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                    {lesson.videoUrl && (
                      <Link href={lesson.videoUrl} target="_blank" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                        <PlayCircle className="w-4 h-4" />
                        View Resource
                      </Link>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration} mins</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quizzes</h3>
            {courseData.quizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No quizzes available</p>
            ) : (
              <div className="space-y-2">
                {courseData.quizzes.map((quiz: any, idx: number) => (
                  <Link 
                    key={idx} 
                    href={session.role === 'teacher' 
                      ? `/teacher/courses/${id}/quiz/${idx}/responses`
                      : `/student/courses/${id}/quiz/${idx}`
                    }
                  >
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{quiz.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {quiz.questions?.length || 0} questions
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {isTeacher && (
              <Link href={`/teacher/courses/${id}/quiz/create`}>
                <Button className="w-full mt-4" variant="outline">Create Quiz</Button>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
