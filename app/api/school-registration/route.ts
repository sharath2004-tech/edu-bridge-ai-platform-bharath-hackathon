import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { generatePassword, sendAdminCredentials } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const formData = await request.formData()

    // Extract school information
    const schoolName = formData.get('schoolName') as string
    const schoolCode = formData.get('schoolCode') as string
    const schoolType = formData.get('schoolType') as string
    const board = formData.get('board') as string
    const medium = formData.get('medium') as string
    const logo = formData.get('logo') as File | null

    // Extract address
    const addressLine1 = formData.get('addressLine1') as string
    const addressLine2 = formData.get('addressLine2') as string
    const district = formData.get('district') as string
    const state = formData.get('state') as string
    const pincode = formData.get('pincode') as string

    // Extract admin details
    const adminName = formData.get('adminName') as string
    const adminEmail = formData.get('adminEmail') as string
    const adminMobile = formData.get('adminMobile') as string
    const designation = formData.get('designation') as string

    // Validate required fields (password not required from form - will be auto-generated)
    if (!schoolName || !schoolCode || !addressLine1 || !district || !state || !pincode ||
        !adminName || !adminEmail || !adminMobile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if school code already exists
    const existingSchool = await School.findOne({ code: schoolCode.toUpperCase() })
    if (existingSchool) {
      return NextResponse.json(
        { success: false, error: 'School code already exists. Please use a different code.' },
        { status: 400 }
      )
    }

    // Check if school email already exists
    const existingSchoolEmail = await School.findOne({ email: adminEmail.toLowerCase() })
    if (existingSchoolEmail) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered with another school.' },
        { status: 400 }
      )
    }

    // Check if admin email already exists as a user
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Please use a different email.' },
        { status: 400 }
      )
    }

    // Handle logo upload (if provided)
    let logoUrl = ''
    if (logo && logo.size > 0) {
      // In production, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll just store the filename
      logoUrl = `/uploads/logos/${schoolCode.toLowerCase()}-${Date.now()}.${logo.name.split('.').pop()}`
      
      // TODO: Implement actual file upload logic here
      // const uploadResult = await uploadToCloudStorage(logo)
      // logoUrl = uploadResult.url
    }

    // Create school
    const school = await School.create({
      name: schoolName,
      code: schoolCode.toUpperCase(),
      email: adminEmail.toLowerCase(),
      phone: adminMobile,
      address: {
        street: addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1,
        city: district,
        state: state,
        country: 'India',
        zipCode: pincode
      },
      type: getSchoolTypeEnum(schoolType),
      board: board,
      logo: logoUrl,
      isActive: false, // Set to false until admin approves
      subscription: {
        plan: 'free',
        startDate: new Date(),
        maxStudents: 100,
        maxTeachers: 10
      },
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0
      },
      principal: {
        name: adminName,
        email: adminEmail.toLowerCase(),
        phone: adminMobile
      }
    })

    // Generate random password for admin
    const generatedPassword = generatePassword(12)
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)
    
    // Create admin user account (principal role)
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin', // Create as admin for the school
      phone: adminMobile,
      schoolId: school._id,
      bio: `${designation || 'Administrator'} at ${schoolName}`
    })

    // Send email with credentials
    try {
      const emailSent = await sendAdminCredentials(
        adminEmail.toLowerCase(),
        adminName,
        schoolName,
        schoolCode.toUpperCase(),
        generatedPassword
      )
      
      if (!emailSent) {
        console.warn('Email sending failed, but registration completed')
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'School registered successfully. Awaiting admin approval.',
      data: {
        schoolId: school._id,
        schoolName: school.name,
        schoolCode: school.code,
        adminEmail: adminUser.email
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('School registration error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed. Please try again.',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// Helper function to map form values to schema enum
function getSchoolTypeEnum(type: string): 'primary' | 'secondary' | 'higher-secondary' | 'university' | 'institute' {
  const typeMap: Record<string, any> = {
    'government': 'secondary',
    'private': 'secondary',
    'aided': 'secondary',
    'international': 'institute'
  }
  
  return typeMap[type] || 'secondary'
}
