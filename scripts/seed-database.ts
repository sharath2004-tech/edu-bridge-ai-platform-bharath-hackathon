import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Use Next.js environment variables
const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not set')
  console.error('Please ensure .env.local exists and contains MONGODB_URI')
  process.exit(1)
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
      console.log('✅ MongoDB connected')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      throw error
    }
  }
}

// Define schemas inline for seeding
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  bio: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [{
    courseId: mongoose.Schema.Types.ObjectId,
    completedLessons: Number,
    totalLessons: Number,
    lastAccessed: Date,
  }],
}, { timestamps: true })

const SectionSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

const ContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  url: String,
  text: String,
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  level: String,
  thumbnail: String,
  price: Number,
  duration: Number,
  lessons: [{
    title: String,
    description: String,
    content: String,
    videoUrl: String,
    duration: Number,
    order: Number,
  }],
  quizzes: [{
    title: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    }],
    passingScore: Number,
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: Number,
  reviews: [{
    user: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date,
  }],
  status: String,
  tags: [String],
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema)
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema)
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

async function seedDatabase() {
  await connectDB()

  // Clear existing data
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
  
  // Teacher 1 (Sarah - Math) sections
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

  // Teacher 2 (Michael - CS) sections
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

  // Teacher 3 (Emily - English) sections
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

  // Teacher 4 (James - Physics) sections
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

  // Create Content for each section
  console.log('📄 Creating content...')

  // Math Section 1 Content
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
      url: 'https://www.youtube.com/embed/example1',
      section: mathSection1._id,
      owner: teacher1._id,
    },
    {
      title: 'Week 3 Assignment Instructions',
      description: '',
      type: 'text',
      text: 'Complete problems 1-15 from Chapter 4. Focus on applying the chain rule and product rule. Submit by Friday 11:59 PM. Show all work for full credit.',
      section: mathSection1._id,
      owner: teacher1._id,
    },
  ])

  // Math Section 2 Content
  await Content.insertMany([
    {
      title: 'Limits and Continuity Introduction',
      description: 'Foundation concepts for calculus students',
      type: 'video',
      url: 'https://www.youtube.com/embed/example2',
      section: mathSection2._id,
      owner: teacher1._id,
    },
    {
      title: 'Practice Problems Set 1',
      description: '',
      type: 'text',
      text: 'Evaluate the following limits: 1) lim(x→2) (x²-4)/(x-2), 2) lim(x→∞) (3x²+5)/(2x²-1), 3) lim(x→0) sin(x)/x',
      section: mathSection2._id,
      owner: teacher1._id,
    },
  ])

  // CS Section 1 Content
  await Content.insertMany([
    {
      title: 'React Fundamentals - Complete Guide',
      description: 'Learn React hooks, state management, and component lifecycle',
      type: 'video',
      url: 'https://www.youtube.com/embed/example3',
      section: csSection1._id,
      owner: teacher2._id,
    },
    {
      title: 'Project Starter Code',
      description: 'Download the boilerplate for your final project',
      type: 'pdf',
      url: '/uploads/react-project-starter.pdf',
      section: csSection1._id,
      owner: teacher2._id,
    },
    {
      title: 'API Integration Best Practices',
      description: '',
      type: 'text',
      text: 'When working with REST APIs: 1) Always handle errors gracefully, 2) Use async/await for cleaner code, 3) Implement proper loading states, 4) Cache responses when appropriate.',
      section: csSection1._id,
      owner: teacher2._id,
    },
  ])

  // CS Section 2 Content
  await Content.insertMany([
    {
      title: 'Python Basics - Variables and Data Types',
      description: 'Introduction to Python programming fundamentals',
      type: 'video',
      url: 'https://www.youtube.com/embed/example4',
      section: csSection2._id,
      owner: teacher2._id,
    },
    {
      title: 'Week 1 Lab Exercise',
      description: '',
      type: 'text',
      text: 'Exercise: Create a Python program that calculates the factorial of a number using recursion. Test with inputs 5, 10, and 15.',
      section: csSection2._id,
      owner: teacher2._id,
    },
  ])

  // English Section 1 Content
  await Content.insertMany([
    {
      title: 'Elements of Creative Writing',
      description: 'Audio lecture on character development and plot structure',
      type: 'audio',
      url: '/uploads/creative-writing-lecture.mp3',
      section: englishSection1._id,
      owner: teacher3._id,
    },
    {
      title: 'Short Story Assignment',
      description: '',
      type: 'text',
      text: 'Write a 1500-2000 word short story incorporating: 1) A clear protagonist with internal conflict, 2) Vivid sensory descriptions, 3) Dialogue that reveals character. Due in 2 weeks.',
      section: englishSection1._id,
      owner: teacher3._id,
    },
    {
      title: 'Poetry Analysis Worksheet',
      description: 'Analyzing metaphor, imagery, and tone in modern poetry',
      type: 'pdf',
      url: '/uploads/poetry-analysis.pdf',
      section: englishSection1._id,
      owner: teacher3._id,
    },
  ])

  // English Section 2 Content
  await Content.insertMany([
    {
      title: '1984 by George Orwell - Discussion Guide',
      description: 'Questions and themes for class discussion',
      type: 'pdf',
      url: '/uploads/1984-discussion.pdf',
      section: englishSection2._id,
      owner: teacher3._id,
    },
    {
      title: 'Literary Analysis Essay Guidelines',
      description: '',
      type: 'text',
      text: 'Your essay should: Include a clear thesis statement, provide textual evidence, analyze (not summarize), use MLA format, be 5-7 pages double-spaced.',
      section: englishSection2._id,
      owner: teacher3._id,
    },
  ])

  // Physics Section 1 Content
  await Content.insertMany([
    {
      title: 'Newton\'s Laws in Real-World Engineering',
      description: 'Video demonstration of physics principles in bridge construction',
      type: 'video',
      url: 'https://www.youtube.com/embed/example5',
      section: physicsSection1._id,
      owner: teacher4._id,
    },
    {
      title: 'Lab Report Template',
      description: 'Standard format for physics lab reports',
      type: 'pdf',
      url: '/uploads/lab-report-template.pdf',
      section: physicsSection1._id,
      owner: teacher4._id,
    },
    {
      title: 'Problem Set 4 - Dynamics',
      description: '',
      type: 'text',
      text: 'Problems: 1) A 2kg block slides down a 30° incline. Calculate acceleration. 2) Find the tension in a rope pulling a 50kg mass at 2m/s². Show free-body diagrams.',
      section: physicsSection1._id,
      owner: teacher4._id,
    },
  ])

  // Physics Section 2 Content
  await Content.insertMany([
    {
      title: 'Introduction to Quantum Theory',
      description: 'Understanding wave-particle duality and uncertainty principle',
      type: 'video',
      url: 'https://www.youtube.com/embed/example6',
      section: physicsSection2._id,
      owner: teacher4._id,
    },
    {
      title: 'Schrödinger Equation Explained',
      description: 'Audio lecture on quantum mechanics fundamentals',
      type: 'audio',
      url: '/uploads/schrodinger-lecture.mp3',
      section: physicsSection2._id,
      owner: teacher4._id,
    },
  ])

  // Create Courses
  console.log('🎓 Creating courses...')

  const course1 = await Course.create({
    title: 'Complete Web Development Bootcamp 2025',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects including a full-stack e-commerce application.',
    instructor: teacher2._id,
    category: 'Web Development',
    level: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    price: 0,
    duration: 3600,
    lessons: [
      {
        title: 'Introduction to Web Development',
        description: 'Overview of web technologies and tools',
        content: 'In this lesson, we cover the fundamentals of how the web works, including HTTP, browsers, and the client-server model.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 45,
        order: 1,
      },
      {
        title: 'HTML5 Fundamentals',
        description: 'Learn semantic HTML and best practices',
        content: 'Deep dive into HTML5 tags, forms, multimedia elements, and accessibility.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 60,
        order: 2,
      },
      {
        title: 'CSS3 Styling and Layouts',
        description: 'Master flexbox, grid, and responsive design',
        content: 'Complete guide to modern CSS including animations, transitions, and mobile-first design.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 90,
        order: 3,
      },
    ],
    quizzes: [
      {
        title: 'HTML & CSS Basics Quiz',
        questions: [
          {
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for web pages.',
          },
          {
            question: 'Which CSS property controls text size?',
            options: ['text-style', 'font-size', 'text-size', 'font-style'],
            correctAnswer: 1,
            explanation: 'The font-size property is used to set the size of text.',
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
        comment: 'Excellent course! Very practical and hands-on. The projects are amazing.',
        createdAt: new Date(),
      },
      {
        user: students[5]._id,
        rating: 5,
        comment: 'Best web dev course I\'ve taken. Prof. Chen explains everything clearly.',
        createdAt: new Date(),
      },
    ],
    status: 'published',
    tags: ['javascript', 'react', 'nodejs', 'fullstack'],
  })

  const course2 = await Course.create({
    title: 'Advanced Calculus and Mathematical Analysis',
    description: 'Rigorous treatment of limits, derivatives, integrals, series, and multivariable calculus. Prepare for advanced mathematics and engineering courses.',
    instructor: teacher1._id,
    category: 'Mathematics',
    level: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    price: 0,
    duration: 2400,
    lessons: [
      {
        title: 'Limits and Continuity',
        description: 'Epsilon-delta definition and limit theorems',
        content: 'Rigorous approach to limits, including one-sided limits and limits at infinity.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 60,
        order: 1,
      },
      {
        title: 'Derivatives and Applications',
        description: 'Differentiation rules and optimization',
        content: 'Chain rule, implicit differentiation, related rates, and optimization problems.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 75,
        order: 2,
      },
    ],
    quizzes: [
      {
        title: 'Limits and Derivatives Quiz',
        questions: [
          {
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            correctAnswer: 1,
            explanation: 'Using the power rule: d/dx(x²) = 2x.',
          },
        ],
        passingScore: 75,
      },
    ],
    enrolledStudents: [students[1]._id, students[6]._id, students[7]._id],
    rating: 4.9,
    reviews: [
      {
        user: students[1]._id,
        rating: 5,
        comment: 'Dr. Johnson makes difficult concepts accessible. Highly recommend!',
        createdAt: new Date(),
      },
    ],
    status: 'published',
    tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
  })

  const course3 = await Course.create({
    title: 'Creative Writing: From Ideas to Publication',
    description: 'Develop your unique voice, craft compelling stories, and learn the publishing process. Includes workshops, peer reviews, and industry insights.',
    instructor: teacher3._id,
    category: 'Literature',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    price: 0,
    duration: 1800,
    lessons: [
      {
        title: 'Finding Your Voice',
        description: 'Discovering your unique writing style',
        content: 'Exercises and techniques to help you develop an authentic voice in your writing.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 50,
        order: 1,
      },
      {
        title: 'Character Development',
        description: 'Creating memorable, three-dimensional characters',
        content: 'Learn to build characters with depth, motivation, and realistic dialogue.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 55,
        order: 2,
      },
    ],
    quizzes: [],
    enrolledStudents: [students[3]._id, students[9]._id],
    rating: 4.7,
    reviews: [
      {
        user: students[3]._id,
        rating: 5,
        comment: 'Ms. Rodriguez is an inspiring teacher. This course changed my writing!',
        createdAt: new Date(),
      },
    ],
    status: 'published',
    tags: ['writing', 'creative', 'literature', 'storytelling'],
  })

  const course4 = await Course.create({
    title: 'Applied Physics for Engineers',
    description: 'Classical mechanics, thermodynamics, electromagnetism, and waves. Solve real engineering problems and understand the physics behind modern technology.',
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
        content: 'Three laws of motion with applications to engineering problems.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 65,
        order: 1,
      },
      {
        title: 'Energy and Work',
        description: 'Conservation laws and energy transformations',
        content: 'Kinetic and potential energy, work-energy theorem, and power.',
        videoUrl: 'https://www.youtube.com/embed/example',
        duration: 70,
        order: 2,
      },
    ],
    quizzes: [
      {
        title: 'Mechanics Fundamentals',
        questions: [
          {
            question: 'What is Newton\'s Second Law?',
            options: ['F = ma', 'E = mc²', 'v = u + at', 'F = kx'],
            correctAnswer: 0,
            explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma).',
          },
        ],
        passingScore: 70,
      },
    ],
    enrolledStudents: [students[2]._id, students[6]._id, students[8]._id],
    rating: 4.6,
    reviews: [],
    status: 'published',
    tags: ['physics', 'engineering', 'mechanics', 'applied'],
  })

  // Update user relationships
  console.log('🔗 Updating user relationships...')
  
  await User.updateOne({ _id: teacher1._id }, { 
    createdCourses: [course2._id],
  })
  await User.updateOne({ _id: teacher2._id }, { 
    createdCourses: [course1._id],
  })
  await User.updateOne({ _id: teacher3._id }, { 
    createdCourses: [course3._id],
  })
  await User.updateOne({ _id: teacher4._id }, { 
    createdCourses: [course4._id],
  })

  // Update student enrollments and progress
  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    const enrolledCourses: any[] = []
    const progress: any[] = []

    if (course1.enrolledStudents.includes(student._id)) {
      enrolledCourses.push(course1._id)
      progress.push({
        courseId: course1._id,
        completedLessons: Math.floor(Math.random() * 3),
        totalLessons: course1.lessons.length,
        lastAccessed: new Date(),
      })
    }
    if (course2.enrolledStudents.includes(student._id)) {
      enrolledCourses.push(course2._id)
      progress.push({
        courseId: course2._id,
        completedLessons: Math.floor(Math.random() * 2),
        totalLessons: course2.lessons.length,
        lastAccessed: new Date(),
      })
    }
    if (course3.enrolledStudents.includes(student._id)) {
      enrolledCourses.push(course3._id)
      progress.push({
        courseId: course3._id,
        completedLessons: Math.floor(Math.random() * 2),
        totalLessons: course3.lessons.length,
        lastAccessed: new Date(),
      })
    }
    if (course4.enrolledStudents.includes(student._id)) {
      enrolledCourses.push(course4._id)
      progress.push({
        courseId: course4._id,
        completedLessons: Math.floor(Math.random() * 2),
        totalLessons: course4.lessons.length,
        lastAccessed: new Date(),
      })
    }

    await User.updateOne({ _id: student._id }, { enrolledCourses, progress })
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - 1 Admin created`)
  console.log(`   - 4 Teachers created`)
  console.log(`   - 10 Students created`)
  console.log(`   - 8 Sections created`)
  console.log(`   - 25+ Content items created`)
  console.log(`   - 4 Courses created`)
  console.log('\n🔐 Login Credentials:')
  console.log('   Admin: admin@edubridge.com / admin123')
  console.log('   Teachers: [name]@edubridge.com / teacher123')
  console.log('   Students: [name]@student.edu / student123')
  console.log('\n📚 Sections by Teacher:')
  console.log('   Sarah Johnson (Math): 2 sections, 7 students')
  console.log('   Michael Chen (CS): 2 sections, 6 students')
  console.log('   Emily Rodriguez (English): 2 sections, 6 students')
  console.log('   James Williams (Physics): 2 sections, 5 students')

  await mongoose.connection.close()
  console.log('\n💾 Database connection closed')
}

seedDatabase().catch(console.error)
