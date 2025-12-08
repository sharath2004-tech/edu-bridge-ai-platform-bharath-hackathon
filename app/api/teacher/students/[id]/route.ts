import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const student = await User.findOneAndDelete({
      _id: params.id,
      role: 'student',
      schoolId: session.schoolId
    })

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
