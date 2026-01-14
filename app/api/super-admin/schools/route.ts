import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sendSchoolApprovalEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const schools = await School.find()
      .select('-__v')
      .sort({ name: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      schools,
      count: schools.length
    })
  } catch (error: any) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const data = await request.json()
    const { schoolId, ...updateData } = data

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    // If school was just approved, send approval email to admin
    if (updateData.isActive === true && school.isActive) {
      try {
        // Find the admin/principal for this school
        const admin = await User.findOne({ 
          schoolId: school._id, 
          role: { $in: ['admin', 'principal'] } 
        })
        
        if (admin) {
          await sendSchoolApprovalEmail(
            admin.email,
            admin.name,
            school.name
          )
        }
      } catch (emailError) {
        console.error('Error sending approval email:', emailError)
        // Don't fail the approval if email fails
      }
    }

    return NextResponse.json(
      { success: true, school, message: 'School updated successfully' }
    )
  } catch (error: any) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update school', message: error.message },
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

    const data = await request.json()
    const { schoolId } = data

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    // Find the school first
    const school = await School.findById(schoolId)
    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    // Delete all users associated with this school
    await User.deleteMany({ schoolId: schoolId })

    // Delete the school
    await School.findByIdAndDelete(schoolId)

    return NextResponse.json({
      success: true,
      message: 'School and associated users deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete school', message: error.message },
      { status: 500 }
    )
  }
}
