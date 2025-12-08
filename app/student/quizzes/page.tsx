import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Course, Section } from "@/lib/models"
import StandaloneQuiz from "@/lib/models/StandaloneQuiz"
import connectDB from "@/lib/mongodb"
import { BookOpen, CheckCircle, ClipboardCheck, Clock, XCircle } from "lucide-react"
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

export default async function StudentQuizzesPage() {
  const session = await getSession()
  if (!session || session.role !== 'student') {
    redirect('/login')
  }

  await connectDB()

  // Get all published standalone quizzes
  const publishedQuizzes = await StandaloneQuiz.find({ status: 'published' }).populate('instructor', 'name').lean()

  // Get student's responses to standalone quizzes
  const standaloneResponses = await StandaloneQuizResponse.find({ studentId: session.id }).lean()
  const standaloneResponseMap = new Map()
  standaloneResponses.forEach(r => {
    standaloneResponseMap.set(String(r.quizId), {
      score: r.score,
      submittedAt: r.submittedAt
    })
  })

  // Prepare standalone quiz list
  const standAloneQuizList: any[] = []
  for (const quiz of publishedQuizzes) {
    const response = standaloneResponseMap.get(String(quiz._id))
    standAloneQuizList.push({
      _id: String(quiz._id),
      title: quiz.title,
      subject: quiz.subject,
      instructor: (quiz.instructor as any)?.name || 'Unknown',
      questionCount: quiz.questions?.length || 0,
      passingScore: quiz.passingScore,
      attempted: !!response,
      score: response?.score,
      passed: response ? response.score >= quiz.passingScore : null,
      submittedAt: response?.submittedAt,
      type: 'standalone'
    })
  }

  // Find student's section
  const studentSection = await Section.findOne({ students: session.id }).lean()

  // Get courses assigned to student's section
  const courses = studentSection ? await Course.find({ 
    sections: studentSection._id,
    status: 'published'
  }).populate('instructor', 'name').lean() : []

  // Get all student's quiz responses
  const responses = await QuizResponse.find({ studentId: session.id }).lean()
  const responseMap = new Map()
  responses.forEach(r => {
    responseMap.set(`${r.courseId}-${r.quizIndex}`, {
      score: r.score,
      submittedAt: r.submittedAt
    })
  })

  // Collect all available quizzes
  const quizzes: any[] = []
  for (const course of courses) {
    if (course.quizzes && course.quizzes.length > 0) {
      for (let idx = 0; idx < course.quizzes.length; idx++) {
        const quiz = course.quizzes[idx]
        const key = `${course._id}-${idx}`
        const response = responseMap.get(key)

        quizzes.push({
          courseId: String(course._id),
          courseTitle: course.title,
          instructor: (course.instructor as any)?.name || 'Unknown',
          quizIndex: idx,
          title: quiz.title,
          questionCount: quiz.questions?.length || 0,
          passingScore: quiz.passingScore,
          attempted: !!response,
          score: response?.score,
          passed: response ? response.score >= quiz.passingScore : null,
          submittedAt: response?.submittedAt
        })
      }
    }
  }

  const attemptedStandalone = standAloneQuizList.filter(q => q.attempted)
  const pendingStandalone = standAloneQuizList.filter(q => !q.attempted)

  const attemptedQuizzes = quizzes.filter(q => q.attempted)
  const pendingQuizzes = quizzes.filter(q => !q.attempted)

  const totalQuizzes = standAloneQuizList.length + quizzes.length

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Quizzes</h1>
        <p className="text-muted-foreground">View and take available quizzes</p>
      </div>

      <Separator />

      {totalQuizzes === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground mb-4">Check back later for new quizzes</p>
          <Link href="/student/courses">
            <Button>Browse Courses</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending Standalone Quizzes */}
          {pendingStandalone.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available Quizzes ({pendingStandalone.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingStandalone.map((quiz) => (
                  <Card key={quiz._id} className="p-6 hover:shadow-lg transition-shadow border-blue-500/50">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Quiz</span>
                        <h3 className="font-semibold text-lg mt-2">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                        <p className="text-xs text-muted-foreground">by {quiz.instructor}</p>
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

                      <Link href={`/student/quizzes/${quiz._id}`}>
                        <Button className="w-full">Take Quiz</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Course Quizzes */}
          {pendingQuizzes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Pending Course Quizzes ({pendingQuizzes.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingQuizzes.map((quiz) => (
                  <Card key={`${quiz.courseId}-${quiz.quizIndex}`} className="p-6 hover:shadow-lg transition-shadow border-yellow-500/50">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{quiz.courseTitle}</p>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <p className="text-xs text-muted-foreground">by {quiz.instructor}</p>
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

                      <Link href={`/student/courses/${quiz.courseId}/quiz/${quiz.quizIndex}`}>
                        <Button className="w-full">Take Quiz</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Standalone Quizzes */}
          {attemptedStandalone.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Completed Quizzes ({attemptedStandalone.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attemptedStandalone.map((quiz) => (
                  <Card key={quiz._id} className={`p-6 hover:shadow-lg transition-shadow ${quiz.passed ? 'border-green-500/50' : 'border-red-500/50'}`}>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Quiz</span>
                        <h3 className="font-semibold text-lg mt-2">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                        <p className="text-xs text-muted-foreground">by {quiz.instructor}</p>
                      </div>

                      <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                          {quiz.passed ? (
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          ) : (
                            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                          )}
                          <p className="text-3xl font-bold">{Math.round(quiz.score)}%</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {quiz.passed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Submitted: {new Date(quiz.submittedAt).toLocaleDateString()}
                      </p>

                      <Link href={`/student/quizzes/${quiz._id}`}>
                        <Button className="w-full" variant="outline">Retake Quiz</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Course Quizzes */}
          {attemptedQuizzes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Completed Course Quizzes ({attemptedQuizzes.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attemptedQuizzes.map((quiz) => (
                  <Card key={`${quiz.courseId}-${quiz.quizIndex}`} className={`p-6 hover:shadow-lg transition-shadow ${quiz.passed ? 'border-green-500/50' : 'border-red-500/50'}`}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{quiz.courseTitle}</p>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <p className="text-xs text-muted-foreground">by {quiz.instructor}</p>
                      </div>

                      <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                          {quiz.passed ? (
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          ) : (
                            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                          )}
                          <p className="text-3xl font-bold">{Math.round(quiz.score)}%</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {quiz.passed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Submitted: {new Date(quiz.submittedAt).toLocaleDateString()}
                      </p>

                      <Link href={`/student/courses/${quiz.courseId}/quiz/${quiz.quizIndex}`}>
                        <Button className="w-full" variant="outline">Retake Quiz</Button>
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
