import { getSession } from '@/lib/auth'
import Attendance from '@/lib/models/Attendance'
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
    const date = searchParams.get('date')

    if (!classId || !date) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 })
    }

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    // Query directly with classId for better performance
    const attendance = await Attendance.find({
      classId: classId,
      date: { $gte: startDate, $lte: endDate },
      schoolId: session.schoolId
    })
      .populate('studentId', 'name rollNo email')
      .lean()

    return NextResponse.json({
      success: true,
      attendance: attendance
    })
  } catch (error: any) {
    console.error('Error fetching attendance:', error)
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
    const { attendance } = body

    if (!attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ success: false, error: 'Invalid attendance data' }, { status: 400 })
    }

    // Update or create attendance records
    const operations = attendance.map(att => {
      const date = new Date(att.date)
      date.setHours(0, 0, 0, 0)
      
      return {
        updateOne: {
          filter: {
            studentId: att.studentId,
            classId: att.classId,
            date: date,
            schoolId: session.schoolId
          },
          update: {
            $set: {
              status: att.status,
              classId: att.classId,
              markedBy: session.userId
            }
          },
          upsert: true
        }
      }
    })

    await Attendance.bulkWrite(operations)

    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving attendance:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
