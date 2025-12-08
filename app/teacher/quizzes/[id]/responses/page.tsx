import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import StandaloneQuiz from "@/lib/models/StandaloneQuiz"
import connectDB from "@/lib/mongodb"
import { CheckCircle, User, XCircle } from "lucide-react"
import mongoose from "mongoose"
import Link from "next/link"
import { redirect } from "next/navigation"

const StandaloneQuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'StandaloneQuiz', required: true },
  answers: { type: Map, of: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
})

const StandaloneQuizResponse = mongoose.models.StandaloneQuizResponse || mongoose.model('StandaloneQuizResponse', StandaloneQuizResponseSchema)

export default async function QuizResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'teacher') {
    redirect('/login')
  }

  const { id } = await params
  await connectDB()
  
  const quiz = await StandaloneQuiz.findById(id).lean()
  if (!quiz) {
    return <div>Quiz not found</div>
  }

  if (String(quiz.instructor) !== session.id) {
    return <div>Unauthorized</div>
  }

  const responses = await StandaloneQuizResponse.find({
    quizId: id
  }).populate('studentId', 'name email').sort({ submittedAt: -1 }).lean()

  const responsesData = responses.map((r: any) => ({
    _id: String(r._id),
    student: {
      name: r.studentId?.name || 'Unknown',
      email: r.studentId?.email || ''
    },
    score: r.score,
    answers: r.answers instanceof Map ? Object.fromEntries(r.answers) : r.answers,
    submittedAt: r.submittedAt.toLocaleString()
  }))

  const averageScore = responsesData.length > 0 
    ? responsesData.reduce((sum, r) => sum + r.score, 0) / responsesData.length 
    : 0

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <Link href="/teacher/quizzes" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
          ← Back to Quizzes
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{quiz.subject}</span>
          <span className={`text-xs px-2 py-1 rounded ${quiz.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {quiz.status}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Responses: {quiz.title}</h1>
        <p className="text-muted-foreground">
          {responsesData.length} student{responsesData.length !== 1 ? 's' : ''} completed • 
          Average score: {Math.round(averageScore)}%
        </p>
      </div>

      <Separator />

      {responsesData.length === 0 ? (
        <Card className="p-8 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No student responses yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {responsesData.map((response) => {
            const passed = response.score >= quiz.passingScore
            
            return (
              <Card key={response._id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{response.student.name}</h3>
                    <p className="text-sm text-muted-foreground">{response.student.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Submitted: {response.submittedAt}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${passed ? 'text-green-500' : 'text-destructive'}`}>
                      {Math.round(response.score)}%
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {passed ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Passed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-destructive" />
                          <span className="text-destructive">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {quiz.questions.map((q: any, idx: number) => {
                    const studentAnswer = response.answers[idx]
                    const isCorrect = studentAnswer === q.correctAnswer
                    
                    return (
                      <div key={idx} className="border-l-2 pl-3 py-1" style={{ borderColor: isCorrect ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' }}>
                        <p className="text-sm font-medium mb-1">Q{idx + 1}: {q.question}</p>
                        <div className="flex items-center gap-2 text-xs">
                          {isCorrect ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-destructive" />
                          )}
                          <span className="text-muted-foreground">
                            Answer: {q.options[studentAnswer]}
                            {!isCorrect && ` (Correct: ${q.options[q.correctAnswer]})`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
