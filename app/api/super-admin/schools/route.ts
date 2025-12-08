import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
