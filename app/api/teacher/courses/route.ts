import { getSession } from '@/lib/auth'
import { Course } from '@/lib/models'
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

    const body = await request.json()
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      lessons,
      status,
    } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    const course = await Course.create({
      title,
      description,
      instructor: session.id,
      category,
      level: level || 'beginner',
      price: price || 0,
      duration: duration || 0,
      lessons: lessons || [],
      quizzes: [],
      enrolledStudents: [],
      status: status || 'draft',
      rating: 0,
      reviews: [],
      tags: [],
    })

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course', message: error.message },
      { status: 500 }
    )
  }
}
