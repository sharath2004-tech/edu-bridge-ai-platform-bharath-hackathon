"use client"

import { AIChatbot } from "@/components/ai-chatbot"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function StudentStandaloneQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [])

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/student/quizzes/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setQuiz(data.data)
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting')
      return
    }

    setSubmitted(true)

    // Calculate score
    let correct = 0
    quiz.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correct++
      }
    })

    const percentage = (correct / quiz.questions.length) * 100
    setScore(percentage)

    // Save response
    try {
      await fetch(`/api/student/quizzes/${resolvedParams.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          score: percentage,
        }),
      })
    } catch (error) {
      console.error('Error saving response:', error)
    }

    setShowResults(true)
  }

  if (loading) {
    return <div>Loading quiz...</div>
  }

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  if (showResults) {
    const passed = score >= quiz.passingScore

    return (
      <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          {passed ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          )}
          <h2 className="text-2xl font-bold mb-2">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
          <p className="text-4xl font-bold text-primary mb-4">{Math.round(score)}%</p>
          <p className="text-muted-foreground mb-6">
            You scored {Math.round(score)}% • Passing score: {quiz.passingScore}%
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/student/quizzes">
              <Button>Back to Quizzes</Button>
            </Link>
            <Button variant="outline" onClick={() => {
              setAnswers({})
              setSubmitted(false)
              setShowResults(false)
              setScore(0)
            }}>
              Retake Quiz
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Review Answers</h3>
          {quiz.questions.map((q: any, idx: number) => {
            const isCorrect = answers[idx] === q.correctAnswer
            return (
              <Card key={idx} className={`p-4 ${isCorrect ? 'border-green-500' : 'border-destructive'}`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your answer: {q.options[answers[idx]]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600 mb-2">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-muted-foreground italic">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div>
        <Link href="/student/quizzes" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
          ← Back to Quizzes
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{quiz.subject}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-muted-foreground mb-2">{quiz.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {quiz.questions.length} questions • Passing score: {quiz.passingScore}%
        </p>
      </div>

      <Separator />

      <div className="space-y-6">
        {quiz.questions.map((q: any, idx: number) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">{idx + 1}</span>
              </div>
              <p className="font-medium flex-1">{q.question}</p>
            </div>

            <div className="space-y-2 ml-11">
              {q.options.map((option: string, oIdx: number) => (
                <label
                  key={oIdx}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[idx] === oIdx ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    checked={answers[idx] === oIdx}
                    onChange={() => setAnswers({ ...answers, [idx]: oIdx })}
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 justify-end sticky bottom-4 bg-background p-4 border-t">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitted}>
          {submitted ? 'Submitted' : 'Submit Quiz'}
        </Button>
      </div>

      {/* AI Chatbot with Quiz Mode Active */}
      <AIChatbot quizMode={!submitted} />
    </div>
  )
}
