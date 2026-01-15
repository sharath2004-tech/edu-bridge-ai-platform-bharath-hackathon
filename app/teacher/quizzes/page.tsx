import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Course } from "@/lib/models"
import StandaloneQuiz from "@/lib/models/StandaloneQuiz"
import connectDB from "@/lib/mongodb"
import { BookOpen, ClipboardList, Plus, TrendingUp, Users } from "lucide-react"
import mongoose from "mongoose"
import Link from "next/link"
import { redirect } from "next/navigation"

const QuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quizIndex: { type: Number, required: true },
  answers: { type: Map, of: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
})

const StandaloneQuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'StandaloneQuiz', required: true },
  answers: { type: Map, of: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
})

const QuizResponse = mongoose.models.QuizResponse || mongoose.model('QuizResponse', QuizResponseSchema)
const StandaloneQuizResponse = mongoose.models.StandaloneQuizResponse || mongoose.model('StandaloneQuizResponse', StandaloneQuizResponseSchema)

export default async function TeacherQuizzesPage() {
  const session = await getSession()
  if (!session || session.role !== 'teacher') {
    redirect('/login')
  }

  await connectDB()

  // Get standalone quizzes created by this teacher
  const standaloneQuizzes = await StandaloneQuiz.find({ instructor: session.id }).lean()

  // Get all courses by this teacher
  const courses = await Course.find({ instructor: session.id }).lean()

  // Collect standalone quizzes with stats
  const standAloneQuizList: any[] = []
  for (const quiz of standaloneQuizzes) {
    const responseCount = await StandaloneQuizResponse.countDocuments({ quizId: quiz._id })
    const responses = await StandaloneQuizResponse.find({ quizId: quiz._id }).lean()
    const avgScore = responses.length > 0
      ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length
      : 0

    standAloneQuizList.push({
      _id: String(quiz._id),
      title: quiz.title,
      subject: quiz.subject,
      className: quiz.className,
      section: quiz.section,
      questionCount: quiz.questions?.length || 0,
      passingScore: quiz.passingScore,
      status: quiz.status,
      responseCount,
      averageScore: Math.round(avgScore),
      type: 'standalone'
    })
  }

  // Collect all quizzes with course info
  const quizzes: any[] = []
  for (const course of courses) {
    if (course.quizzes && course.quizzes.length > 0) {
      for (let idx = 0; idx < course.quizzes.length; idx++) {
        const quiz = course.quizzes[idx]
        
        // Count responses for this quiz
        const responseCount = await QuizResponse.countDocuments({
          courseId: course._id,
          quizIndex: idx
        })

        // Calculate average score
        const responses = await QuizResponse.find({
          courseId: course._id,
          quizIndex: idx
        }).lean()

        const avgScore = responses.length > 0
          ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length
          : 0

        quizzes.push({
          courseId: String(course._id),
          courseTitle: course.title,
          quizIndex: idx,
          title: quiz.title,
          questionCount: quiz.questions?.length || 0,
          passingScore: quiz.passingScore,
          responseCount,
          averageScore: Math.round(avgScore)
        })
      }
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage quizzes for your students</p>
        </div>
        <Link href="/teacher/quizzes/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </Link>
      </div>

      <Separator />

      {standAloneQuizList.length === 0 && quizzes.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
          <Link href="/teacher/quizzes/create">
            <Button>Create Quiz</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Standalone Quizzes */}
          {standAloneQuizList.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                My Quizzes ({standAloneQuizList.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standAloneQuizList.map((quiz) => (
                  <Card key={quiz._id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs px-2 py-1 rounded ${quiz.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {quiz.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                        {quiz.className && quiz.section && (
                          <p className="text-xs text-blue-600 mt-1">Class: {quiz.className} - {quiz.section}</p>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Questions</span>
                          <span className="font-medium">{quiz.questionCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Passing Score</span>
                          <span className="font-medium">{quiz.passingScore}%</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{quiz.responseCount} responses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Avg: {quiz.averageScore}%</span>
                        </div>
                      </div>

                      <Link href={`/teacher/quizzes/${quiz._id}/responses`}>
                        <Button className="w-full" variant="outline">View Responses</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Course Quizzes */}
          {quizzes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Quizzes ({quizzes.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => (
            <Card key={`${quiz.courseId}-${quiz.quizIndex}`} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{quiz.courseTitle}</p>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-medium">{quiz.questionCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Passing Score</span>
                    <span className="font-medium">{quiz.passingScore}%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{quiz.responseCount} responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Avg: {quiz.averageScore}%</span>
                  </div>
                </div>

                <Link href={`/teacher/courses/${quiz.courseId}/quiz/${quiz.quizIndex}/responses`}>
                  <Button className="w-full" variant="outline">View Responses</Button>
                </Link>
              </div>
            </Card>
          ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
