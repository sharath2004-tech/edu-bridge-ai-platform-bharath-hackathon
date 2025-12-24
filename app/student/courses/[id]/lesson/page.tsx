"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { VideoPlayer } from "@/components/video-player"
import { ArrowLeft, ArrowRight, CheckCircle, Download, Maximize, MessageCircle, Volume2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LessonPage() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [notes, setNotes] = useState("")
  const [videoProgress, setVideoProgress] = useState(0)

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress)
    
    // Mark as completed when video is 90% watched
    if (progress >= 90 && !isCompleted) {
      setIsCompleted(true)
      
      // Award XP for completing lesson
      fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_lesson',
          xpAmount: 20
        })
      })
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <VideoPlayer
            videoUrl="https://example.com/sample-video.mp4"
            title="Introduction to React Hooks"
            courseId="course123"
            lessonId="lesson456"
            onProgress={handleVideoProgress}
          />

          {/* Lesson Info */}
          <Card className="p-6 border border-border mb-6 animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Module 3 • Lesson 7</p>
                <h1 className="text-2xl font-bold">Context API Deep Dive</h1>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="gap-1 bg-transparent">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
              <span>Duration: 38 minutes</span>
              <span>•</span>
              <span>Level: Intermediate</span>
              <span>•</span>
              <span>Published: Jan 15, 2024</span>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="mb-4">
                In this comprehensive lesson, we'll explore React's Context API and how to use it for state management
                across large component trees. You'll learn about context creation, providers, and consumers, and
                discover best practices for avoiding common pitfalls.
              </p>
              <h3 className="font-semibold mt-4 mb-2">What you'll learn:</h3>
              <ul className="space-y-1 text-sm">
                <li>How to create and use Context</li>
                <li>Provider and Consumer patterns</li>
                <li>useContext hook implementation</li>
                <li>Best practices for Context architecture</li>
                <li>Performance considerations</li>
              </ul>
            </div>
          </Card>

          {/* Notes Section */}
          <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-lg font-bold mb-4">Your Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes to this lesson..."
              className="w-full h-24 p-3 border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm">Save Notes</Button>
              <Button size="sm" variant="outline">
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Course Progress */}
          <Card className="p-4 border border-border animate-slideInRight" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-semibold mb-3">Course Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>This Module</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Lesson Actions */}
          <Card
            className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-slideInRight"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="font-semibold mb-3">Lesson Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => setIsCompleted(!isCompleted)}
                variant={isCompleted ? "default" : "outline"}
                className="w-full gap-2 justify-start"
              >
                <CheckCircle className={`w-4 h-4 ${isCompleted ? "fill-current" : ""}`} />
                {isCompleted ? "Lesson Complete" : "Mark as Complete"}
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start bg-transparent">
                <Download className="w-4 h-4" />
                Download Materials
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start bg-transparent">
                <MessageCircle className="w-4 h-4" />
                Ask Question
              </Button>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-4 border border-border animate-slideInRight" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold mb-3">Next Steps</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-muted rounded transition-colors">
                <p className="text-sm font-medium">Lesson 8</p>
                <p className="text-xs text-muted-foreground">Advanced Hooks Patterns</p>
              </button>
              <Button className="w-full gap-2 justify-between bg-transparent" variant="outline">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Resources */}
          <Card className="p-4 border border-border animate-slideInRight" style={{ animationDelay: "0.4s" }}>
            <h3 className="font-semibold mb-3">Resources</h3>
            <div className="space-y-2">
              {["Lesson Slides", "Code Examples", "Reference Guide"].map((resource, i) => (
                <button key={i} className="w-full text-left text-sm p-2 hover:bg-muted rounded transition-colors">
                  {resource}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quiz Section */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
        <h2 className="text-lg font-bold mb-4">Lesson Quiz</h2>
        <div className="space-y-4">
          {[
            { q: "What is the primary purpose of Context API?", a: "To manage state across component trees" },
            { q: "How do you access a context value in a functional component?", a: "Using the useContext hook" },
          ].map((item, i) => (
            <div key={i} className="space-y-2 pb-4 border-b border-border last:border-0">
              <p className="font-medium text-sm">
                {i + 1}. {item.q}
              </p>
              <div className="space-y-2">
                {["Option A", "Option B", "Option C", "Option D"].map((opt, j) => (
                  <button
                    key={j}
                    className="w-full text-left p-2 border border-border rounded hover:border-primary transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button className="w-full mt-4">Submit Quiz</Button>
        </div>
      </Card>
    </div>
  )
}
