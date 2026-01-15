import { getSession } from '@/lib/auth'
import Class from '@/lib/models/Class'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  let session = null
  try {
    session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const query: any = {}
    if (session.role === 'teacher') {
      query.schoolId = session.schoolId
      
      // Filter by teacher's assigned classes
      const User = (await import('@/lib/models/User')).default
      const teacherId = session.userId || session.id
      
      console.log('Fetching teacher data:', { teacherId, sessionUserId: session.userId, sessionId: session.id })
      
      const teacher = await User.findById(teacherId).select('assignedClasses')
      
      console.log('Teacher data:', { 
        userId: teacherId, 
        found: !!teacher,
        assignedClasses: teacher?.assignedClasses,
        assignedClassesLength: teacher?.assignedClasses?.length || 0
      })
      
      if (teacher && teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        // Convert assignedClasses to proper format
        const classIds = teacher.assignedClasses.map((cls: any) => {
          // Handle both ObjectId and string types
          return typeof cls === 'string' ? cls : cls.toString()
        })
        
        console.log('Converted class IDs:', classIds)
        
        // assignedClasses contains Class ObjectIds
        query._id = { $in: classIds }
      } else {
        // Teacher has no assigned classes
        console.log('Teacher has no assigned classes or teacher not found')
        return NextResponse.json({
          success: true,
          classes: [],
          message: 'No classes assigned to this teacher',
          debug: {
            teacherId,
            teacherFound: !!teacher,
            assignedClasses: teacher?.assignedClasses
          }
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
    console.error('Error stack:', error.stack)
    console.error('Session info:', { 
      hasSession: !!session, 
      userId: session?.userId, 
      id: session?.id,
      role: session?.role 
    })
    return NextResponse.json(
      { success: false, error: error.message, details: 'Check server logs for more information' },
      { status: 500 }
    )
  }
}
