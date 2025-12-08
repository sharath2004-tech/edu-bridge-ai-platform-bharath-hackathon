import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSession } from "@/lib/auth"
import { ChatMessage, User } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { MessageCircle, Search } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ChatHistoryPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'admin' && session.role !== 'teacher') {
    redirect(`/${session.role}/dashboard`)
  }

  await connectDB()

  // Get all students with their chat counts
  const students = await User.find({ role: 'student' })
    .select('name email')
    .lean()

  // Get chat message counts per student
  const chatCounts = await ChatMessage.aggregate([
    { $match: { role: 'user' } },
    { $group: { _id: '$userId', count: { $sum: 1 } } }
  ])

  const chatCountMap = new Map(chatCounts.map(c => [String(c._id), c.count]))

  const studentsWithChats = students.map(student => ({
    _id: String(student._id),
    name: student.name,
    email: student.email,
    messageCount: chatCountMap.get(String(student._id)) || 0
  }))

  // Get recent chat messages
  const recentChats = await ChatMessage.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('userId', 'name email role')
    .lean()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Chat History</h1>
        <p className="text-muted-foreground">View student conversations with AI assistant</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by student name..." className="pl-10" />
        </div>
      </div>

      {/* Students with Chat Counts */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Students Chat Summary
        </h2>
        <div className="space-y-2">
          {studentsWithChats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students found.</p>
          ) : (
            studentsWithChats.map((student, idx) => (
              <Link 
                key={student._id} 
                href={`/admin/chat-history/${student._id}`}
                className="block"
              >
                <Card 
                  className="p-4 hover:border-primary/50 transition-all cursor-pointer"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{student.messageCount}</div>
                      <p className="text-xs text-muted-foreground">messages</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Recent Chats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
        <div className="space-y-4">
          {recentChats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chat messages yet.</p>
          ) : (
            recentChats.map((chat: any) => (
              <div 
                key={String(chat._id)} 
                className={`p-4 rounded-lg ${
                  chat.role === 'user' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {chat.role === 'user' 
                        ? chat.userId?.name || chat.userName || 'Student'
                        : 'AI Assistant'
                      }
                    </span>
                    {chat.quizMode && (
                      <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700">
                        Quiz Mode
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700">
                      {chat.language}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
