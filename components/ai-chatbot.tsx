"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Bot, FileText, MessageCircle, Mic, Paperclip, Send, Sparkles, User, Volume2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  fileName?: string
}

interface AIChatbotProps {
  quizMode?: boolean
  className?: string
}

export function AIChatbot({ quizMode = false, className }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("english")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "telugu", name: "తెలుగు", flag: "🇮🇳" },
    { code: "hindi", name: "हिंदी", flag: "🇮🇳" },
    { code: "tamil", name: "தமிழ்", flag: "🇮🇳" },
    { code: "kannada", name: "ಕನ್ನಡ", flag: "🇮🇳" }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('/api/chat')
      if (res.ok) {
        const data = await res.json()
        if (data.messages) {
          setMessages(data.messages.map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp)
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      // Only allow PDF, TXT, DOC, DOCX
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, TXT, DOC, and DOCX files are supported')
        return
      }
      setUploadedFile(file)
    }
  }

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedFile) || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage || (uploadedFile ? `📎 ${uploadedFile.name}` : ''),
      timestamp: new Date(),
      fileName: uploadedFile?.name
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    const currentFile = uploadedFile
    setInputMessage("")
    setUploadedFile(null)
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      let fileContent = ''
      
      // Read file content if uploaded
      if (currentFile) {
        fileContent = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsText(currentFile)
        })
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage || 'Summarize this document',
          fileContent,
          fileName: currentFile?.name,
          quizMode,
          language
        })
      })

      if (res.ok) {
        const data = await res.json()
        
        // Remove typing indicator and add actual response
        setMessages(prev => {
          const withoutTyping = prev.filter(m => !m.isTyping)
          return [...withoutTyping, {
            role: 'assistant',
            content: data.response,
            timestamp: new Date()
          }]
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping)
        return [...withoutTyping, {
          role: 'assistant',
          content: '❌ Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          quizMode && "opacity-50",
          className
        )}
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold">EduBridge AI</h3>
                  <p className="text-xs opacity-90">Your Learning Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Language Selector */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "px-2 py-1 rounded text-xs whitespace-nowrap transition-colors",
                    language === lang.code
                      ? "bg-white text-primary"
                      : "bg-white/20 hover:bg-white/30"
                  )}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>

            {quizMode && (
              <div className="mt-2 text-xs bg-yellow-500/20 px-2 py-1 rounded">
                🔒 Quiz Mode Active - Help Limited
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full"></div>
                  <Bot className="w-16 h-16 relative text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Hi! I'm EduBridge AI 👋</h3>
                  <p className="text-sm text-muted-foreground">Your intelligent learning companion</p>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-semibold">📚</span> Ask me to explain any concept
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-semibold">🧮</span> Help with math problems
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="font-semibold">🌍</span> Available in 5 languages
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                    msg.role === 'user' 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
                      : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    "flex-1 max-w-[85%] space-y-1"
                  )}>
                    <div className={cn(
                      "rounded-2xl px-4 py-3 shadow-sm",
                      msg.role === 'user'
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none"
                        : msg.isTyping
                          ? "bg-muted border border-border rounded-tl-none"
                          : "bg-white border border-border rounded-tl-none"
                    )}>
                      {msg.isTyping ? (
                        <div className="flex gap-1 py-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <div className={cn(
                          "text-sm leading-relaxed whitespace-pre-wrap",
                          msg.role === 'assistant' && "text-foreground"
                        )}>
                          {msg.content.split('\n').map((line, i) => {
                            // Format bold text **text**
                            const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
                              }
                              return part
                            })
                            
                            // Check for emoji headers
                            const hasEmoji = /^[🎯📚💡💪📊📝🔒⚡✅❓✨🌟🎓📐🎴📋🏆🔥⭐]/u.test(line)
                            
                            return (
                              <div key={i} className={cn(
                                hasEmoji && "font-semibold text-base mt-2 first:mt-0"
                              )}>
                                {boldFormatted}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    {!msg.isTyping && (
                      <div className={cn(
                        "text-xs text-muted-foreground px-2 flex items-center gap-1",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {msg.role === 'assistant' && (
                          <Sparkles className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            {uploadedFile && (
              <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || quizMode}
                title="Upload file (PDF, TXT, DOC, DOCX)"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={quizMode ? "Help limited during quiz..." : uploadedFile ? "Ask about the file..." : "Type your question..."}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={(!inputMessage.trim() && !uploadedFile) || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-primary">
                <Mic className="w-3 h-3" /> Voice
              </button>
              <button className="flex items-center gap-1 hover:text-primary">
                <Volume2 className="w-3 h-3" /> Read aloud
              </button>
              <span className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" /> Upload files
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
