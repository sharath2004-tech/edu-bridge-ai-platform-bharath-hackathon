"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      q: "What does useState do in React?",
      options: ["Manages component state", "Handles API calls", "Styles components", "Routes between pages"],
      correct: 0,
    },
    {
      q: "How do you prevent unnecessary re-renders?",
      options: [
        "Using useCallback and useMemo",
        "Using useState only once",
        "Avoiding JSX entirely",
        "Using more state variables",
      ],
      correct: 0,
    },
    {
      q: "What is Context API used for?",
      options: ["Managing global state", "Creating animations", "Making API requests", "Styling components"],
      correct: 0,
    },
  ]

  const handleAnswer = (index: number) => {
    const newAnswers = { ...answers, [currentQuestion]: index }
    setAnswers(newAnswers)
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100
    return (
      <div className="space-y-6 animate-fadeIn">
        <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center border border-border animate-slideInUp">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${percentage >= 70 ? "bg-emerald-500/20" : "bg-amber-500/20"}`}
            >
              {percentage >= 70 ? (
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-6">{percentage >= 70 ? "Excellent work!" : "Good effort!"}</p>

            <div className="mb-6">
              <div className="text-5xl font-bold text-primary mb-2">{Math.round(percentage)}%</div>
              <p className="text-muted-foreground">
                You answered {score} out of {questions.length} correctly
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded">
                  <span className="text-sm">{q.q}</span>
                  {answers[i] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <Button className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Next Lesson
              </Button>
              <Button variant="outline">Review Answers</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Course Quiz</h1>
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-8" />

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-6">{questions[currentQuestion].q}</h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  answers[currentQuestion] === i
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      answers[currentQuestion] === i ? "border-primary bg-primary" : "border-border"
                    }`}
                  ></div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleNext} disabled={!(currentQuestion in answers)} className="w-full">
          {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </Button>
      </Card>
    </div>
  )
}
