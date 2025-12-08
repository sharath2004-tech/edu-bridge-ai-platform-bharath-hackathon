"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Loader2, Presentation, Sparkles } from "lucide-react"
import { useState } from "react"

interface Slide {
  title: string
  content: string[]
  notes?: string
}

export default function AIPPTCreatorPage() {
  const [loading, setLoading] = useState(false)
  const [generatedPPT, setGeneratedPPT] = useState<Slide[] | null>(null)
  const [formData, setFormData] = useState({
    topic: '',
    audience: 'students',
    numSlides: 10,
    style: 'educational',
    keyPoints: ''
  })

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/teacher/ai/ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setGeneratedPPT(data.slides)
      }
    } catch (error) {
      console.error('Error generating PPT:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPPTX = async () => {
    if (!generatedPPT) return
    
    try {
      // Create downloadable JSON format (can be converted to PPTX with libraries)
      const pptData = {
        title: formData.topic,
        slides: generatedPPT
      }
      
      const blob = new Blob([JSON.stringify(pptData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.topic.replace(/\s+/g, '-')}-presentation.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Presentation downloaded as JSON. You can convert it to PPTX using tools like pptxgenjs or import into PowerPoint.')
    } catch (error) {
      console.error('Error downloading PPT:', error)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Presentation className="w-8 h-8 text-primary" />
          AI Presentation Creator
        </h1>
        <p className="text-muted-foreground">Generate engaging presentations instantly using AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Presentation Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Subject</Label>
              <Input
                id="topic"
                placeholder="e.g., Photosynthesis in Plants"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points (Optional)</Label>
              <Textarea
                id="keyPoints"
                placeholder="List important points to cover, one per line"
                value={formData.keyPoints}
                onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <select
                  id="audience"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                >
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numSlides">Number of Slides</Label>
                <Input
                  id="numSlides"
                  type="number"
                  min="5"
                  max="30"
                  value={formData.numSlides}
                  onChange={(e) => setFormData({ ...formData, numSlides: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Presentation Style</Label>
              <select
                id="style"
                className="w-full px-3 py-2 border rounded-lg bg-background"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              >
                <option value="educational">Educational</option>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading || !formData.topic}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Slides...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Presentation
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Preview</h3>
            {generatedPPT && (
              <Button variant="outline" size="sm" onClick={downloadPPTX}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          
          {!generatedPPT ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Presentation className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your generated presentation will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {generatedPPT.map((slide, idx) => (
                <Card key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Slide {idx + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 text-primary">
                    {slide.title}
                  </h3>
                  
                  <ul className="space-y-2 mb-3">
                    {slide.content.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {slide.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs text-muted-foreground">
                        <strong>Speaker Notes:</strong> {slide.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
