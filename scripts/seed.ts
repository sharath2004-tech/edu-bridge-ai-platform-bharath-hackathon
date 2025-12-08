import bcrypt from 'bcrypt'
import Content from '../lib/models/Content'
import Course from '../lib/models/Course'
import Section from '../lib/models/Section'
import User from '../lib/models/User'
import connectDB from '../lib/mongodb'

async function seedDatabase() {
  try {
    await connectDB()
    console.log('🗑️  Clearing existing data...')

    await User.deleteMany({})
    await Section.deleteMany({})
    await Content.deleteMany({})
    await Course.deleteMany({})

    // Create Admin
    console.log('👤 Creating admin...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@edubridge.com',
      password: adminPassword,
      role: 'admin',
      bio: 'Platform administrator with full access to all features',
    })

    // Create Teachers
    console.log('👨‍🏫 Creating teachers...')
    const teacherPassword = await bcrypt.hash('teacher123', 10)
    
    const teacher1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@edubridge.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Mathematics professor with 15 years of teaching experience. Specializes in algebra and calculus.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    })

    const teacher2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'michael.chen@edubridge.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Computer Science educator passionate about programming and AI. Former software engineer at tech giants.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    })

    const teacher3 = await User.create({
      name: 'Ms. Emily Rodriguez',
      email: 'emily.rodriguez@edubridge.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'English Literature and Creative Writing instructor. Published author and poetry enthusiast.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    })

    const teacher4 = await User.create({
      name: 'Dr. James Williams',
      email: 'james.williams@edubridge.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Physics and Engineering educator with a PhD in Applied Physics. Loves making complex topics accessible.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    })

    // Create Students
    console.log('👨‍🎓 Creating students...')
    const studentPassword = await bcrypt.hash('student123', 10)

    const students = await User.insertMany([
      {
        name: 'Alex Thompson',
        email: 'alex.thompson@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Aspiring software developer interested in web technologies',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Mathematics enthusiast preparing for engineering school',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
      },
      {
        name: 'Ryan Patel',
        email: 'ryan.patel@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Science lover with interests in physics and astronomy',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
      },
      {
        name: 'Sophie Anderson',
        email: 'sophie.anderson@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Creative writer and literature enthusiast',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      },
      {
        name: 'David Kim',
        email: 'david.kim@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Computer science student passionate about AI and machine learning',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Full-stack development learner building real-world projects',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      },
      {
        name: 'Lucas Brown',
        email: 'lucas.brown@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Engineering student with a focus on applied mathematics',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
      },
      {
        name: 'Olivia Davis',
        email: 'olivia.davis@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Aspiring data scientist interested in statistics and analytics',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      },
      {
        name: 'Ethan Garcia',
        email: 'ethan.garcia@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Physics and robotics enthusiast building innovative projects',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
      },
      {
        name: 'Ava Miller',
        email: 'ava.miller@student.edu',
        password: studentPassword,
        role: 'student',
        bio: 'Literature major with a passion for poetry and creative writing',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
      },
    ])

    // Create Sections
    console.log('📚 Creating sections...')
    
    const mathSection1 = await Section.create({
      name: 'Advanced Mathematics - Grade 12A',
      owner: teacher1._id,
      students: [students[0]._id, students[1]._id, students[6]._id, students[7]._id],
    })

    const mathSection2 = await Section.create({
      name: 'Calculus Fundamentals - Grade 11B',
      owner: teacher1._id,
      students: [students[2]._id, students[4]._id, students[8]._id],
    })

    const csSection1 = await Section.create({
      name: 'Web Development Bootcamp 2025',
      owner: teacher2._id,
      students: [students[0]._id, students[4]._id, students[5]._id],
    })

    const csSection2 = await Section.create({
      name: 'Introduction to Python Programming',
      owner: teacher2._id,
      students: [students[1]._id, students[6]._id, students[7]._id],
    })

    const englishSection1 = await Section.create({
      name: 'Creative Writing Workshop',
      owner: teacher3._id,
      students: [students[3]._id, students[9]._id],
    })

    const englishSection2 = await Section.create({
      name: 'World Literature Analysis',
      owner: teacher3._id,
      students: [students[0]._id, students[3]._id, students[5]._id, students[9]._id],
    })

    const physicsSection1 = await Section.create({
      name: 'Applied Physics - Engineering Track',
      owner: teacher4._id,
      students: [students[2]._id, students[6]._id, students[8]._id],
    })

    const physicsSection2 = await Section.create({
      name: 'Quantum Mechanics Introduction',
      owner: teacher4._id,
      students: [students[4]._id, students[7]._id],
    })

    // Create Content
    console.log('📄 Creating content...')

    await Content.insertMany([
      {
        title: 'Differential Equations - Lecture Notes',
        description: 'Comprehensive guide to solving first-order differential equations',
        type: 'pdf',
        url: '/uploads/differential-equations.pdf',
        section: mathSection1._id,
        owner: teacher1._id,
      },
      {
        title: 'Calculus Integration Techniques',
        description: 'Video tutorial covering integration by parts, substitution, and partial fractions',
        type: 'video',
        url: 'https://www.youtube.com/embed/3d6DsjIBzJ4',
        section: mathSection1._id,
        owner: teacher1._id,
      },
      {
        title: 'Week 3 Assignment Instructions',
        type: 'text',
        text: 'Complete problems 1-15 from Chapter 4. Focus on applying the chain rule and product rule. Submit by Friday 11:59 PM.',
        section: mathSection1._id,
        owner: teacher1._id,
      },
      {
        title: 'Limits and Continuity Introduction',
        description: 'Foundation concepts for calculus students',
        type: 'video',
        url: 'https://www.youtube.com/embed/riXcZT2ICjA',
        section: mathSection2._id,
        owner: teacher1._id,
      },
      {
        title: 'React Fundamentals - Complete Guide',
        description: 'Learn React hooks, state management, and component lifecycle',
        type: 'video',
        url: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
        section: csSection1._id,
        owner: teacher2._id,
      },
      {
        title: 'API Integration Best Practices',
        type: 'text',
        text: 'When working with REST APIs: 1) Always handle errors gracefully, 2) Use async/await for cleaner code, 3) Implement proper loading states.',
        section: csSection1._id,
        owner: teacher2._id,
      },
      {
        title: 'Python Basics - Variables and Data Types',
        description: 'Introduction to Python programming fundamentals',
        type: 'video',
        url: 'https://www.youtube.com/embed/kqtD5dpn9C8',
        section: csSection2._id,
        owner: teacher2._id,
      },
      {
        title: 'Creative Writing Techniques',
        description: 'Audio lecture on character development and plot structure',
        type: 'audio',
        url: '/uploads/creative-writing-lecture.mp3',
        section: englishSection1._id,
        owner: teacher3._id,
      },
      {
        title: 'Short Story Assignment',
        type: 'text',
        text: 'Write a 1500-2000 word short story incorporating: 1) A clear protagonist with internal conflict, 2) Vivid sensory descriptions.',
        section: englishSection1._id,
        owner: teacher3._id,
      },
      {
        title: '1984 by George Orwell - Discussion Guide',
        description: 'Questions and themes for class discussion',
        type: 'pdf',
        url: '/uploads/1984-discussion.pdf',
        section: englishSection2._id,
        owner: teacher3._id,
      },
      {
        title: 'Newton\'s Laws in Real-World Engineering',
        description: 'Physics principles in bridge construction',
        type: 'video',
        url: 'https://www.youtube.com/embed/O0kHq89ZXlo',
        section: physicsSection1._id,
        owner: teacher4._id,
      },
      {
        title: 'Problem Set 4 - Dynamics',
        type: 'text',
        text: 'Problems: 1) A 2kg block slides down a 30° incline. Calculate acceleration. 2) Find the tension in a rope pulling a 50kg mass.',
        section: physicsSection1._id,
        owner: teacher4._id,
      },
      {
        title: 'Introduction to Quantum Theory',
        description: 'Understanding wave-particle duality',
        type: 'video',
        url: 'https://www.youtube.com/embed/J3xLuZNKhlY',
        section: physicsSection2._id,
        owner: teacher4._id,
      },
    ])

    // Create Courses
    console.log('🎓 Creating courses...')

    const course1 = await Course.create({
      title: 'Complete Web Development Bootcamp 2025',
      description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects.',
      instructor: teacher2._id,
      category: 'Web Development',
      level: 'beginner',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      price: 0,
      duration: 3600,
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
      quizzes: [
        {
          title: 'HTML & CSS Basics Quiz',
          questions: [
            {
              question: 'What does HTML stand for?',
              options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
              correctAnswer: 0,
              explanation: 'HTML stands for Hyper Text Markup Language.',
            },
          ],
          passingScore: 70,
        },
      ],
      enrolledStudents: [students[0]._id, students[4]._id, students[5]._id],
      rating: 4.8,
      reviews: [
        {
          user: students[0]._id,
          rating: 5,
          comment: 'Excellent course! Very practical and hands-on.',
          createdAt: new Date(),
        },
      ],
      status: 'published',
      tags: ['javascript', 'react', 'nodejs'],
    })

    const course2 = await Course.create({
      title: 'Advanced Calculus and Mathematical Analysis',
      description: 'Rigorous treatment of limits, derivatives, integrals, and series.',
      instructor: teacher1._id,
      category: 'Mathematics',
      level: 'advanced',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
      price: 0,
      duration: 2400,
      lessons: [
        {
          title: 'Limits and Continuity',
          description: 'Epsilon-delta definition',
          content: 'Rigorous approach to limits.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 60,
          order: 1,
        },
      ],
      quizzes: [],
      enrolledStudents: [students[1]._id, students[6]._id, students[7]._id],
      rating: 4.9,
      reviews: [],
      status: 'published',
      tags: ['calculus', 'mathematics'],
    })

    const course3 = await Course.create({
      title: 'Creative Writing: From Ideas to Publication',
      description: 'Develop your unique voice and craft compelling stories.',
      instructor: teacher3._id,
      category: 'Literature',
      level: 'intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
      price: 0,
      duration: 1800,
      lessons: [
        {
          title: 'Finding Your Voice',
          description: 'Discovering your writing style',
          content: 'Exercises to develop authentic voice.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 50,
          order: 1,
        },
      ],
      quizzes: [],
      enrolledStudents: [students[3]._id, students[9]._id],
      rating: 4.7,
      reviews: [],
      status: 'published',
      tags: ['writing', 'creative'],
    })

    const course4 = await Course.create({
      title: 'Applied Physics for Engineers',
      description: 'Classical mechanics, thermodynamics, and electromagnetism.',
      instructor: teacher4._id,
      category: 'Physics',
      level: 'intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
      price: 0,
      duration: 2800,
      lessons: [
        {
          title: 'Newton\'s Laws of Motion',
          description: 'Foundation of classical mechanics',
          content: 'Three laws with engineering applications.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 65,
          order: 1,
        },
      ],
      quizzes: [],
      enrolledStudents: [students[2]._id, students[6]._id, students[8]._id],
      rating: 4.6,
      reviews: [],
      status: 'published',
      tags: ['physics', 'engineering'],
    })

    // Update relationships
    console.log('🔗 Updating relationships...')

    await User.updateOne({ _id: teacher1._id }, { createdCourses: [course2._id] })
    await User.updateOne({ _id: teacher2._id }, { createdCourses: [course1._id] })
    await User.updateOne({ _id: teacher3._id }, { createdCourses: [course3._id] })
    await User.updateOne({ _id: teacher4._id }, { createdCourses: [course4._id] })

    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      const enrolledCourses: any[] = []
      const progress: any[] = []

      if (course1.enrolledStudents.includes(student._id)) {
        enrolledCourses.push(course1._id)
        progress.push({
          courseId: course1._id,
          completedLessons: Math.floor(Math.random() * 2),
          totalLessons: course1.lessons.length,
          lastAccessed: new Date(),
        })
      }
      if (course2.enrolledStudents.includes(student._id)) {
        enrolledCourses.push(course2._id)
        progress.push({
          courseId: course2._id,
          completedLessons: Math.floor(Math.random() * 1),
          totalLessons: course2.lessons.length,
          lastAccessed: new Date(),
        })
      }
      if (course3.enrolledStudents.includes(student._id)) {
        enrolledCourses.push(course3._id)
        progress.push({
          courseId: course3._id,
          completedLessons: 0,
          totalLessons: course3.lessons.length,
          lastAccessed: new Date(),
        })
      }
      if (course4.enrolledStudents.includes(student._id)) {
        enrolledCourses.push(course4._id)
        progress.push({
          courseId: course4._id,
          completedLessons: Math.floor(Math.random() * 1),
          totalLessons: course4.lessons.length,
          lastAccessed: new Date(),
        })
      }

      await User.updateOne({ _id: student._id }, { enrolledCourses, progress })
    }

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - 1 Admin`)
    console.log(`   - 4 Teachers`)
    console.log(`   - 10 Students`)
    console.log(`   - 8 Sections`)
    console.log(`   - 13 Content items`)
    console.log(`   - 4 Courses`)
    console.log('\n🔐 Login Credentials:')
    console.log('   Admin: admin@edubridge.com / admin123')
    console.log('   Teachers: [teacher-email] / teacher123')
    console.log('   Students: [student-email] / student123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedDatabase()
