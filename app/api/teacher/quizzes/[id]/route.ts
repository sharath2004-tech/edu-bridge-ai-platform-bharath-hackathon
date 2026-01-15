import { getSession } from '@/lib/auth'
import StandaloneQuiz from '@/lib/models/StandaloneQuiz'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch single quiz for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
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

    // Verify the teacher owns this quiz
    if (String(quiz.instructor) !== session.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - not your quiz' },
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

// PUT - Update quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectDB()

    const { title, subject, description, questions, passingScore, status, classId, className, section } = await request.json()

    if (!title || !subject || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title, subject, and questions are required' },
        { status: 400 }
      )
    }

    if (!classId || !className || !section) {
      return NextResponse.json(
        { success: false, error: 'Class and section are required' },
        { status: 400 }
      )
    }

    const quiz = await StandaloneQuiz.findById(id)
    
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Verify the teacher owns this quiz
    if (String(quiz.instructor) !== session.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - not your quiz' },
        { status: 403 }
      )
    }

    // Update quiz
    quiz.title = title
    quiz.subject = subject
    quiz.description = description
    quiz.questions = questions
    quiz.passingScore = passingScore || 70
    quiz.status = status || 'draft'
    quiz.classId = classId
    quiz.className = className
    quiz.section = section

    await quiz.save()

    console.log('Quiz updated:', {
      quizId: String(quiz._id),
      status: quiz.status,
      classId: String(quiz.classId),
      className: quiz.className,
      section: quiz.section
    })

    return NextResponse.json(
      { success: true, data: quiz },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quiz', message: error.message },
      { status: 500 }
    )
  }
}
