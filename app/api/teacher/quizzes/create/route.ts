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

    console.log('Creating quiz with class assignment:', {
      teacherId: session.id,
      classId,
      className,
      section,
      title,
      status: status || 'draft'
    })

    const quiz = await StandaloneQuiz.create({
      title,
      subject,
      description,
      instructor: session.id,
      schoolId: session.schoolId,
      classId,
      className,
      section,
      questions,
      passingScore: passingScore || 70,
      status: status || 'draft'
    })

    console.log('Quiz created successfully:', {
      quizId: String(quiz._id),
      classId: String(quiz.classId),
      className: quiz.className,
      section: quiz.section
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
