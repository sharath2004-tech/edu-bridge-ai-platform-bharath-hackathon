import { getSession } from '@/lib/auth'
import StandaloneQuiz from '@/lib/models/StandaloneQuiz'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectDB()

    const quiz = await StandaloneQuiz.findById(id).lean()
    
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      )
    }

    if (quiz.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Quiz not available' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: true, data: quiz },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz', message: error.message },
      { status: 500 }
    )
  }
}
