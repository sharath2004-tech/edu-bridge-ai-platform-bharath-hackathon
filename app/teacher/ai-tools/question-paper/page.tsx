"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import jsPDF from 'jspdf'
import { Download, FileText, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

export default function AIQuestionPaperPage() {
  const [loading, setLoading] = useState(false)
  const [generatedPaper, setGeneratedPaper] = useState<any>(null)
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    difficulty: 'medium',
    numQuestions: 10,
    questionTypes: ['mcq', 'short', 'long'],
    duration: 60
  })

  const downloadPDF = () => {
    if (!generatedPaper) return

    const doc = new jsPDF()
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.text(formData.subject, 105, yPosition, { align: 'center' })
    yPosition += 10
    
    doc.setFontSize(14)
    doc.text(formData.topic, 105, yPosition, { align: 'center' })
    yPosition += 15
    
    doc.setFontSize(10)
    doc.text(`Duration: ${formData.duration} minutes`, 20, yPosition)
    doc.text(`Total Marks: ${generatedPaper.totalMarks}`, 150, yPosition)
    yPosition += 15

    // Questions
    doc.setFontSize(12)
    generatedPaper.questions?.forEach((q: any, idx: number) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFont('helvetica', 'bold')
      doc.text(`Q${idx + 1}. [${q.marks} marks]`, 20, yPosition)
      yPosition += 7

      doc.setFont('helvetica', 'normal')
      const questionLines = doc.splitTextToSize(q.question, 170)
      doc.text(questionLines, 20, yPosition)
      yPosition += questionLines.length * 7

      if (q.type === 'mcq' && q.options) {
        q.options.forEach((opt: string, i: number) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          const optionText = `${String.fromCharCode(65 + i)}) ${opt}`
          const optionLines = doc.splitTextToSize(optionText, 160)
          doc.text(optionLines, 30, yPosition)
          yPosition += optionLines.length * 6
        })
      }
      
      yPosition += 10
    })

    doc.save(`${formData.subject}-Question-Paper.pdf`)
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/teacher/ai/question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setGeneratedPaper(data.paper)
      }
    } catch (error) {
      console.error('Error generating question paper:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Question Paper Generator
        </h1>
        <p className="text-muted-foreground">Generate customized question papers instantly using AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Paper Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Physics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Chapter</Label>
              <Textarea
                id="topic"
                placeholder="e.g., Calculus - Differentiation and Integration"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numQuestions">Questions</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  min="5"
                  max="50"
                  value={formData.numQuestions}
                  onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="space-y-2">
                {[
                  { value: 'mcq', label: 'Multiple Choice' },
                  { value: 'short', label: 'Short Answer' },
                  { value: 'long', label: 'Long Answer' },
                  { value: 'truefalse', label: 'True/False' }
                ].map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={type.value}
                      checked={formData.questionTypes.includes(type.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, questionTypes: [...formData.questionTypes, type.value] })
                        } else {
                          setFormData({ ...formData, questionTypes: formData.questionTypes.filter(t => t !== type.value) })
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={type.value} className="cursor-pointer">{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading || !formData.subject || !formData.topic}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Question Paper
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Preview</h3>
            {generatedPaper && (
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
          
          {!generatedPaper ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your generated question paper will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <div className="text-center space-y-2 pb-4 border-b">
                <h2 className="text-2xl font-bold">{formData.subject}</h2>
                <p className="text-lg">{formData.topic}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Duration: {formData.duration} minutes</span>
                  <span>Total Marks: {generatedPaper.totalMarks}</span>
                </div>
              </div>

              <div className="space-y-6">
                {generatedPaper.questions?.map((q: any, idx: number) => (
                  <div key={idx} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-semibold">Q{idx + 1}.</span>
                      <span className="text-sm text-muted-foreground">[{q.marks} marks]</span>
                    </div>
                    <p>{q.question}</p>
                    {q.type === 'mcq' && q.options && (
                      <div className="ml-4 space-y-1">
                        {q.options.map((opt: string, i: number) => (
                          <div key={i} className="text-sm">
                            {String.fromCharCode(65 + i)}) {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
