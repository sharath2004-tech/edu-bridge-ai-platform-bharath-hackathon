// User types
export type UserRole = 'student' | 'teacher' | 'admin' | 'super-admin' | 'principal'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  schoolId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  role: UserRole
  name: string
  email: string
  userId?: string
  schoolId?: string
}

// Course types
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived'

export interface Lesson {
  title: string
  description: string
  content: string
  videoUrl?: string
  duration: number
  order: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  title: string
  questions: QuizQuestion[]
  passingScore: number
}

export interface CourseReview {
  user: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: User | string
  schoolId?: string
  category: string
  level: CourseLevel
  thumbnail?: string
  price: number
  duration: number
  classes?: string[]
  isPublished?: boolean
  lessons: Lesson[]
  quizzes: Quiz[]
  sections: string[]
  enrolledStudents: string[]
  rating: number
  reviews: CourseReview[]
  status: CourseStatus
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard types
export interface DashboardStats {
  streak: number
  activeCourses: number
  hoursLearned: number
  goalsCompleted: number
  totalGoals: number
}

export interface DashboardCourse {
  title: string
  progress: number
  lessons: string
  instructor: string
}

export interface DashboardDeadline {
  title: string
  date: string
}

export interface StudentDashboard {
  name: string
  stats: DashboardStats
  courses: DashboardCourse[]
  nextLesson?: {
    title: string
    course: string
    duration: number
  }
  deadlines: DashboardDeadline[]
}

// School types
export interface School {
  id: string
  name: string
  address: string
  phone: string
  email: string
  principalId?: string
  students: string[]
  teachers: string[]
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  updatedAt: Date
}

// Attendance types
export interface AttendanceRecord {
  id: string
  student: string
  date: Date
  status: 'present' | 'absent' | 'late' | 'excused'
  classId: string
  markedBy: string
  notes?: string
}

// Marks types
export interface Mark {
  id: string
  student: string
  subject: string
  examType: string
  score: number
  maxScore: number
  grade?: string
  feedback?: string
  createdAt: Date
}
