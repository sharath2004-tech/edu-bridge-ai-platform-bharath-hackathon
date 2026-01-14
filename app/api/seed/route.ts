import { Attendance, Class, Content, Course, Exam, Mark, School, Section, Subject, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Connect to database with retry logic
    let retries = 3
    while (retries > 0) {
      try {
        if (mongoose.connection.readyState !== 1) {
          console.log('Connecting to MongoDB...')
          await connectDB()
        }
        // Test connection
        await mongoose.connection.db.admin().ping()
        console.log('MongoDB connection verified')
        break
      } catch (err: any) {
        retries--
        console.log(`Connection attempt failed. Retries left: ${retries}`)
        if (retries === 0) throw err
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log('Starting database cleanup...')
    // Clear existing data by deleting all documents
    await Promise.all([
      User.deleteMany({}),
      School.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Exam.deleteMany({}),
      Mark.deleteMany({}),
      Attendance.deleteMany({}),
      Section.deleteMany({}),
      Content.deleteMany({}),
      Course.deleteMany({}),
    ])
    console.log('Database cleaned successfully')

    // ==================== SUPER ADMIN ====================
    const superAdminPassword = await bcrypt.hash('superadmin123', 10)
    await User.create({
      name: 'System Administrator',
      email: 'superadmin@edubridge.com',
      password: superAdminPassword,
      role: 'super-admin',
      phone: '+1-555-0100',
      bio: 'Platform super administrator with full system access',
      isActive: true,
    })

    // ==================== ADMIN ====================
    const adminPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@edubridge.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1-555-0101',
      bio: 'Platform administrator with school management access',
      isActive: true,
    })

    // ==================== SCHOOLS ====================
    const school1 = await School.create({
      name: 'Green Valley High School',
      code: 'GVHS2025',
      email: 'info@greenvalley.edu',
      phone: '+19 9110583958',
      address: {
        street: '123 Education Lane',
        city: 'Springfield',
        state: 'California',
        country: 'USA',
        zipCode: '90210',
      },
      principal: {
        name: 'Dr. Robert Anderson',
        email: 'robert.anderson@greenvalley.edu',
        phone: '+1-555-0102',
      },
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GVHS',
      website: 'https://greenvalley.edu',
      established: new Date('1985-08-15'),
      type: 'secondary',
      board: 'CBSE',
      isActive: true,
    })

    const school2 = await School.create({
      name: 'Sunrise International School',
      code: 'SRIS2025',
      email: 'contact@sunriseschool.edu',
      phone: '+1-555-0201',
      address: {
        street: '456 Knowledge Boulevard',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        zipCode: '90001',
      },
      principal: {
        name: 'Mrs. Patricia Martinez',
        email: 'patricia.martinez@sunriseschool.edu',
        phone: '+1-555-0202',
      },
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SRIS',
      website: 'https://sunriseschool.edu',
      established: new Date('1998-06-01'),
      type: 'higher-secondary',
      board: 'ICSE',
      isActive: true,
    })

    const school3 = await School.create({
      name: 'Oakwood Academy',
      code: 'OWAC2025',
      email: 'admissions@oakwoodacademy.edu',
      phone: '+1-555-0301',
      address: {
        street: '789 Wisdom Street',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        zipCode: '94102',
      },
      principal: {
        name: 'Dr. Jennifer Wilson',
        email: 'jennifer.wilson@oakwoodacademy.edu',
        phone: '+1-555-0302',
      },
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=OWAC',
      website: 'https://oakwoodacademy.edu',
      established: new Date('2005-01-20'),
      type: 'secondary',
      board: 'State Board',
      isActive: true,
    })

    // ==================== PRINCIPALS ====================
    const principalPassword = await bcrypt.hash('principal123', 10)

    await User.insertMany([
      {
        name: 'Dr. Robert Anderson',
        email: 'robert.anderson@greenvalley.edu',
        password: principalPassword,
        role: 'principal',
        schoolId: school1._id,
        phone: '+1-555-0102',
        bio: 'Experienced educator with 20 years in administration',
        isActive: true,
      },
      {
        name: 'Mrs. Patricia Martinez',
        email: 'patricia.martinez@sunriseschool.edu',
        password: principalPassword,
        role: 'principal',
        schoolId: school2._id,
        phone: '+1-555-0202',
        bio: 'Educational leader focused on student-centered learning',
        isActive: true,
      },
      {
        name: 'Dr. Jennifer Wilson',
        email: 'jennifer.wilson@oakwoodacademy.edu',
        password: principalPassword,
        role: 'principal',
        schoolId: school3._id,
        phone: '+1-555-0302',
        bio: 'Advocate for innovative teaching methodologies',
        isActive: true,
      },
    ])

    // ==================== CLASSES ====================
    const classNames = ['LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']
    const sections = ['A', 'B', 'C']
    const allClasses: any[] = []

    for (const school of [school1, school2, school3]) {
      for (const className of classNames) {
        for (const section of sections) {
          const classDoc = await Class.create({
            schoolId: school._id,
            className,
            section,
            academicYear: '2024-2025',
            strength: 0,
          })
          allClasses.push(classDoc)
        }
      }
    }

    // ==================== TEACHERS ====================
    const teacherPassword = await bcrypt.hash('teacher123', 10)

    // Green Valley High School Teachers
    const gvhsTeachers = await User.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1001',
        subjectSpecialization: 'Mathematics',
        teacherRole: 'HOD',
        bio: 'Mathematics HOD with 15 years of teaching experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        isActive: true,
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1002',
        subjectSpecialization: 'Computer Science',
        teacherRole: 'Teacher',
        bio: 'Computer Science educator passionate about programming',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        isActive: true,
      },
      {
        name: 'Ms. Emily Rodriguez',
        email: 'emily.rodriguez@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1003',
        subjectSpecialization: 'English',
        teacherRole: 'Vice Principal',
        bio: 'English Literature expert and published author',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        isActive: true,
      },
      {
        name: 'Dr. James Williams',
        email: 'james.williams@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1004',
        subjectSpecialization: 'Physics',
        teacherRole: 'HOD',
        bio: 'Physics HOD with PhD in Applied Physics',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        isActive: true,
      },
    ])

    // Sunrise International School Teachers
    const srisTeachers = await User.insertMany([
      {
        name: 'Dr. Amanda Thompson',
        email: 'amanda.thompson@sunriseschool.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school2._id,
        phone: '+1-555-2001',
        subjectSpecialization: 'Mathematics',
        teacherRole: 'HOD',
        bio: 'Mathematics department head',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
        isActive: true,
      },
      {
        name: 'Mr. Carlos Rivera',
        email: 'carlos.rivera@sunriseschool.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school2._id,
        phone: '+1-555-2002',
        subjectSpecialization: 'Physics',
        teacherRole: 'Teacher',
        bio: 'Physics teacher with experimental learning focus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        isActive: true,
      },
    ])

    // Oakwood Academy Teachers
    const owacTeachers = await User.insertMany([
      {
        name: 'Mrs. Linda Foster',
        email: 'linda.foster@oakwoodacademy.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school3._id,
        phone: '+1-555-3001',
        subjectSpecialization: 'Mathematics',
        teacherRole: 'Teacher',
        bio: 'Mathematics teacher with focus on applied math',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
        isActive: true,
      },
      {
        name: 'Mr. Thomas Wright',
        email: 'thomas.wright@oakwoodacademy.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school3._id,
        phone: '+1-555-3002',
        subjectSpecialization: 'Science',
        teacherRole: 'HOD',
        bio: 'Science department head',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
        isActive: true,
      },
    ])

    const allTeachers = [...gvhsTeachers, ...srisTeachers, ...owacTeachers]

    // ==================== SUBJECTS ====================
    const subjectsByClass: any = {
      '9th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
      '10th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
      '11th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
      '12th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
    }

    const allSubjects: any[] = []
    const targetClasses = allClasses.filter(c => ['9th', '10th', '11th', '12th'].includes(c.className))

    for (const classDoc of targetClasses) {
      const className = classDoc.className
      const subjectNames = subjectsByClass[className] || []
      const teacher = allTeachers.find(t => t.schoolId.equals(classDoc.schoolId))
      
      for (const subjectName of subjectNames) {
        const subject = await Subject.create({
          schoolId: classDoc.schoolId,
          classId: classDoc._id,
          subjectName,
          subjectCode: `${className}_${subjectName.substring(0, 3).toUpperCase()}`,
          teacherId: teacher?._id,
          description: `${subjectName} curriculum for ${className}`,
          totalLessons: Math.floor(Math.random() * 20) + 30,
          isActive: true,
        })
        allSubjects.push(subject)
      }
    }

    // ==================== STUDENTS & DATA ====================
    const studentPassword = await bcrypt.hash('student123', 10)
    const studentFirstNames = ['Alex', 'Jessica', 'Ryan', 'Sophie', 'David', 'Emma', 'Lucas', 'Olivia', 'Ethan', 'Ava', 'Noah', 'Isabella', 'Liam', 'Mia', 'Mason']
    const studentLastNames = ['Thompson', 'Martinez', 'Patel', 'Anderson', 'Kim', 'Wilson', 'Brown', 'Davis', 'Garcia', 'Miller']
    const parentNames = ['John', 'Mary', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth']

    let totalStudents = 0
    let totalMarks = 0
    let totalAttendance = 0

    // ==================== EXAMS ====================
    const examTypes: Array<{ name: string; type: 'unit-test' | 'mid-term' | 'final' | 'quarterly' | 'half-yearly' | 'annual' | 'other'; term: string; date: Date }> = [
      { name: 'Unit Test 1', type: 'unit-test', term: 'Term 1', date: new Date('2024-09-15') },
      { name: 'Mid-Term Exam', type: 'mid-term', term: 'Term 1', date: new Date('2024-10-20') },
    ]

    const allExams: any[] = []
    for (const classDoc of targetClasses) {
      const classSubjects = allSubjects.filter(s => s.classId.equals(classDoc._id))
      
      for (const examType of examTypes) {
        const exam = await Exam.create({
          schoolId: classDoc.schoolId,
          classId: classDoc._id,
          examName: examType.name,
          examType: examType.type,
          date: examType.date,
          term: examType.term,
          academicYear: '2024-2025',
          totalMarks: 100,
          duration: 180,
          subjects: classSubjects.map(s => s._id),
          instructions: `Answer all questions. Duration: 3 hours.`,
          isActive: true,
        })
        allExams.push(exam)
      }
    }

    // Create 20 students per targeted class with marks and attendance
    for (const classDoc of targetClasses) {
      const studentsData = []
      
      for (let i = 0; i < 20; i++) {
        const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)]
        const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)]
        const parentFirstName = parentNames[Math.floor(Math.random() * parentNames.length)]
        
        studentsData.push({
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${classDoc.className}.${classDoc.section}.${i}@student.edu`.replace(/\s/g, ''),
          password: studentPassword,
          role: 'student',
          schoolId: classDoc.schoolId,
          classId: classDoc._id,
          rollNo: i + 1,
          parentName: `${parentFirstName} ${lastName}`,
          parentPhone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          bio: `${classDoc.className} grade student at ${classDoc.section} section`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
          isActive: true,
          className: classDoc.className,
          section: classDoc.section,
          rollNumber: `${classDoc.className}${classDoc.section}${String(i + 1).padStart(2, '0')}`,
        })
      }
      
      // Insert all students at once
      const students = await User.insertMany(studentsData)
      totalStudents += students.length

      // Create marks for all students
      const classExams = allExams.filter(e => e.classId.equals(classDoc._id))
      const classSubjects = allSubjects.filter(s => s.classId.equals(classDoc._id))
      const marksData = []
      
      for (const student of students) {
        for (const exam of classExams) {
          for (const subject of classSubjects) {
            const marksScored = Math.floor(Math.random() * 60) + 40
            const teacher = allTeachers.find(t => t.schoolId.equals(exam.schoolId))
            
            marksData.push({
              schoolId: exam.schoolId,
              examId: exam._id,
              studentId: student._id,
              subjectId: subject._id,
              marksScored,
              totalMarks: 100,
              remarks: marksScored >= 80 ? 'Excellent' : marksScored >= 60 ? 'Good' : 'Needs improvement',
              markedBy: teacher?._id,
            })
          }
        }
      }
      
      if (marksData.length > 0) {
        await Mark.insertMany(marksData)
        totalMarks += marksData.length
      }

      // Create attendance for all students
      const attendanceStatuses = ['Present', 'Present', 'Present', 'Present', 'Absent', 'Late']
      const today = new Date()
      const attendanceData = []
      
      for (const student of students) {
        for (let d = 30; d > 0; d--) {
          const date = new Date(today)
          date.setDate(date.getDate() - d)
          if (date.getDay() === 0 || date.getDay() === 6) continue
          
          const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)]
          const teacher = allTeachers.find(t => t.schoolId.equals(student.schoolId))
          
          attendanceData.push({
            schoolId: student.schoolId,
            studentId: student._id,
            date,
            status,
            markedBy: teacher?._id,
            className: classDoc.className,
            section: classDoc.section,
          })
        }
      }
      
      if (attendanceData.length > 0) {
        await Attendance.insertMany(attendanceData)
        totalAttendance += attendanceData.length
      }

      // Update class strength
      await Class.updateOne({ _id: classDoc._id }, { strength: students.length })

      // Assign class teacher
      const classTeacher = allTeachers.find(t => t.schoolId.equals(classDoc.schoolId))
      if (classTeacher) {
        await Class.updateOne({ _id: classDoc._id }, { classTeacherId: classTeacher._id })
        await User.updateOne({ _id: classTeacher._id }, { $addToSet: { assignedClasses: classDoc._id } })
      }
    }

    // Update teachers' assigned subjects
    for (const teacher of allTeachers) {
      const teacherSubjects = allSubjects.filter(s => s.schoolId.equals(teacher.schoolId))
      await User.updateOne({ _id: teacher._id }, { assignedSubjects: teacherSubjects.map(s => s._id) })
    }

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully with new schema!',
      summary: {
        superAdmin: 1,
        schools: 3,
        principals: 3,
        teachers: allTeachers.length,
        classes: allClasses.length,
        subjects: allSubjects.length,
        students: totalStudents,
        exams: allExams.length,
        marks: totalMarks,
        attendance: totalAttendance,
      },
      credentials: {
        superAdmin: 'superadmin@edubridge.com / superadmin123',
        principal: 'robert.anderson@greenvalley.edu / principal123',
        teacher: 'sarah.johnson@greenvalley.edu / teacher123',
        student: 'Check generated emails / student123',
      },
      schools: [
        { name: school1.name, code: school1.code },
        { name: school2.name, code: school2.code },
        { name: school3.name, code: school3.code },
      ],
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
