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
      
      // Filter by teacher's assigned classes
      const User = (await import('@/lib/models/User')).default
      const teacher = await User.findById(session.userId).select('assignedClasses')
      
      if (teacher && teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        // assignedClasses can be ObjectIds or class names
        query.$or = [
          { _id: { $in: teacher.assignedClasses } },
          { className: { $in: teacher.assignedClasses } }
        ]
      } else {
        // Teacher has no assigned classes
        return NextResponse.json({
          success: true,
          classes: []
        })
      }
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
