import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role, schoolId, classId } = await req.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please fill in all required fields (name, email, password)' 
      }, { status: 400 })
    }

    // SECURITY: Only allow students to self-register
    // Teachers and principals must be created by school admins
    if (role && role !== 'student') {
      return NextResponse.json({ 
        success: false, 
        error: 'Only students can self-register. Teachers and principals must be added by school administrators.' 
      }, { status: 403 })
    }

    // Validate school is provided for students
    if (!schoolId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please select a school from the list or enter a valid school code' 
      }, { status: 400 })
    }

    // Validate class is provided for students
    if (!classId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please select your class from the list' 
      }, { status: 400 })
    }

    // Verify the school exists and is active
    const School = (await import('@/lib/models/School')).default
    const school = await School.findById(schoolId)
    if (!school) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid school selected. Please choose a valid school.' 
      }, { status: 400 })
    }
    if (!school.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'This school is not yet activated. Please contact your school administrator or wait for approval.' 
      }, { status: 400 })
    }

    // Verify the class exists and belongs to the school
    const Class = (await import('@/lib/models/Class')).default
    const classDoc = await Class.findById(classId)
    if (!classDoc || String(classDoc.schoolId) !== String(schoolId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid class selected. Please choose a valid class from your school.' 
      }, { status: 400 })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'An account with this email already exists. Please login instead.' 
      }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const userData: any = { 
      name, 
      email, 
      password: hashed, 
      role: 'student', // Always student for self-registration
      schoolId: schoolId,
      classId: classId,
      className: classDoc.className,
      section: classDoc.section,
      isActive: false, // Inactive until approved
      isPending: true, // Pending approval from class teacher
    }

    const newUser = await User.create(userData)
    // Handle both array and single document returns
    const user = Array.isArray(newUser) ? newUser[0] : newUser

    // Create notification for class teacher
    const Notification = (await import('@/lib/models/Notification')).default
    
    // Notify class teacher if assigned
    if (classDoc.classTeacherId) {
      await Notification.create({
        userId: classDoc.classTeacherId,
        schoolId: schoolId,
        type: 'student_registration',
        title: 'New Student Registration',
        message: `${name} has registered for ${classDoc.className} - Section ${classDoc.section} and is awaiting your approval.`,
        relatedUser: user._id,
        relatedClass: classDoc._id,
        data: {
          studentName: name,
          studentEmail: email,
          className: classDoc.className,
          section: classDoc.section,
        },
        isRead: false,
        actionRequired: true,
        actionUrl: `/teacher/students?pending=true`,
      })
    }

    // Also notify admin and principal
    const admins = await User.find({
      schoolId: schoolId,
      role: { $in: ['admin', 'principal'] },
      isActive: true
    }).select('_id')

    if (admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        userId: admin._id,
        schoolId: schoolId,
        type: 'student_registration',
        title: 'New Student Registration',
        message: `${name} has registered for ${classDoc.className} - Section ${classDoc.section} and is awaiting approval.`,
        relatedUser: user._id,
        relatedClass: classDoc._id,
        data: {
          studentName: name,
          studentEmail: email,
          className: classDoc.className,
          section: classDoc.section,
        },
        isRead: false,
        actionRequired: true,
        actionUrl: `/principal/students?pending=true`,
      }))
      await Notification.insertMany(adminNotifications)
    }

    const payload = { 
      id: String(user._id), 
      role: user.role, 
      name: user.name, 
      email: user.email,
      schoolId: user.schoolId ? String(user.schoolId) : undefined,
      isPending: true, // Student is pending approval
    }
    const res = NextResponse.json({ 
      success: true, 
      data: payload,
      message: 'Registration successful! Your account is pending approval from your class teacher. You will be notified once approved.'
    }, { status: 201 })
    
    // Cookie settings that work on Vercel
    res.cookies.set('edubridge_session', JSON.stringify(payload), {
      httpOnly: true,
      secure: true, // Always use secure for production (Vercel uses HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Registration failed. Please try again or contact support.' 
    }, { status: 500 })
  }
}
