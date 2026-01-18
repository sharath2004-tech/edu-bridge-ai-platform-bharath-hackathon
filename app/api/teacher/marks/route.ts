import { getSession } from '@/lib/auth'
import { Exam, Subject, User } from '@/lib/models'
import Mark from '@/lib/models/Mark'
import connectDB from '@/lib/mongodb'
import { notifyStudentsAboutMarks } from '@/lib/notification-helper'
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

    // Notify students about their marks update
    if (marks.length > 0 && session.schoolId) {
      const studentIds = [...new Set(marks.map(m => m.studentId))]
      const examId = marks[0].examId
      const subjectId = marks[0].subjectId

      // Get exam, subject, and teacher names for notification
      const [exam, subject, teacher] = await Promise.all([
        Exam?.findById(examId).select('name').lean().catch(() => null),
        Subject?.findById(subjectId).select('name').lean().catch(() => null),
        User.findById(session.userId || session.id).select('name').lean()
      ])

      const examName = (exam as any)?.name || 'Exam'
      const subjectName = (subject as any)?.name || 'Subject'
      const teacherName = (teacher as any)?.name || 'Your teacher'

      await notifyStudentsAboutMarks(
        session.schoolId,
        studentIds,
        examName,
        subjectName,
        teacherName,
        (session.userId || session.id),
        examId
      )
    }

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
