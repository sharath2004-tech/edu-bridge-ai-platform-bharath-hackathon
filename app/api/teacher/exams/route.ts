import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import Exam from '@/lib/models/Exam'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    if (!classId) {
      return NextResponse.json({ success: false, error: 'Class ID required' }, { status: 400 })
    }

    const exams = await Exam.find({
      classId,
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
