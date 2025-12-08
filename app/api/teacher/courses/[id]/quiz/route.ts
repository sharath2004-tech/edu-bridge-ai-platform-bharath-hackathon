import { getSession } from '@/lib/auth'
import { Course } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    if (String(course.instructor) !== session.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to modify this course' },
        { status: 403 }
      )
    }

    const { title, questions, passingScore } = await request.json()

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title and questions are required' },
        { status: 400 }
      )
    }

    course.quizzes.push({
      title,
      questions,
      passingScore: passingScore || 70
    })

    await course.save()

    return NextResponse.json(
      { success: true, data: course },
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
