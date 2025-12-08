import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { ChatMessage, User } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function StudentChatHistoryPage({ params }: { params: Promise<{ studentId: string }> }) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'admin' && session.role !== 'teacher') {
    redirect(`/${session.role}/dashboard`)
  }

  const { studentId } = await params
  await connectDB()

  // Get student info
  const student = await User.findById(studentId).select('name email').lean()
  
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Student Not Found</h2>
        <Link href="/admin/chat-history">
          <Button>Back to Chat History</Button>
        </Link>
      </div>
    )
  }

  // Get all chat messages for this student
  const messages = await ChatMessage.find({ userId: studentId })
    .sort({ timestamp: 1 })
    .lean()

  // Calculate statistics
  const totalMessages = messages.length
  const userMessages = messages.filter(m => m.role === 'user').length
  const assistantMessages = messages.filter(m => m.role === 'assistant').length
  const quizModeMessages = messages.filter(m => m.quizMode).length
  const languages = [...new Set(messages.map(m => m.language))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/chat-history">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Messages</div>
          <div className="text-2xl font-bold">{totalMessages}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Student Questions</div>
          <div className="text-2xl font-bold text-blue-600">{userMessages}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">AI Responses</div>
          <div className="text-2xl font-bold text-green-600">{assistantMessages}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Quiz Mode Messages</div>
          <div className="text-2xl font-bold text-yellow-600">{quizModeMessages}</div>
        </Card>
      </div>

      {/* Languages Used */}
      {languages.length > 0 && (
        <Card className="p-4">
          <div className="text-sm font-semibold mb-2">Languages Used:</div>
          <div className="flex gap-2">
            {languages.map(lang => (
              <Badge key={lang} variant="outline">{lang}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Conversation History
        </h2>
        
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages yet. Student hasn't used the AI chatbot.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div 
                key={String(msg._id)}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-50 border border-blue-200 ml-0 mr-8'
                    : 'bg-gray-50 border border-gray-200 ml-8 mr-0'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">
                      {msg.role === 'user' ? student.name : 'AI Assistant'}
                    </span>
                    {msg.quizMode && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        Quiz Mode
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      {msg.language}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(msg.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
