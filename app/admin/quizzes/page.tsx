import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Course } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { CheckCircle, ClipboardList, Search, TrendingUp, Users } from "lucide-react"
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

const QuizResponse = mongoose.models.QuizResponse || mongoose.model('QuizResponse', QuizResponseSchema)

export default async function AdminQuizzesPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    redirect('/login')
  }

  await connectDB()

  // Get all courses with quizzes
  const courses = await Course.find({ 'quizzes.0': { $exists: true } })
    .populate('instructor', 'name email')
    .lean()

  // Collect all quizzes with statistics
  const quizzes: any[] = []
  for (const course of courses) {
    if (course.quizzes && course.quizzes.length > 0) {
      for (let idx = 0; idx < course.quizzes.length; idx++) {
        const quiz = course.quizzes[idx]
        
        // Count responses
        const responseCount = await QuizResponse.countDocuments({
          courseId: course._id,
          quizIndex: idx
        })

        // Get all responses for statistics
        const responses = await QuizResponse.find({
          courseId: course._id,
          quizIndex: idx
        }).lean()

        const avgScore = responses.length > 0
          ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length
          : 0

        const passCount = responses.filter(r => r.score >= quiz.passingScore).length
        const failCount = responses.length - passCount

        quizzes.push({
          courseId: String(course._id),
          courseTitle: course.title,
          instructor: (course.instructor as any)?.name || 'Unknown',
          instructorEmail: (course.instructor as any)?.email || '',
          quizIndex: idx,
          title: quiz.title,
          questionCount: quiz.questions?.length || 0,
          passingScore: quiz.passingScore,
          responseCount,
          averageScore: Math.round(avgScore),
          passCount,
          failCount,
          passRate: responseCount > 0 ? Math.round((passCount / responseCount) * 100) : 0
        })
      }
    }
  }

  // Sort by response count (most active first)
  quizzes.sort((a, b) => b.responseCount - a.responseCount)

  const totalQuizzes = quizzes.length
  const totalResponses = quizzes.reduce((sum, q) => sum + q.responseCount, 0)
  const avgPassRate = quizzes.length > 0 
    ? Math.round(quizzes.reduce((sum, q) => sum + q.passRate, 0) / quizzes.length)
    : 0

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quiz Responses</h1>
        <p className="text-muted-foreground">Monitor all quiz activity and student performance</p>
      </div>

      <Separator />

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
              <p className="text-2xl font-bold">{totalQuizzes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Responses</p>
              <p className="text-2xl font-bold">{totalResponses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Pass Rate</p>
              <p className="text-2xl font-bold">{avgPassRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg per Quiz</p>
              <p className="text-2xl font-bold">
                {totalQuizzes > 0 ? Math.round(totalResponses / totalQuizzes) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search quizzes by course or instructor..." className="pl-10" />
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground">Quizzes will appear here once teachers create them</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={`${quiz.courseId}-${quiz.quizIndex}`} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.courseTitle}</p>
                      <p className="text-xs text-muted-foreground">Instructor: {quiz.instructor}</p>
                    </div>
                    <Link href={`/teacher/courses/${quiz.courseId}/quiz/${quiz.quizIndex}/responses`}>
                      <button className="text-sm text-primary hover:underline">View Details →</button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Questions</p>
                      <p className="font-semibold">{quiz.questionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Responses</p>
                      <p className="font-semibold">{quiz.responseCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="font-semibold">{quiz.averageScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pass Rate</p>
                      <p className="font-semibold text-green-600">{quiz.passRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Passed</p>
                      <p className="font-semibold text-green-600">{quiz.passCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Failed</p>
                      <p className="font-semibold text-destructive">{quiz.failCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
