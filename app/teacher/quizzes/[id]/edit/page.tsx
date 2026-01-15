"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditQuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [quizTitle, setQuizTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [passingScore, setPassingScore] = useState(70)
  const [status, setStatus] = useState("draft")
  const [classId, setClassId] = useState("")
  const [classes, setClasses] = useState<any[]>([])
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
  ])

  useEffect(() => {
    // Fetch quiz data
    fetch(`/api/teacher/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const quiz = data.data
          setQuizTitle(quiz.title)
          setSubject(quiz.subject)
          setDescription(quiz.description || "")
          setPassingScore(quiz.passingScore)
          setStatus(quiz.status)
          setClassId(quiz.classId || "")
          setQuestions(quiz.questions || [{ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }])
        } else {
          alert('Failed to load quiz')
          router.push('/teacher/quizzes')
        }
      })
      .catch(err => {
        console.error('Error fetching quiz:', err)
        alert('Failed to load quiz')
        router.push('/teacher/quizzes')
      })
      .finally(() => setFetching(false))

    // Fetch teacher's assigned classes
    fetch('/api/teacher/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClasses(data.classes || [])
        }
      })
      .catch(err => console.error('Error fetching classes:', err))
  }, [quizId, router])

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate all questions have options filled
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q.question.trim()) {
          alert(`Question ${i + 1} is empty`)
          setLoading(false)
          return
        }
        if (q.options.some(opt => !opt.trim())) {
          alert(`Question ${i + 1} has empty options`)
          setLoading(false)
          return
        }
      }

      if (!classId) {
        alert('Please select a class and section')
        setLoading(false)
        return
      }

      const selectedClass = classes.find(c => c._id === classId)
      if (!selectedClass) {
        alert('Invalid class selection')
        setLoading(false)
        return
      }

      const res = await fetch(`/api/teacher/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizTitle,
          subject,
          description,
          questions,
          passingScore,
          status,
          classId: selectedClass._id,
          className: selectedClass.className,
          section: selectedClass.section,
        }),
      })

      if (res.ok) {
        router.push("/teacher/quizzes")
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to update quiz")
      }
    } catch (error) {
      alert("Error updating quiz")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Quiz</h1>
        <p className="text-muted-foreground">Modify quiz details and change status</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Quiz Title *</label>
            <Input 
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g., Introduction to Algebra"
              required 
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subject *</label>
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Science, History"
              required 
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Class & Section *</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a class...</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} - {cls.section}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No classes assigned. Please contact your administrator.</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the quiz..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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

            <div>
              <label className="text-sm font-medium mb-2 block">Status *</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {status === 'published' ? 'Students can see this quiz' : 'Only you can see this quiz'}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Questions</h3>
          <Button type="button" onClick={addQuestion} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h4 className="font-medium">Question {qIndex + 1}</h4>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Question Text *</label>
              <Textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                placeholder="Enter your question..."
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium block">Options *</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === optIndex}
                    onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                    className="w-4 h-4"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    required
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Select the correct answer by clicking the radio button</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Explanation (Optional)</label>
              <Textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                placeholder="Explain why this is the correct answer..."
                rows={2}
              />
            </div>

            <Separator />
          </Card>
        ))}

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/teacher/quizzes")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Quiz"}
          </Button>
        </div>
      </form>
    </div>
  )
}
