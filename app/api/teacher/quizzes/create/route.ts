import { getSession } from '@/lib/auth'
import StandaloneQuiz from '@/lib/models/StandaloneQuiz'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { title, subject, description, questions, passingScore, status } = await request.json()

    if (!title || !subject || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title, subject, and questions are required' },
        { status: 400 }
      )
    }

    const quiz = await StandaloneQuiz.create({
      title,
      subject,
      description,
      instructor: session.id,
      questions,
      passingScore: passingScore || 70,
      status: status || 'draft'
    })

    return NextResponse.json(
      { success: true, data: quiz },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quiz', message: error.message },
      { status: 500 }
    )
  }
}
