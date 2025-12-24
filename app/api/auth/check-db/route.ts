import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    
    const userCount = await User.countDocuments()
    const sampleUsers = await User.find().select('email role').limit(5)
    
    return NextResponse.json({ 
      success: true, 
      userCount,
      sampleUsers: sampleUsers.map(u => ({ email: u.email, role: u.role })),
      message: userCount === 0 ? 'Database is empty. Please run seed script.' : 'Database is populated'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Failed to connect to database'
    }, { status: 500 })
  }
}
