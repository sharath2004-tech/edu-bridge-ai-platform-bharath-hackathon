import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all active schools (public endpoint for signup)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      // Verify school code
      const school = await School.findOne({ 
        code: code.toUpperCase(),
        isActive: true 
      }).select('name code type board')
      
      if (!school) {
        return NextResponse.json(
          { success: false, error: 'Invalid school code' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, school })
    }

    // Fetch all active schools
    const schools = await School.find({ isActive: true })
      .select('name code type board city state')
      .sort({ name: 1 })

    return NextResponse.json({ success: true, schools })
  } catch (error: any) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schools', message: error.message },
      { status: 500 }
    )
  }
}
