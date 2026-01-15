import { getSession } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

const StandaloneQuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'StandaloneQuiz', required: true },
  answers: { type: Map, of: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
})

const StandaloneQuizResponse = mongoose.models.StandaloneQuizResponse || mongoose.model('StandaloneQuizResponse', StandaloneQuizResponseSchema)

export async function POST(
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

    const { answers, score } = await request.json()

    if (!answers || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify quiz exists and is assigned to student's class
    const StandaloneQuiz = (await import('@/lib/models/StandaloneQuiz')).default
    const quiz = await StandaloneQuiz.findById(id).lean()
    
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check if student's class matches the quiz's assigned class
    if (quiz.classId) {
      const User = (await import('@/lib/models/User')).default
      const student = await User.findById(session.id).select('classId').lean()
      
      if (!student?.classId || String(student.classId) !== String(quiz.classId)) {
        return NextResponse.json(
          { success: false, error: 'This quiz is not assigned to your class' },
          { status: 403 }
        )
      }
    }

    const response = await StandaloneQuizResponse.create({
      studentId: session.id,
      quizId: id,
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
