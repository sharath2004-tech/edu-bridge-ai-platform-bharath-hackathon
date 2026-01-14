import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

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
