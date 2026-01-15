"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateQuizPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    // Fetch teacher's assigned classes
    fetch('/api/teacher/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClasses(data.data || [])
        }
      })
      .catch(err => console.error('Error fetching classes:', err))
  }, [])

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

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
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

      const res = await fetch("/api/teacher/quizzes/create", {
        method: "POST",
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
        alert(errorData.error || "Failed to create quiz")
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
        <p className="text-muted-foreground">Create a new quiz for your students</p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Quiz Information</h3>
          
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
              <label className="text-sm font-medium block">Options * (Select the correct answer)</label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswer === oIdx}
                    onChange={() => updateQuestion(qIdx, "correctAnswer", oIdx)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    placeholder={`Option ${oIdx + 1}`}
                    required
                    className={q.correctAnswer === oIdx ? "border-green-500" : ""}
                  />
                  {q.correctAnswer === oIdx && (
                    <span className="text-xs text-green-600 font-medium">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Explanation (optional)</label>
              <Textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                placeholder="Explain why this is the correct answer"
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
