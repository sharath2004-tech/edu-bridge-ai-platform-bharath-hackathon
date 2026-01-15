import { getSession } from '@/lib/auth'
import { User } from '@/lib/models'
import Notification from '@/lib/models/Notification'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch pending student registrations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['teacher', 'principal', 'admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const query: any = {
      role: 'student',
      schoolId: session.schoolId,
      isPending: true,
      isActive: false,
    }

    // If teacher, filter by their assigned classes
    if (session.role === 'teacher') {
      const teacher = await User.findById(session.userId).select('assignedClasses')
      if (teacher && teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        const classIds = teacher.assignedClasses.map((cls: any) => 
          typeof cls === 'string' ? cls : cls.toString()
        )
        query.classId = { $in: classIds }
      } else {
        return NextResponse.json({
          success: true,
          students: [],
          message: 'No assigned classes'
        })
      }
    }

    if (classId) {
      query.classId = classId
    }

    const students = await User.find(query)
      .select('name email className section classId createdAt')
      .populate('classId', 'className section')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      students,
      count: students.length
    })
  } catch (error: any) {
    console.error('Error fetching pending students:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Approve or reject student registration
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['teacher', 'principal', 'admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { studentId, action } = await request.json() // action: 'approve' or 'reject'

    if (!studentId || !action) {
      return NextResponse.json(
        { success: false, error: 'Student ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const student = await User.findOne({
      _id: studentId,
      schoolId: session.schoolId,
      role: 'student',
      isPending: true
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found or already processed' },
        { status: 404 }
      )
    }

    // If teacher, verify they are assigned to this class
    if (session.role === 'teacher') {
      const teacher = await User.findById(session.userId).select('assignedClasses')
      if (teacher && teacher.assignedClasses) {
        const classIds = teacher.assignedClasses.map((cls: any) => 
          typeof cls === 'string' ? cls : cls.toString()
        )
        if (!classIds.includes(String(student.classId))) {
          return NextResponse.json(
            { success: false, error: 'You are not authorized to approve this student' },
            { status: 403 }
          )
        }
      }
    }

    if (action === 'approve') {
      // Approve the student
      student.isPending = false
      student.isActive = true
      await student.save()

      // Create notification for student
      await Notification.create({
        userId: student._id,
        schoolId: session.schoolId,
        type: 'general',
        title: 'Registration Approved',
        message: `Your registration for ${student.className} - Section ${student.section} has been approved. You can now access all features.`,
        isRead: false,
        actionRequired: false,
      })

      // Mark related notifications as read
      await Notification.updateMany(
        {
          relatedUser: studentId,
          type: 'student_registration',
          schoolId: session.schoolId
        },
        {
          isRead: true,
          readAt: new Date()
        }
      )

      return NextResponse.json({
        success: true,
        message: 'Student approved successfully'
      })
    } else {
      // Reject the student - delete the account
      await User.findByIdAndDelete(studentId)

      // Delete related notifications
      await Notification.deleteMany({
        relatedUser: studentId,
        type: 'student_registration',
        schoolId: session.schoolId
      })

      return NextResponse.json({
        success: true,
        message: 'Student registration rejected'
      })
    }
  } catch (error: any) {
    console.error('Error processing student approval:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
