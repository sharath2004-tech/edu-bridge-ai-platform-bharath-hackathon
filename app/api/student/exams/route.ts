import { getSession } from '@/lib/auth'
import Exam from '@/lib/models/Exam'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get user's classId
    const User = (await import('@/lib/models/User')).default
    const user = await User.findById(session.userId).select('classId')

    if (!user || !user.classId) {
      return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 })
    }

    const exams = await Exam.find({
      classId: user.classId,
      schoolId: session.schoolId
    })
      .select('examName examType date term totalMarks')
      .sort({ date: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      exams
    })
  } catch (error: any) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
