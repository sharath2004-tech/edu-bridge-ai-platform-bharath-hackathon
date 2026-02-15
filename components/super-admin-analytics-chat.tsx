"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BarChart3, Bot, Download, RefreshCw, Send, Sparkles, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface SuperAdminAnalyticsChatProps {
  className?: string
}

export function SuperAdminAnalyticsChat({ className }: SuperAdminAnalyticsChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "Show me total platform statistics",
    "Compare top 5 schools by student count",
    "List recent student registrations",
    "Show student-teacher ratio analysis",
    "Which schools need more teachers?",
    "Show me active vs inactive schools",
    "Export all student data",
    "Download school statistics report"
  ]

  const handleExport = async (dataType: 'students' | 'teachers' | 'schools' | 'school-stats') => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/super-admin/chatbot/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType, format: 'csv' })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${dataType}_export_${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        const exportMessage: Message = {
          role: 'assistant',
          content: `✅ Successfully exported ${dataType} data as CSV file. The download should start automatically.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, exportMessage])
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      const errorMsg: Message = {
        role: 'assistant',
        content: '❌ Failed to export data. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsExporting(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

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
      const res = await fetch('/api/super-admin/chatbot')
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

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage
    if (!textToSend.trim() || isLoading) return

    // Check for export commands
    const exportMatch = textToSend.toLowerCase().match(/export|download/)
    if (exportMatch) {
      if (textToSend.toLowerCase().includes('student')) {
        await handleExport('students')
        setInputMessage("")
        return
      } else if (textToSend.toLowerCase().includes('teacher')) {
        await handleExport('teachers')
        setInputMessage("")
        return
      } else if (textToSend.toLowerCase().includes('school')) {
        await handleExport('school-stats')
        setInputMessage("")
        return
      }
    }

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
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
      const response = await fetch('/api/super-admin/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          language: 'english'
        })
      })

      const data = await response.json()

      // Remove typing indicator
      setMessages(prev => prev.filter(m => !m.isTyping))

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: `Error: ${data.error || 'Failed to get response'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.filter(m => !m.isTyping))
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
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

  const formatMessageContent = (content: string) => {
    // Convert markdown-like formatting to HTML
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={idx} className="font-bold text-lg mt-3 mb-1">{line.replace(/\*\*/g, '')}</div>
      }
      // Bold inline
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={idx} className="mb-1">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
          </div>
        )
      }
      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return <div key={idx} className="ml-4 mb-1">{line}</div>
      }
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return <div key={idx} className="ml-4 mb-1 font-medium">{line}</div>
      }
      // Emojis and icons
      if (line.includes('📊') || line.includes('🏫') || line.includes('👨‍🎓') || 
          line.includes('👨‍🏫') || line.includes('📚') || line.includes('💡') ||
          line.includes('✅') || line.includes('❌') || line.includes('⚠️') ||
          line.includes('📍') || line.includes('📋') || line.includes('👥') ||
          line.includes('📧') || line.includes('👔')) {
        return <div key={idx} className="mb-2 text-sm">{line}</div>
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>
      }
      // Regular text
      return <div key={idx} className="mb-1">{line}</div>
    })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl",
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          "transition-all duration-300 hover:scale-110 z-50",
          className
        )}
        size="icon"
      >
        <BarChart3 className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-6 w-[450px] h-[650px] shadow-2xl flex flex-col z-50",
        "animate-slideIn border-2 border-purple-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Super Admin Analytics
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </h3>
            <p className="text-xs text-white/80">Database Monitoring & Analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
            title="Clear chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Export Quick Actions */}
      {messages.length > 0 && (
        <div className="px-4 pt-3 pb-2 border-b bg-gradient-to-b from-purple-50 to-white">
          <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
            <Download className="h-3 w-3" />
            Quick Export:
          </p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => handleExport('students')}
              disabled={isExporting}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              Students
            </button>
            <button
              onClick={() => handleExport('teachers')}
              disabled={isExporting}
              className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-all disabled:opacity-50"
            >
              Teachers
            </button>
            <button
              onClick={() => handleExport('schools')}
              disabled={isExporting}
              className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-all disabled:opacity-50"
            >
              Schools
            </button>
            <button
              onClick={() => handleExport('school-stats')}
              disabled={isExporting}
              className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-all disabled:opacity-50"
            >
              Statistics
            </button>
          </div>
        </div>
      )}

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div className="p-4 border-b bg-gradient-to-b from-purple-50 to-white">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Quick Questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 3).map((question, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(question)}
                className="text-xs px-3 py-1.5 bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 text-left"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-10 w-10 text-purple-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-800 mb-2">
              Super Admin Analytics Assistant
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Ask me anything about your platform data:
            </p>
            <ul className="text-xs text-left text-gray-500 space-y-1 bg-white p-4 rounded-lg border">
              <li>• School comparisons and statistics</li>
              <li>• Student and teacher analytics</li>
              <li>• Platform performance metrics</li>
              <li>• Resource allocation insights</li>
              <li>• Trend analysis and reporting</li>
            </ul>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 animate-slideInBottom",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm",
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto'
                  : 'bg-white border border-gray-200'
              )}
            >
              {message.isTyping ? (
                <div className="flex gap-1 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <div className={cn(
                  "text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === 'assistant' ? 'text-gray-800' : ''
                )}>
                  {message.role === 'assistant' ? formatMessageContent(message.content) : message.content}
                </div>
              )}
              <div className={cn(
                "text-xs mt-2 opacity-70",
                message.role === 'user' ? 'text-white' : 'text-gray-500'
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about platform data..."
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        {messages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {quickQuestions.slice(3).map((question, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(question)}
                className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-all duration-200"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
