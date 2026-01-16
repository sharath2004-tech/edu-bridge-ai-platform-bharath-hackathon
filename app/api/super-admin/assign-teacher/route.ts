import { getSession } from '@/lib/auth'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { teacherId, classId } = await request.json()

    if (!teacherId || !classId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID and Class ID are required' },
        { status: 400 }
      )
    }

    // Find the teacher
    const teacher = await User.findById(teacherId)
    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    if (teacher.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'User is not a teacher' },
        { status: 400 }
      )
    }

    // Check if class is already assigned
    const assignedClasses = teacher.assignedClasses || []
    if (assignedClasses.includes(classId)) {
      return NextResponse.json(
        { success: false, error: 'Teacher is already assigned to this class' },
        { status: 400 }
      )
    }

    // Add class to teacher's assigned classes
    await User.findByIdAndUpdate(
      teacherId,
      { $addToSet: { assignedClasses: classId } },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Teacher assigned to class successfully'
    })
  } catch (error: any) {
    console.error('Error assigning teacher:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    const classId = searchParams.get('classId')

    if (!teacherId || !classId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID and Class ID are required' },
        { status: 400 }
      )
    }

    // Remove class from teacher's assigned classes
    await User.findByIdAndUpdate(
      teacherId,
      { $pull: { assignedClasses: classId } },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Teacher removed from class successfully'
    })
  } catch (error: any) {
    console.error('Error removing teacher assignment:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
