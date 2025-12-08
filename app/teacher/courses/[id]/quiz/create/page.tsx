"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

export default function CreateQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quizTitle, setQuizTitle] = useState("")
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
  ])

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/teacher/courses/${resolvedParams.id}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizTitle,
          questions,
          passingScore,
        }),
      })

      if (res.ok) {
        router.push(`/teacher/courses/${resolvedParams.id}`)
        router.refresh()
      } else {
        alert("Failed to create quiz")
      }
    } catch (error) {
      alert("Error creating quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Quiz</h1>
        <p className="text-muted-foreground">Add quiz questions to test student knowledge</p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Quiz Title *</label>
            <Input 
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g., Chapter 1 Assessment"
              required 
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Passing Score (%) *</label>
            <Input 
              type="number"
              min="0"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              required 
            />
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Questions</h3>
          <Button type="button" onClick={addQuestion} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.map((q, qIdx) => (
          <Card key={qIdx} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Question {qIdx + 1}</h4>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIdx)}
                >
                  <Trash className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Question Text *</label>
              <Textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                placeholder="Enter your question"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Options *</label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswer === oIdx}
                    onChange={() => updateQuestion(qIdx, "correctAnswer", oIdx)}
                    className="w-4 h-4"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    placeholder={`Option ${oIdx + 1}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Explanation (optional)</label>
              <Textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                placeholder="Explain the correct answer"
                rows={2}
              />
            </div>
          </Card>
        ))}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Quiz"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
