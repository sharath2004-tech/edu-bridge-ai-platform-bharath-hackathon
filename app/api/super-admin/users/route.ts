import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const search = searchParams.get('search')

    // Build query
    const query: any = {}
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (schoolId && schoolId !== 'all') {
      query.schoolId = schoolId
    }
    
    if (classId && classId !== 'all') {
      query.classId = classId
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .populate('schoolId', 'name code')
      .populate('classId', 'className section')
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean()

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
