import { getSession } from '@/lib/auth'
import Class from '@/lib/models/Class'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const query: any = {}
    if (session.role === 'teacher') {
      query.schoolId = session.schoolId
      // Optionally filter by assigned classes
    } else if (session.role === 'principal') {
      query.schoolId = session.schoolId
    }

    const classes = await Class.find(query)
      .populate('schoolId', 'name code')
      .populate('classTeacherId', 'name email')
      .select('-__v')
      .sort({ className: 1, section: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      classes
    })
  } catch (error: any) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
