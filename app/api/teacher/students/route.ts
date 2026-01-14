import { getSession } from '@/lib/auth'
import { generatePassword, sendAdminCredentials } from '@/lib/email'
import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// Teacher: create student accounts
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    await connectDB()
    const body = await req.json()
    const { name, email, rollNo, classId, parentName, parentPhone, phone, password, sendEmail } = body

    if (!name || !email || !classId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 })
    }

    // Generate password if not provided
    const generatedPassword = password || generatePassword(12)
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)
    
    // Get school info for email
    const school = await School.findById(session.schoolId)
    
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      role: 'student',
      schoolId: session.schoolId,
      classId,
      rollNo,
      parentName,
      parentPhone,
      phone,
      isActive: true,
      mustChangePassword: !password // If auto-generated, must change password
    })

    // Send email if requested
    if (sendEmail && !password && school) {
      try {
        await sendAdminCredentials(
          email.toLowerCase(),
          name,
          school.name,
          school.code,
          generatedPassword
        )
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      student: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        rollNo: user.rollNo
      },
      credentials: (sendEmail || password) ? undefined : {
        email: email.toLowerCase(),
        password: generatedPassword
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Teacher: list students with pagination and class filter
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const query: any = {
      role: 'student',
      schoolId: session.schoolId
    }

    if (classId) {
      query.classId = classId
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit
    const total = await User.countDocuments(query)
    
    const students = await User.find(query)
      .populate('classId', 'className section')
      .select('-password -__v')
      .sort({ rollNo: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({ 
      success: true, 
      students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
