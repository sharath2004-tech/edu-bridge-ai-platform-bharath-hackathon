import { getSession } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

const QuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quizIndex: { type: Number, required: true },
  answers: { type: Map, of: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
})

const QuizResponse = mongoose.models.QuizResponse || mongoose.model('QuizResponse', QuizResponseSchema)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { courseId, quizIndex, answers, score } = await request.json()

    if (!courseId || quizIndex === undefined || !answers || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const response = await QuizResponse.create({
      studentId: session.id,
      courseId,
      quizIndex,
      answers,
      score
    })

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error saving quiz response:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save response', message: error.message },
      { status: 500 }
    )
  }
}
