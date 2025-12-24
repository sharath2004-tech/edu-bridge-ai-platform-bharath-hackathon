import { getSession } from '@/lib/auth'
import ChatMessage from '@/lib/models/ChatMessage'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// Gemini API Integration (Primary)
async function generateGeminiResponse(userMessage: string, language: string, chatHistory: any[]): Promise<string> {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured, falling back to Cohere')
      return generateCohereResponse(userMessage, language, chatHistory)
    }

    // Build conversation history for context
    const conversationHistory = chatHistory
      .slice(-5) // Last 5 messages for context
      .reverse()
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

    const systemPrompt = `You are EduBridge AI, a helpful learning assistant for students. Your role is to:
- Provide clear, educational explanations
- Encourage students with positive feedback
- Break down complex topics into simple steps
- Support multiple regional languages (English, Telugu, Hindi, Tamil, Kannada)
- Never directly give quiz answers
- Be encouraging and motivational

Current language preference: ${language}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40
          }
        }),
      }
    )

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text())
      console.log('Falling back to Cohere...')
      return generateCohereResponse(userMessage, language, chatHistory)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (generatedText) {
      return generatedText
    } else {
      console.log('No text generated from Gemini, falling back to Cohere...')
      return generateCohereResponse(userMessage, language, chatHistory)
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    console.log('Falling back to Cohere...')
    return generateCohereResponse(userMessage, language, chatHistory)
  }
}

// Cohere API Integration (Fallback)
async function generateCohereResponse(userMessage: string, language: string, chatHistory: any[]): Promise<string> {
  try {
    const COHERE_API_KEY = process.env.COHERE_API_KEY
    
    if (!COHERE_API_KEY) {
      console.error('COHERE_API_KEY not configured, using static fallback')
      return generateFallbackResponse(userMessage, language)
    }

    // Build conversation history for context
    const conversationHistory = chatHistory
      .slice(-5) // Last 5 messages for context
      .reverse()
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    const systemPrompt = `You are EduBridge AI, a helpful learning assistant for students. Your role is to:
- Provide clear, educational explanations
- Encourage students with positive feedback
- Break down complex topics into simple steps
- Support multiple regional languages (English, Telugu, Hindi, Tamil, Kannada)
- Never directly give quiz answers
- Be encouraging and motivational

Current language preference: ${language}
${conversationHistory ? `\n\nPrevious conversation:\n${conversationHistory}` : ''}`

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        model: 'command-r-plus-08-2024',
        preamble: systemPrompt,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error('Cohere API error:', response.status, await response.text())
      return generateFallbackResponse(userMessage, language)
    }

    const data = await response.json()
    return data.text || generateFallbackResponse(userMessage, language)
  } catch (error) {
    console.error('Error calling Cohere API:', error)
    return generateFallbackResponse(userMessage, language)
  }
}

// Fallback response generator for when Cohere API is unavailable
function generateFallbackResponse(userMessage: string, language: string): string {
  const msg = userMessage.toLowerCase()

  // Teacher chat mode
  if (msg.includes('chat with') && msg.includes('teacher')) {
    return "📧 Opening teacher chat... You can now send messages to your teacher. They'll respond when available."
  }

  // Math help
  if (msg.includes('math') || msg.includes('calculate') || msg.includes('solve')) {
    return "📐 I can help with math! Please share your specific question or problem. I'll provide:\n\n1️⃣ Quick answer\n2️⃣ Step-by-step solution\n3️⃣ Key concepts to remember\n\nWhat would you like to learn?"
  }

  // Concept explanation
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('define')) {
    return "💡 I'd be happy to explain! Let me break this down:\n\n1. **Simple explanation**: [Concept in easy words]\n2. **Example**: Real-world application\n3. **Remember**: Key points\n\nWould you like me to explain in your regional language (Telugu, Hindi, Tamil, Kannada)?"
  }

  // Motivation
  if (msg.includes('difficult') || msg.includes('hard') || msg.includes('confused')) {
    return "💪 Don't worry! Learning takes time. Here's what we can do:\n\n🎯 Break the topic into smaller parts\n📚 Review related concepts first\n✏️ Practice similar problems\n🎥 Watch explanation videos\n\nYou're doing great! Keep going! 🌟"
  }

  // Progress tracking
  if (msg.includes('progress') || msg.includes('score') || msg.includes('performance')) {
    return "📊 Let me analyze your learning journey:\n\n✅ **Strengths**: Topics you've mastered\n⚡ **Improving**: Areas showing growth\n🎯 **Focus Areas**: Topics needing attention\n🏆 **Achievements**: Your badges & streaks\n\nWould you like personalized study recommendations?"
  }

  // Notes help
  if (msg.includes('notes') || msg.includes('summary') || msg.includes('flashcard')) {
    return "📝 I can help with your notes!\n\nUpload or share your notes and I'll:\n\n✨ **Summarize** key points\n🎴 **Create flashcards** for quick revision\n📋 **Extract** important concepts\n❓ **Generate practice quizzes**\n\nWhat would you like me to do?"
  }

  // Default helpful response
  return "👋 Hi! I'm your EduBridge AI assistant! I can help you with:\n\n📚 **Subject doubts** - Clear explanations\n🌍 **Regional languages** - Telugu, Hindi, Tamil, Kannada\n📊 **Progress tracking** - Your learning journey\n📝 **Notes analysis** - Summaries & flashcards\n💪 **Practice problems** - Adaptive difficulty\n🎯 **Study tips** - Personalized recommendations\n\nWhat would you like to learn today?"
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { message, quizMode = false, language = 'english', fileContent = '', fileName = '' } = await request.json()

    if (!message && !fileContent) {
      return NextResponse.json(
        { success: false, error: 'Message or file is required' },
        { status: 400 }
      )
    }

    // Get recent chat history for context
    const recentMessages = await ChatMessage.find({ userId: session.id })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean()

    // Prepare message content
    let userMessageContent = message
    if (fileContent) {
      // Truncate file content to prevent token overflow
      const truncatedContent = fileContent.substring(0, 3000)
      userMessageContent = `${message}\n\n[File: ${fileName}]\n${truncatedContent}${fileContent.length > 3000 ? '...(truncated)' : ''}`
    }

    // Save user message
    await ChatMessage.create({
      userId: session.id,
      userName: session.name,
      role: 'user',
      content: userMessageContent,
      language,
      quizMode
    })

    // Check quiz mode first
    let aiResponse: string
    
    if (quizMode && !fileContent) {
      // Quiz Safe Mode - refuse to help
      const quizResponses = {
        english: "🔒 Quiz mode is active. I cannot help during the quiz. Continue your best!",
        telugu: "🔒 క్విజ్ మోడ్ యాక్టివ్ గా ఉంది. క్విజ్ సమయంలో నేను సహాయం చేయలేను. మీ ఉత్తమ ప్రయత్నం కొనసాగించండి!",
        hindi: "🔒 क्विज़ मोड सक्रिय है। मैं क्विज़ के दौरान मदद नहीं कर सकता। अपना सर्वश्रेष्ठ प्रयास जारी रखें!",
        tamil: "🔒 வினாடி வினா முறை செயலில் உள்ளது. வினாடி வினாவின் போது என்னால் உதவ முடியாது. உங்கள் சிறந்த முயற்சியைத் தொடரவும்!",
        kannada: "🔒 ಕ್ವಿಜ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಕ್ವಿಜ್ ಸಮಯದಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನವನ್ನು ಮುಂದುವರಿಸಿ!"
      }
      aiResponse = quizResponses[language as keyof typeof quizResponses] || quizResponses.english
    } else {
      // Generate AI response using Gemini (with Cohere fallback)
      aiResponse = await generateGeminiResponse(message, language, recentMessages)
    }

    // Save AI response
    await ChatMessage.create({
      userId: session.id,
      userName: session.name,
      role: 'assistant',
      content: aiResponse,
      language,
      quizMode
    })

    return NextResponse.json(
      { 
        success: true, 
        response: aiResponse,
        quizMode 
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message', message: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const messages = await ChatMessage.find({ userId: session.id })
      .sort({ timestamp: 1 })
      .limit(50)
      .lean()

    return NextResponse.json(
      { success: true, messages },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages', message: error.message },
      { status: 500 }
    )
  }
}
