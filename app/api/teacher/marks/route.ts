import { getSession } from '@/lib/auth'
import Mark from '@/lib/models/Mark'
import connectDB from '@/lib/mongodb'
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
    const examId = searchParams.get('examId')
    const subjectId = searchParams.get('subjectId')

    if (!classId || !examId || !subjectId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 })
    }

    const marks = await Mark.find({
      examId,
      subjectId,
      schoolId: session.schoolId
    })
      .populate('studentId', 'name rollNo email')
      .select('studentId marksScored totalMarks percentage grade remarks')
      .lean()

    return NextResponse.json({
      success: true,
      marks
    })
  } catch (error: any) {
    console.error('Error fetching marks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { marks } = body

    if (!marks || !Array.isArray(marks)) {
      return NextResponse.json({ success: false, error: 'Invalid marks data' }, { status: 400 })
    }

    // Update or create marks
    const operations = marks.map(mark => ({
      updateOne: {
        filter: {
          studentId: mark.studentId,
          examId: mark.examId,
          subjectId: mark.subjectId,
          schoolId: session.schoolId
        },
        update: {
          $set: {
            marksScored: mark.marksScored,
            totalMarks: mark.totalMarks,
            markedBy: session.userId
          }
        },
        upsert: true
      }
    }))

    await Mark.bulkWrite(operations)

    return NextResponse.json({
      success: true,
      message: 'Marks saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving marks:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
