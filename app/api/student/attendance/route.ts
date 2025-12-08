import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import Attendance from '@/lib/models/Attendance'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || '0')
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    endDate.setHours(23, 59, 59, 999)

    const attendance = await Attendance.find({
      studentId: session.userId,
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .lean()

    // Calculate stats
    const present = attendance.filter(a => a.status === 'Present').length
    const absent = attendance.filter(a => a.status === 'Absent').length
    const late = attendance.filter(a => a.status === 'Late').length
    const total = attendance.length
    const percentage = total > 0 ? (present / total) * 100 : 0

    return NextResponse.json({
      success: true,
      attendance,
      stats: { present, absent, late, total, percentage }
    })
  } catch (error: any) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
