import { authenticateAndAuthorize } from '@/lib/auth-middleware';
import { CohereClient } from 'cohere-ai';
import { NextRequest, NextResponse } from 'next/server';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

// AI chatbot powered by Cohere for educational assistance
// Accessible to all authenticated users from any school
export async function POST(req: NextRequest) {
  try {
    // Authenticate user - all roles can access chatbot
    const authResult = authenticateAndAuthorize(req, {
      requiredRoles: ['super-admin', 'admin', 'principal', 'teacher', 'student'],
    });

    if (authResult instanceof NextResponse) {
      console.log('❌ Chatbot auth failed')
      return authResult;
    }

    const user = authResult;
    console.log('💬 Chatbot request from:', user.role, user.name)
    
    const { message, conversationHistory } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build context based on user role
    const roleContext = getRoleContext(user.role, user.name);

    // Use Cohere AI to generate response
    const response = await generateAIResponse(message, roleContext, conversationHistory);

    console.log('✅ Chatbot response generated successfully')

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process chatbot request' },
      { status: 500 }
    );
  }
}

function getRoleContext(role: string, name: string): string {
  const contexts: Record<string, string> = {
    student: `You are an educational assistant helping ${name}, a student. Provide clear explanations, study tips, and guidance on coursework. Be encouraging and supportive.`,
    teacher: `You are an educational assistant helping ${name}, a teacher. Provide teaching strategies, classroom management tips, and content creation guidance.`,
    principal: `You are an administrative assistant helping ${name}, a principal. Provide insights on school management, enrollment, and educational leadership.`,
    admin: `You are an administrative assistant helping ${name}, a school admin. Provide insights on school management, student oversight, and administrative tasks.`,
    'super-admin': `You are an administrative assistant helping ${name}, a super admin. Provide platform management and multi-school oversight guidance.`,
  };

  return contexts[role] || contexts['student'];
}

async function generateAIResponse(
  message: string,
  context: string,
  history?: any[]
): Promise<string> {
  try {
    if (!process.env.COHERE_API_KEY) {
      console.warn('⚠️ COHERE_API_KEY not configured, using fallback response')
      return getFallbackResponse();
    }

    // Build chat history for context with proper typing
    const chatHistory: { role: 'USER' | 'CHATBOT'; message: string }[] = history?.slice(-10).map((msg: any) => ({
      role: (msg.role === 'user' ? 'USER' : 'CHATBOT') as 'USER' | 'CHATBOT',
      message: msg.content as string,
    })) || [];

    // System preamble with educational context
    const preamble = `${context}

You are an intelligent educational assistant integrated into the EduBridge AI Platform. Your role is to:
- Help students with their studies, homework, and learning strategies
- Assist teachers with teaching methods and classroom management
- Support principals with administrative tasks and school management
- Answer questions about courses, assignments, quizzes, and platform features
- Provide study tips, exam preparation advice, and educational guidance
- Be friendly, encouraging, and supportive in all interactions

Platform Features:
- Courses: Browse and enroll in courses with lessons and quizzes
- Dashboard: Track progress and analytics
- Community: Connect with peers and participate in discussions
- Analytics: View performance metrics and improvement areas

Always be helpful, educational, and maintain a positive tone. If you don't know something, admit it honestly.`;

    console.log('🤖 Calling Cohere API...')
    const response = await cohere.chat({
      model: 'command-r-plus',
      message: message,
      chatHistory: chatHistory,
      preamble: preamble,
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('✅ Cohere API responded')
    return response.text || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error: any) {
    console.error('❌ Cohere API error:', error.message)
    // Fallback to basic response if Cohere fails
    return getFallbackResponse();
  }
}

function getFallbackResponse(): string {
  return `I'm here to help with your educational journey! I can assist with:

📚 **Courses** - Browse, enroll, and learn
📝 **Study Tips** - Exam preparation and learning strategies
📊 **Analytics** - Track your progress
👥 **Community** - Connect with peers
⚙️ **Platform** - Navigate and use features

What would you like to know more about?`;
}
