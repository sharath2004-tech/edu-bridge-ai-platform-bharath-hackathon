import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import Mark from '@/lib/models/Mark'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId')

    if (!examId) {
      return NextResponse.json({ success: false, error: 'Exam ID required' }, { status: 400 })
    }

    const marks = await Mark.find({
      studentId: session.userId,
      examId
    })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('markedBy', 'name')
      .select('marksScored totalMarks percentage grade remarks')
      .lean()

    // Calculate stats
    const total = marks.reduce((sum, mark) => sum + mark.marksScored, 0)
    const totalPossible = marks.reduce((sum, mark) => sum + mark.totalMarks, 0)
    const average = marks.length > 0 ? total / marks.length : 0
    const percentage = totalPossible > 0 ? (total / totalPossible) * 100 : 0
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : 
                  percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F'

    return NextResponse.json({
      success: true,
      marks,
      stats: { total, average, percentage, grade }
    })
  } catch (error: any) {
    console.error('Error fetching marks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
