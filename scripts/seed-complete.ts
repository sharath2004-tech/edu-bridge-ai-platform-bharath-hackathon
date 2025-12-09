import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local FIRST
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import bcrypt from 'bcrypt'
import { Attendance, Class, Content, Course, Exam, Mark, School, Section, Subject, User } from '../lib/models'
import Timetable from '../lib/models/Timetable'
import connectDB from '../lib/mongodb'

async function seedCompleteDatabase() {
  try {
    await connectDB()
    console.log('🔌 Connected to MongoDB')
    console.log('🗑️  Clearing existing data...')

    // Clear all collections
    await User.deleteMany({})
    await School.deleteMany({})
    await Class.deleteMany({})
    await Subject.deleteMany({})
    await Exam.deleteMany({})
    await Mark.deleteMany({})
    await Attendance.deleteMany({})
    await Course.deleteMany({})
    await Section.deleteMany({})
    await Content.deleteMany({})
    await Timetable.deleteMany({})

    console.log('✅ All collections cleared')

    // ==================== SUPER ADMIN ====================
    console.log('\n👑 Creating Super Admin...')
    const superAdminPassword = await bcrypt.hash('superadmin123', 10)
    const superAdmin = await User.create({
      name: 'System Administrator',
      email: 'superadmin@edubridge.com',
      password: superAdminPassword,
      role: 'super-admin',
      phone: '+1-555-0100',
      bio: 'Platform super administrator with full system access',
      isActive: true,
    })
    console.log(`   ✓ Super Admin: ${superAdmin.email}`)

    // ==================== SCHOOLS ====================
    console.log('\n🏫 Creating Schools...')
    
    const school1 = await School.create({
      name: 'Green Valley High School',
      code: 'GVHS2025',
      email: 'info@greenvalley.edu',
      phone: '+1-555-0101',
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

    const schools = [school1, school2, school3]
    console.log(`   ✓ Created ${schools.length} schools`)

    // ==================== PRINCIPALS ====================
    console.log('\n🎓 Creating Principals...')
    const principalPassword = await bcrypt.hash('principal123', 10)

    const principal1 = await User.create({
      name: 'Dr. Robert Anderson',
      email: 'robert.anderson@greenvalley.edu',
      password: principalPassword,
      role: 'principal',
      schoolId: school1._id,
      phone: '+1-555-0102',
      bio: 'Experienced educator with 20 years in administration',
      isActive: true,
    })

    const principal2 = await User.create({
      name: 'Mrs. Patricia Martinez',
      email: 'patricia.martinez@sunriseschool.edu',
      password: principalPassword,
      role: 'principal',
      schoolId: school2._id,
      phone: '+1-555-0202',
      bio: 'Educational leader focused on student-centered learning',
      isActive: true,
    })

    const principal3 = await User.create({
      name: 'Dr. Jennifer Wilson',
      email: 'jennifer.wilson@oakwoodacademy.edu',
      password: principalPassword,
      role: 'principal',
      schoolId: school3._id,
      phone: '+1-555-0302',
      bio: 'Advocate for innovative teaching methodologies',
      isActive: true,
    })

    console.log(`   ✓ Created 3 principals`)

    // ==================== CLASSES ====================
    console.log('\n📚 Creating Classes...')
    
    const classNames = ['LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']
    const sections = ['A', 'B', 'C']
    const allClasses: any[] = []

    for (const school of [school1, school2, school3]) {
      const schoolClasses = []
      for (const className of classNames) {
        for (const section of sections) {
          const classDoc = await Class.create({
            schoolId: school._id,
            className,
            section,
            academicYear: '2024-2025',
            strength: 0, // Will be updated after students are created
          })
          schoolClasses.push(classDoc)
          allClasses.push(classDoc)
        }
      }
      console.log(`   ✓ Created ${schoolClasses.length} classes for ${school.name}`)
    }

    // ==================== TEACHERS ====================
    console.log('\n👨‍🏫 Creating Teachers...')
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
      {
        name: 'Mrs. Priya Sharma',
        email: 'priya.sharma@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1005',
        subjectSpecialization: 'Chemistry',
        teacherRole: 'Teacher',
        bio: 'Chemistry teacher specializing in organic chemistry',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        isActive: true,
      },
      {
        name: 'Mr. David Lee',
        email: 'david.lee@greenvalley.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school1._id,
        phone: '+1-555-1006',
        subjectSpecialization: 'Biology',
        teacherRole: 'Teacher',
        bio: 'Biology educator focused on practical learning',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidL',
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
        bio: 'Mathematics department head with innovative teaching methods',
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
        bio: 'Physics teacher with a passion for experimental learning',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        isActive: true,
      },
      {
        name: 'Ms. Rachel Green',
        email: 'rachel.green@sunriseschool.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school2._id,
        phone: '+1-555-2003',
        subjectSpecialization: 'English',
        teacherRole: 'Teacher',
        bio: 'English language and literature specialist',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
        isActive: true,
      },
      {
        name: 'Dr. Kevin Patel',
        email: 'kevin.patel@sunriseschool.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school2._id,
        phone: '+1-555-2004',
        subjectSpecialization: 'Computer Science',
        teacherRole: 'Vice Principal',
        bio: 'Computer Science VP with industry experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
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
        bio: 'Science department head specializing in integrated sciences',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
        isActive: true,
      },
      {
        name: 'Ms. Sophie Baker',
        email: 'sophie.baker@oakwoodacademy.edu',
        password: teacherPassword,
        role: 'teacher',
        schoolId: school3._id,
        phone: '+1-555-3003',
        subjectSpecialization: 'English',
        teacherRole: 'Teacher',
        bio: 'English and communication skills expert',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophieB',
        isActive: true,
      },
    ])

    const allTeachers = [...gvhsTeachers, ...srisTeachers, ...owacTeachers]
    console.log(`   ✓ Created ${allTeachers.length} teachers across all schools`)

    // ==================== SUBJECTS ====================
    console.log('\n📖 Creating Subjects...')

    const subjectsByClass: any = {
      'LKG': ['English', 'Mathematics', 'General Knowledge', 'Art & Craft'],
      'UKG': ['English', 'Mathematics', 'General Knowledge', 'Art & Craft'],
      '1st': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer'],
      '2nd': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer'],
      '3rd': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer'],
      '4th': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer'],
      '5th': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer'],
      '6th': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Hindi'],
      '7th': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Hindi'],
      '8th': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Hindi'],
      '9th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Social Studies', 'Hindi'],
      '10th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Social Studies', 'Hindi'],
      '11th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Economics'],
      '12th': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Economics'],
    }

    const allSubjects: any[] = []

    for (const classDoc of allClasses) {
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

    console.log(`   ✓ Created ${allSubjects.length} subjects across all classes`)

    // ==================== STUDENTS ====================
    console.log('\n👨‍🎓 Creating Students...')
    const studentPassword = await bcrypt.hash('student123', 10)

    const studentFirstNames = [
      'Alex', 'Jessica', 'Ryan', 'Sophie', 'David', 'Emma', 'Lucas', 'Olivia', 'Ethan', 'Ava',
      'Noah', 'Isabella', 'Liam', 'Mia', 'Mason', 'Charlotte', 'Jacob', 'Amelia', 'William', 'Harper',
      'James', 'Evelyn', 'Benjamin', 'Abigail', 'Michael', 'Emily', 'Elijah', 'Elizabeth', 'Daniel', 'Sofia'
    ]
    const studentLastNames = [
      'Thompson', 'Martinez', 'Patel', 'Anderson', 'Kim', 'Wilson', 'Brown', 'Davis', 'Garcia', 'Miller',
      'Rodriguez', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'White', 'Harris', 'Clark'
    ]
    const parentNames = [
      'John', 'Mary', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara',
      'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Daniel', 'Nancy'
    ]

    let totalStudents = 0

    // Create 30 students per class for select classes (9th-12th)
    const targetClasses = allClasses.filter(c => 
      ['9th', '10th', '11th', '12th'].includes(c.className)
    )

    let studentCounter = 0
    for (const classDoc of targetClasses) {
      const studentsInClass = []
      
      for (let i = 0; i < 30; i++) {
        studentCounter++
        const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)]
        const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)]
        const parentFirstName = parentNames[Math.floor(Math.random() * parentNames.length)]
        const parentLastName = lastName // Same last name as student
        
        const student = await User.create({
          name: `${firstName} ${lastName}`,
          email: `student${studentCounter}.${classDoc.className}.${classDoc.section}@student.edu`.replace(/\s/g, ''),
          password: studentPassword,
          role: 'student',
          schoolId: classDoc.schoolId,
          classId: classDoc._id,
          rollNo: i + 1,
          parentName: `${parentFirstName} ${parentLastName}`,
          parentPhone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          bio: `${classDoc.className} grade student at ${classDoc.section} section`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
          isActive: true,
          // Legacy fields for backward compatibility
          className: classDoc.className,
          section: classDoc.section,
          rollNumber: `${classDoc.className}${classDoc.section}${String(i + 1).padStart(2, '0')}`,
        })
        
        studentsInClass.push(student)
        totalStudents++
      }

      // Update class strength
      await Class.updateOne(
        { _id: classDoc._id },
        { strength: studentsInClass.length }
      )

      // Assign class teacher (first teacher of the school)
      const classTeacher = allTeachers.find(t => t.schoolId.equals(classDoc.schoolId))
      if (classTeacher) {
        await Class.updateOne(
          { _id: classDoc._id },
          { classTeacherId: classTeacher._id }
        )
        
        // Update teacher's assigned classes
        await User.updateOne(
          { _id: classTeacher._id },
          { $addToSet: { assignedClasses: classDoc._id } }
        )
      }
    }

    console.log(`   ✓ Created ${totalStudents} students across selected classes`)

    // Update teachers' assigned subjects
    for (const teacher of allTeachers) {
      const teacherSubjects = allSubjects.filter(s => 
        s.schoolId.equals(teacher.schoolId) && 
        s.teacherId?.equals(teacher._id)
      )
      
      await User.updateOne(
        { _id: teacher._id },
        { assignedSubjects: teacherSubjects.map(s => s._id) }
      )
    }

    // ==================== EXAMS ====================
    console.log('\n📝 Creating Exams...')

    const examTypes = [
      { name: 'Unit Test 1', type: 'unit-test', term: 'Term 1', date: new Date('2024-09-15') },
      { name: 'Mid-Term Exam', type: 'mid-term', term: 'Term 1', date: new Date('2024-10-20') },
      { name: 'Unit Test 2', type: 'unit-test', term: 'Term 2', date: new Date('2024-12-10') },
      { name: 'Final Exam', type: 'final', term: 'Term 2', date: new Date('2025-03-15') },
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
          instructions: `Answer all questions. Duration: 3 hours. Total marks: 100.`,
          isActive: true,
        })
        allExams.push(exam)
      }
    }

    console.log(`   ✓ Created ${allExams.length} exams`)

    // ==================== ATTENDANCE ====================
    console.log('\n📅 Creating Attendance Records...')

    const startDate = new Date('2024-09-01')
    const endDate = new Date('2024-12-07')
    const attendanceStatuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late'] // More present days

    const allStudents = await User.find({ role: 'student' })
    const attendanceRecords = []

    // Create attendance for last 3 months (working days only)
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      for (const student of allStudents) {
        const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)]
        const teacher = allTeachers.find(t => t.schoolId.equals(student.schoolId))
        
        attendanceRecords.push({
          schoolId: student.schoolId,
          studentId: student._id,
          classId: student.classId,
          date: new Date(d),
          status,
          markedBy: teacher?._id,
          notes: status === 'Absent' ? 'No reason provided' : '',
        })
      }
    }

    await Attendance.insertMany(attendanceRecords)
    console.log(`   ✓ Created ${attendanceRecords.length} attendance records`)

    // ==================== MARKS ====================
    console.log('\n📊 Creating Marks (only for students with attendance)...')

    const markRecords = []

    for (const exam of allExams) {
      const examDate = exam.date
      const students = await User.find({ classId: exam.classId, role: 'student' })
      const subjects = await Subject.find({ classId: exam.classId })
      
      for (const student of students) {
        // Check if student was present around exam date (within 7 days)
        const startRange = new Date(examDate)
        startRange.setDate(startRange.getDate() - 7)
        const endRange = new Date(examDate)
        endRange.setDate(endRange.getDate() + 7)
        
        const recentAttendance = await Attendance.findOne({
          studentId: student._id,
          date: { $gte: startRange, $lte: endRange },
          status: { $in: ['Present', 'Late'] }
        })
        
        // Only create marks for students who were present
        if (recentAttendance) {
          for (const subject of subjects) {
            // Generate realistic marks (between 40-100)
            const marksScored = Math.floor(Math.random() * 60) + 40
            const maxMarks = 100
            
            const teacher = allTeachers.find(t => t.schoolId.equals(exam.schoolId))
            
            markRecords.push({
              schoolId: exam.schoolId,
              examId: exam._id,
              studentId: student._id,
              subjectId: subject._id,
              marksScored,
              totalMarks: maxMarks,
              remarks: marksScored >= 80 ? 'Excellent performance' : marksScored >= 60 ? 'Good work' : 'Needs improvement',
              markedBy: teacher?._id,
            })
          }
        }
      }
    }

    await Mark.insertMany(markRecords)
    console.log(`   ✓ Created ${markRecords.length} mark entries (only for present students)`)

    // ==================== COURSES (Learning Content) ====================
    console.log('\n🎓 Creating Sample Courses...')

    const mathTeacher = gvhsTeachers[0]
    const csTeacher = gvhsTeachers[1]
    const englishTeacher = gvhsTeachers[2]
    const physicsTeacher = gvhsTeachers[3]
    
    const sampleStudents = allStudents.slice(0, 20)

    const course1 = await Course.create({
      title: 'Complete Web Development Bootcamp 2025',
      description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects.',
      instructor: csTeacher._id,
      schoolId: school1._id,
      createdBy: csTeacher._id,
      category: 'Web Development',
      level: 'beginner',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      price: 0,
      duration: 3600,
      isPublished: true,
      lessons: [
        {
          title: 'Introduction to Web Development',
          description: 'Overview of web technologies',
          content: 'Learn about HTTP, browsers, and the client-server model.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 45,
          order: 1,
        },
        {
          title: 'HTML5 Fundamentals',
          description: 'Learn semantic HTML',
          content: 'Deep dive into HTML5 tags, forms, and accessibility.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 60,
          order: 2,
        },
      ],
      quizzes: [],
      enrolledStudents: sampleStudents.slice(0, 10).map(s => s._id),
      rating: 4.8,
      reviews: [],
      status: 'published',
      tags: ['javascript', 'react', 'nodejs'],
    })

    const course2 = await Course.create({
      title: 'Advanced Mathematics for Class 12',
      description: 'Comprehensive coverage of calculus, algebra, and analytical geometry.',
      instructor: mathTeacher._id,
      schoolId: school1._id,
      createdBy: mathTeacher._id,
      category: 'Mathematics',
      level: 'advanced',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
      price: 0,
      duration: 2400,
      isPublished: true,
      lessons: [
        {
          title: 'Limits and Continuity',
          description: 'Foundation of calculus',
          content: 'Understanding limits and continuous functions.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 60,
          order: 1,
        },
      ],
      quizzes: [],
      enrolledStudents: sampleStudents.slice(10, 20).map(s => s._id),
      rating: 4.9,
      reviews: [],
      status: 'published',
      tags: ['calculus', 'mathematics'],
    })

    console.log(`   ✓ Created 2 initial courses`)

    // ==================== MORE COURSES FOR EACH SCHOOL ====================
    console.log('\n📚 Creating School-Specific Courses...')
    
    let totalCoursesCreated = 2 // Already created 2
    
    // Create courses for each school
    for (const school of schools) {
      const schoolTeachers = allTeachers.filter(t => t.schoolId.equals(school._id))
      const schoolStudents = allStudents.filter(s => s.schoolId.equals(school._id))
      
      // Get random students from this school who have attendance
      const enrolledStudents1 = schoolStudents.slice(0, 30).map(s => s._id)
      const enrolledStudents2 = schoolStudents.slice(30, 55).map(s => s._id)
      const enrolledStudents3 = schoolStudents.slice(55, 85).map(s => s._id)
      
      // Course 1: Physics for school
      await Course.create({
        title: `Physics Mastery - ${school.name}`,
        description: 'Comprehensive physics covering mechanics, thermodynamics, and electromagnetism.',
        instructor: schoolTeachers[0]._id,
        schoolId: school._id,
        createdBy: schoolTeachers[0]._id,
        category: 'Physics',
        level: 'advanced',
        thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
        price: 0,
        duration: 3000,
        isPublished: true,
        lessons: [
          {
            title: 'Newton\'s Laws of Motion',
            description: 'Fundamental mechanics',
            content: 'Understanding force, mass, and acceleration.',
            videoUrl: 'https://www.youtube.com/embed/example',
            duration: 45,
            order: 1,
          },
          {
            title: 'Energy and Work',
            description: 'Conservation principles',
            content: 'Understanding energy transformations.',
            videoUrl: 'https://www.youtube.com/embed/example',
            duration: 50,
            order: 2,
          },
        ],
        quizzes: [],
        enrolledStudents: enrolledStudents1,
        rating: 4.8,
        reviews: [],
        status: 'published',
        tags: ['physics', 'mechanics', 'science'],
      })
      
      // Course 2: Data Structures for school
      await Course.create({
        title: `Data Structures & Algorithms - ${school.name}`,
        description: 'Master data structures, algorithms, and problem-solving techniques.',
        instructor: schoolTeachers[1]._id,
        schoolId: school._id,
        createdBy: schoolTeachers[1]._id,
        category: 'Computer Science',
        level: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
        price: 0,
        duration: 4800,
        isPublished: true,
        lessons: [
          {
            title: 'Arrays and Strings',
            description: 'Basic data structures',
            content: 'Learn about arrays, strings, and operations.',
            videoUrl: 'https://www.youtube.com/embed/example',
            duration: 50,
            order: 1,
          },
          {
            title: 'Linked Lists',
            description: 'Dynamic structures',
            content: 'Understanding linked list implementations.',
            videoUrl: 'https://www.youtube.com/embed/example',
            duration: 55,
            order: 2,
          },
        ],
        quizzes: [],
        enrolledStudents: enrolledStudents2,
        rating: 4.7,
        reviews: [],
        status: 'published',
        tags: ['programming', 'algorithms', 'data-structures'],
      })
      
      // Course 3: English Literature for school
      await Course.create({
        title: `English Literature & Composition - ${school.name}`,
        description: 'Explore literature, develop writing skills and critical thinking.',
        instructor: schoolTeachers[2]._id,
        schoolId: school._id,
        createdBy: schoolTeachers[2]._id,
        category: 'English',
        level: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
        price: 0,
        duration: 2700,
        isPublished: true,
        lessons: [
          {
            title: 'Literary Analysis',
            description: 'Analyzing themes',
            content: 'Learn to identify and analyze literary elements.',
            videoUrl: 'https://www.youtube.com/embed/example',
            duration: 40,
            order: 1,
          },
        ],
        quizzes: [],
        enrolledStudents: enrolledStudents3,
        rating: 4.6,
        reviews: [],
        status: 'published',
        tags: ['literature', 'writing', 'english'],
      })
      
      totalCoursesCreated += 3
    }

    console.log(`   ✓ Created ${totalCoursesCreated} total courses across all schools`)

    // ==================== TIMETABLES ====================
    console.log('\n📅 Creating Class Timetables...')
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const timeslots = [
      { period: 1, startTime: '08:00', endTime: '08:45' },
      { period: 2, startTime: '08:50', endTime: '09:35' },
      { period: 3, startTime: '09:40', endTime: '10:25' },
      { period: 4, startTime: '10:45', endTime: '11:30' },
      { period: 5, startTime: '11:35', endTime: '12:20' },
      { period: 6, startTime: '13:00', endTime: '13:45' },
      { period: 7, startTime: '13:50', endTime: '14:35' },
    ]

    let totalTimetableEntries = 0

    // Create timetables for 9th-12th grade classes
    for (const classDoc of targetClasses.slice(0, 12)) { // First 12 classes (9th-12th grade, section A for each school)
      const classSubjects = allSubjects.filter(s => s.classId.equals(classDoc._id))
      const classTeachers = allTeachers.filter(t => t.schoolId.equals(classDoc.schoolId))
      
      for (const day of daysOfWeek) {
        for (let i = 0; i < Math.min(6, timeslots.length); i++) {
          const slot = timeslots[i]
          const subject = classSubjects[i % classSubjects.length]
          const teacher = classTeachers.find(t => t._id.equals(subject?.teacherId)) || classTeachers[0]
          
          await Timetable.create({
            classId: classDoc._id,
            schoolId: classDoc.schoolId,
            dayOfWeek: day,
            period: slot.period,
            startTime: slot.startTime,
            endTime: slot.endTime,
            subjectId: subject?._id,
            teacherId: teacher?._id,
            roomNumber: `Room ${Math.floor(Math.random() * 50) + 101}`,
          })
          
          totalTimetableEntries++
        }
      }
    }

    console.log(`   ✓ Created ${totalTimetableEntries} timetable entries for ${Math.min(12, targetClasses.length)} classes`)

    // ==================== ANALYTICS DATA ====================
    console.log('\n📊 Generating Analytics Data for Principal Dashboard...')
    
    // Calculate school-wide statistics
    const schoolStats = {
      totalStudents: totalStudents,
      totalTeachers: allTeachers.length,
      totalClasses: allClasses.length,
      totalSubjects: allSubjects.length,
      totalCourses: 5,
      totalExams: allExams.length,
      attendanceRecordsCount: attendanceRecords.length,
      markRecordsCount: markRecords.length,
    }

    // Calculate attendance statistics
    const totalPresentRecords = attendanceRecords.filter(a => a.status === 'Present').length
    const totalAbsentRecords = attendanceRecords.filter(a => a.status === 'Absent').length
    const totalLateRecords = attendanceRecords.filter(a => a.status === 'Late').length
    const overallAttendancePercentage = ((totalPresentRecords / attendanceRecords.length) * 100).toFixed(2)

    // Calculate average marks by class
    const marksByClass: Record<string, number[]> = {}
    for (const mark of markRecords) {
      const classId = mark.examId?.toString() || 'unknown'
      if (!marksByClass[classId]) marksByClass[classId] = []
      marksByClass[classId].push(mark.marksScored)
    }

    console.log(`   ✓ Analytics generated:`)
    console.log(`     - Overall Attendance: ${overallAttendancePercentage}%`)
    console.log(`     - Present: ${totalPresentRecords}, Absent: ${totalAbsentRecords}, Late: ${totalLateRecords}`)
    console.log(`     - Average class performance tracked across ${Object.keys(marksByClass).length} exams`)
    console.log(`     - ${totalCoursesCreated} active courses across all schools`)

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(60))
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!')
    console.log('='.repeat(60))
    
    console.log('\n📊 SUMMARY:')
    console.log('   Organizational:')
    console.log(`   - 1 Super Admin`)
    console.log(`   - 3 Schools`)
    console.log(`   - 3 Principals (one per school)`)
    console.log(`   - ${allTeachers.length} Teachers`)
    console.log(`   - ${allClasses.length} Classes`)
    console.log(`   - ${allSubjects.length} Subjects`)
    
    console.log('\n   Academic:')
    console.log(`   - ${totalStudents} Students`)
    console.log(`   - ${allExams.length} Exams`)
    console.log(`   - ${markRecords.length} Mark Entries (only for present students)`)
    console.log(`   - ${attendanceRecords.length} Attendance Records`)
    console.log(`   - ${totalTimetableEntries} Timetable Entries`)
    console.log(`   - ${totalCoursesCreated} Online Courses (school-specific)`)
    
    console.log('\n   Analytics:')
    console.log(`   - Overall Attendance: ${overallAttendancePercentage}%`)
    console.log(`   - Present: ${totalPresentRecords}, Absent: ${totalAbsentRecords}, Late: ${totalLateRecords}`)
    console.log(`   - Total Course Enrollments: ${totalCoursesCreated * 3 * 30} students across all schools`)
    
    console.log('\n🔐 LOGIN CREDENTIALS:')
    console.log('   Super Admin:')
    console.log('   - Email: superadmin@edubridge.com')
    console.log('   - Password: superadmin123')
    
    console.log('\n   Principals:')
    console.log('   - robert.anderson@greenvalley.edu / principal123')
    console.log('   - patricia.martinez@sunriseschool.edu / principal123')
    console.log('   - jennifer.wilson@oakwoodacademy.edu / principal123')
    
    console.log('\n   Teachers:')
    console.log('   - [teacher-email] / teacher123')
    console.log('   - Example: sarah.johnson@greenvalley.edu / teacher123')
    
    console.log('\n   Students:')
    console.log('   - [student-email] / student123')
    console.log('   - Example: alex.thompson.9th.A@student.edu / student123')
    
    console.log('\n🏫 SCHOOLS:')
    console.log(`   1. ${school1.name} (${school1.code})`)
    console.log(`   2. ${school2.name} (${school2.code})`)
    console.log(`   3. ${school3.name} (${school3.code})`)
    
    console.log('\n' + '='.repeat(60))

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedCompleteDatabase()
