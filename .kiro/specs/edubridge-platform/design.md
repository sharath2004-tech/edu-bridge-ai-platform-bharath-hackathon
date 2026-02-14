# Design Document: EduBridge AI Platform

## Overview

EduBridge AI Platform is a comprehensive multi-tenant educational management system built with Next.js 16, TypeScript, MongoDB, and Cohere AI. The platform addresses critical challenges in India's education system by providing:

- Multi-tenant architecture with complete data isolation
- Offline-first Progressive Web App (PWA) capabilities
- AI-powered educational chatbot using Cohere AI
- Efficient video content delivery via Bunny.net CDN
- Role-based access control for four user types
- Real-time analytics and reporting
- Interactive onboarding system

The design prioritizes scalability, security, performance, and accessibility for users in diverse connectivity environments.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │ Service      │  │  IndexedDB   │      │
│  │   Frontend   │  │   Worker     │  │   (Offline)  │      │
│  │  (React 18)  │  │   (PWA)      │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTPS/TLS
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Vercel)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js     │  │   API        │  │  Middleware  │      │
│  │  App Router  │  │   Routes     │  │  (Auth/RBAC) │      │
│  │  (SSR/SSG)   │  │  (REST API)  │  │   JWT Verify │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Data Layer         │    │  External Services   │
│  ┌────────────────┐  │    │  ┌────────────────┐  │
│  │   MongoDB      │  │    │  │  Cohere AI     │  │
│  │   Atlas        │  │    │  │  Command R+    │  │
│  │   (Multi-      │  │    │  │  (Chatbot)     │  │
│  │    Tenant)     │  │    │  └────────────────┘  │
│  └────────────────┘  │    │  ┌────────────────┐  │
│                      │    │  │  Bunny.net     │  │
│                      │    │  │  CDN           │  │
│                      │    │  │  (Video)       │  │
│                      │    │  └────────────────┘  │
└──────────────────────┘    └──────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 16 (App Router with Server Components)
- TypeScript 5.0 (strict mode)
- Tailwind CSS (utility-first styling)
- Shadcn/UI + Radix UI (accessible components)
- React Hook Form + Zod (form validation)
- Service Workers (offline support)

**Backend:**
- Node.js 18+ runtime
- Next.js API Routes (serverless functions)
- Mongoose ODM (MongoDB object modeling)
- JWT authentication (HTTP-only cookies)
- Bcrypt (password hashing, 10 rounds)

**Infrastructure:**
- Vercel (hosting and deployment)
- MongoDB Atlas (database)
- Bunny.net CDN (video storage and delivery)
- Cohere AI (educational chatbot)

### Multi-Tenancy Strategy

**Approach:** Shared database with tenant isolation via `schoolId` field

**Implementation:**
- Every data model includes a `schoolId` field (indexed)
- All database queries automatically filter by `schoolId`
- Middleware enforces school-level access control
- Super Admin can bypass schoolId filtering for platform-wide operations

**Benefits:**
- Cost-effective (single database instance)
- Simplified maintenance and updates
- Easy cross-school analytics for Super Admin
- Efficient resource utilization

**Data Isolation Enforcement:**
```typescript
// Middleware adds schoolId to all queries
const enforceSchoolIsolation = (schema: Schema) => {
  schema.pre('find', function() {
    if (this.getQuery().schoolId === undefined && !this.options.skipSchoolFilter) {
      this.where({ schoolId: this.options.schoolId });
    }
  });
};
```

## Components and Interfaces

### Core Components

#### 1. Authentication System

**Components:**
- `LoginForm`: Email/password authentication form
- `SignupForm`: User registration with role selection
- `AuthMiddleware`: JWT verification and session management
- `PasswordHasher`: Bcrypt-based password encryption

**Interfaces:**
```typescript
interface AuthCredentials {
  email: string;
  password: string;
  schoolCode?: string; // Required for non-super-admin
}

interface UserSession {
  userId: string;
  email: string;
  role: 'super-admin' | 'principal' | 'teacher' | 'student';
  schoolId?: string;
  classId?: string; // For students
  exp: number; // 7 days from login
}

interface JWTPayload extends UserSession {
  iat: number;
}
```

**Authentication Flow:**
1. User submits credentials
2. System validates email format and password length
3. System queries database for user with matching email
4. System compares password hash using bcrypt
5. System generates JWT token with user session data
6. System sets HTTP-only cookie with Secure and SameSite flags
7. System returns user session to client

#### 2. Role-Based Access Control (RBAC)

**Components:**
- `PermissionChecker`: Validates user permissions for operations
- `RoleGuard`: Protects routes based on user role
- `SchoolAccessValidator`: Ensures users can only access their school's data

**Permission Matrix:**
```typescript
interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

const rolePermissions: Record<UserRole, Permission[]> = {
  'super-admin': [
    { resource: 'schools', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] }
  ],
  'principal': [
    { resource: 'school', actions: ['read', 'update'] },
    { resource: 'teachers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'students', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'classes', actions: ['create', 'read', 'update', 'delete'] }
  ],
  'teacher': [
    { resource: 'students', actions: ['read'] },
    { resource: 'attendance', actions: ['create', 'read', 'update'] },
    { resource: 'marks', actions: ['create', 'read', 'update'] },
    { resource: 'courses', actions: ['create', 'read', 'update', 'delete'] }
  ],
  'student': [
    { resource: 'own-data', actions: ['read'] },
    { resource: 'courses', actions: ['read'] },
    { resource: 'videos', actions: ['read'] }
  ]
};
```

#### 3. School Management System

**Components:**
- `SchoolRegistrationForm`: New school registration interface
- `SchoolApprovalQueue`: Super Admin review interface
- `SchoolDashboard`: School-level analytics and management

**Interfaces:**
```typescript
interface School {
  _id: string;
  name: string;
  code: string; // Unique 8-character code
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  principal: {
    name: string;
    email: string;
    phone: string;
  };
  board: string; // CBSE, ICSE, State Board
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**School Code Generation:**
```typescript
function generateSchoolCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

#### 4. Class and Teacher Assignment System

**Components:**
- `ClassCreationForm`: Create classes with name, section, academic year
- `TeacherAssignmentDialog`: Assign teachers to multiple classes
- `ClassRoster`: Display students in a class with pagination

**Interfaces:**
```typescript
interface Class {
  _id: string;
  schoolId: string;
  className: string; // e.g., "10th"
  section: string; // A-Z
  classTeacherId: string;
  academicYear: string; // e.g., "2025-2026"
  strength: number; // Auto-calculated
  subjects: string[]; // Subject IDs
  createdAt: Date;
}

interface Teacher extends User {
  assignedClasses: string[]; // Array of class IDs
  subjects: string[]; // Specialization subjects
}
```

**Teacher Assignment Flow:**
1. Principal opens assignment dialog
2. System displays all teachers in school
3. Principal selects teacher
4. System displays available classes
5. Principal selects classes to assign
6. System updates teacher's assignedClasses array
7. System displays summary (e.g., "3 classes, 5 subjects")

#### 5. Attendance Management System

**Components:**
- `AttendanceQuickMark`: Bulk attendance marking interface
- `AttendanceDatePicker`: Select date for attendance
- `AttendanceAnalytics`: Visualize attendance trends

**Interfaces:**
```typescript
interface AttendanceRecord {
  _id: string;
  studentId: string;
  schoolId: string;
  classId: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string; // Teacher ID
  notes?: string;
  createdAt: Date;
}

interface BulkAttendanceRequest {
  classId: string;
  date: string; // ISO date
  records: {
    studentId: string;
    status: 'Present' | 'Absent' | 'Late';
  }[];
}
```

**Attendance Calculation:**
```typescript
function calculateAttendancePercentage(
  studentId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const totalDays = await AttendanceRecord.countDocuments({
    studentId,
    date: { $gte: startDate, $lte: endDate }
  });
  
  const presentDays = await AttendanceRecord.countDocuments({
    studentId,
    status: 'Present',
    date: { $gte: startDate, $lte: endDate }
  });
  
  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
}
```

#### 6. Marks and Grading System

**Components:**
- `MarksEntryForm`: Enter marks for students
- `GradeCalculator`: Auto-calculate grades from percentage
- `MarkSheet`: Display student mark sheet with grades

**Interfaces:**
```typescript
interface MarkRecord {
  _id: string;
  studentId: string;
  schoolId: string;
  examId: string;
  subjectId: string;
  marksScored: number;
  totalMarks: number;
  percentage: number; // Auto-calculated
  grade: string; // Auto-calculated
  remarks?: string;
  markedBy: string; // Teacher ID
  createdAt: Date;
}

interface Exam {
  _id: string;
  schoolId: string;
  name: string;
  date: Date;
  duration: number; // minutes
  totalMarks: number;
  classIds: string[];
  subjectIds: string[];
  createdAt: Date;
}
```

**Grade Calculation:**
```typescript
function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function autoCalculateGrade(marksScored: number, totalMarks: number): {
  percentage: number;
  grade: string;
} {
  const percentage = (marksScored / totalMarks) * 100;
  const grade = calculateGrade(percentage);
  return { percentage, grade };
}
```

#### 7. Video Upload and CDN System

**Components:**
- `VideoUploadForm`: File selection and upload interface
- `UploadProgressBar`: Real-time upload progress
- `VideoPlayer`: Streaming video player with offline support
- `OfflineVideoManager`: Download and cache videos

**Interfaces:**
```typescript
interface VideoUploadRequest {
  file: File;
  courseId: string;
  lessonId: string;
  title: string;
  description?: string;
}

interface VideoMetadata {
  _id: string;
  courseId: string;
  lessonId: string;
  title: string;
  description?: string;
  cdnUrl: string;
  fileSize: number;
  duration?: number;
  format: string;
  uploadedBy: string;
  createdAt: Date;
}

interface BunnyUploadResponse {
  success: boolean;
  url: string;
  guid: string;
}
```

**Dual Upload Strategy:**
```typescript
async function uploadVideo(file: File): Promise<string> {
  const fileSize = file.size;
  const threshold = 4 * 1024 * 1024; // 4MB
  
  if (fileSize < threshold) {
    // Small file: Upload via Vercel API
    return await uploadViaServer(file);
  } else {
    // Large file: Direct upload to Bunny.net
    const signedUrl = await generateSignedUrl(file.name);
    return await uploadDirectToCDN(file, signedUrl);
  }
}

async function uploadViaServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/courses/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  return data.cdnUrl;
}

async function uploadDirectToCDN(file: File, signedUrl: string): Promise<string> {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
  
  if (!response.ok) {
    throw new Error('CDN upload failed');
  }
  
  return extractCdnUrl(response);
}
```

#### 8. AI Chatbot System

**Components:**
- `ChatInterface`: User message input and conversation display
- `ChatHistoryManager`: Store and retrieve conversation history
- `ContextBuilder`: Build role-specific context for AI
- `CohereClient`: Interface to Cohere AI API

**Interfaces:**
```typescript
interface ChatMessage {
  _id: string;
  userId: string;
  userName: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

interface ChatContext {
  userRole: UserRole;
  schoolName: string;
  className?: string;
  recentActivity: {
    attendance?: AttendanceRecord[];
    marks?: MarkRecord[];
    courses?: Course[];
  };
}

interface CohereRequest {
  message: string;
  chatHistory: ChatMessage[];
  context: ChatContext;
  temperature?: number;
  maxTokens?: number;
}
```

**Chatbot Flow:**
```typescript
async function generateChatResponse(
  message: string,
  userId: string
): Promise<string> {
  // 1. Load chat history (last 10 messages)
  const history = await ChatMessage.find({ userId })
    .sort({ timestamp: -1 })
    .limit(10);
  
  // 2. Build context
  const user = await User.findById(userId);
  const school = await School.findById(user.schoolId);
  const context = await buildContext(user, school);
  
  // 3. Generate system prompt
  const systemPrompt = buildSystemPrompt(context);
  
  // 4. Call Cohere AI
  const response = await cohere.chat({
    message,
    chatHistory: history.map(h => ({
      role: h.role,
      message: h.content
    })),
    preamble: systemPrompt,
    model: 'command-r-plus',
    temperature: 0.7
  });
  
  // 5. Save to history
  await ChatMessage.create({
    userId,
    userName: user.name,
    role: 'assistant',
    content: response.text,
    timestamp: new Date()
  });
  
  return response.text;
}
```

#### 9. Analytics and Reporting System

**Components:**
- `StudentDashboard`: Personal performance metrics
- `TeacherDashboard`: Class performance overview
- `PrincipalDashboard`: School-wide analytics
- `SuperAdminDashboard`: Platform-wide statistics
- `ChartRenderer`: Visualize data with charts

**Interfaces:**
```typescript
interface StudentAnalytics {
  attendancePercentage: number;
  averageMarks: number;
  courseProgress: {
    courseId: string;
    courseName: string;
    completionPercentage: number;
  }[];
  subjectPerformance: {
    subjectId: string;
    subjectName: string;
    averageMarks: number;
    grade: string;
  }[];
}

interface TeacherAnalytics {
  totalStudents: number;
  classAverageAttendance: number;
  classAverageMarks: number;
  topPerformers: {
    studentId: string;
    studentName: string;
    averageMarks: number;
  }[];
  subjectWisePerformance: {
    subjectId: string;
    subjectName: string;
    average: number;
    highest: number;
    lowest: number;
  }[];
}

interface PrincipalAnalytics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  overallAttendance: number;
  classComparison: {
    classId: string;
    className: string;
    averageMarks: number;
    averageAttendance: number;
  }[];
}

interface SuperAdminAnalytics {
  totalSchools: number;
  totalUsers: number;
  activeSessions: number;
  schoolComparison: {
    schoolId: string;
    schoolName: string;
    totalStudents: number;
    averagePerformance: number;
  }[];
}
```

#### 10. Offline-First Architecture

**Components:**
- `ServiceWorker`: Cache static assets and API responses
- `IndexedDBManager`: Store videos and data locally
- `SyncManager`: Queue and sync operations when online
- `OfflineDetector`: Monitor connection status

**Interfaces:**
```typescript
interface CacheStrategy {
  cacheName: string;
  urlPattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only';
  maxAge?: number; // seconds
}

interface OfflineOperation {
  id: string;
  type: 'attendance' | 'marks' | 'course-progress';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

interface IndexedDBSchema {
  videos: {
    keyPath: 'id';
    indexes: ['courseId', 'downloadedAt'];
  };
  courses: {
    keyPath: 'id';
    indexes: ['schoolId', 'updatedAt'];
  };
  offlineOperations: {
    keyPath: 'id';
    indexes: ['status', 'timestamp'];
  };
}
```

**Service Worker Caching:**
```typescript
// Cache-first for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/') || 
      event.request.url.includes('/_next/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// Network-first for API calls
if (event.request.url.includes('/api/')) {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open('api-cache').then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
}
```

## Data Models

### User Model

```typescript
interface User {
  _id: string;
  name: string;
  email: string; // Unique, indexed
  password: string; // Bcrypt hashed
  role: 'super-admin' | 'principal' | 'teacher' | 'student';
  schoolId?: string; // Not required for super-admin
  classId?: string; // Required for students
  rollNo?: number; // Required for students, unique within class
  parentName?: string; // Required for students
  parentPhone?: string; // Required for students
  phone?: string;
  bio?: string;
  avatar?: string;
  assignedClasses?: string[]; // For teachers
  subjects?: string[]; // For teachers
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
User.index({ email: 1 }, { unique: true });
User.index({ schoolId: 1, role: 1 });
User.index({ schoolId: 1, classId: 1 });
User.index({ schoolId: 1, rollNo: 1 });
```

### School Model

```typescript
interface School {
  _id: string;
  name: string;
  code: string; // Unique 8-character code, indexed
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  principal: {
    name: string;
    email: string;
    phone: string;
  };
  logo?: string;
  website?: string;
  established?: Date;
  type: 'primary' | 'secondary' | 'higher-secondary';
  board: string; // CBSE, ICSE, State Board
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
School.index({ code: 1 }, { unique: true });
School.index({ approvalStatus: 1 });
School.index({ isActive: 1 });
```

### Class Model

```typescript
interface Class {
  _id: string;
  schoolId: string; // Indexed
  className: string; // e.g., "10th"
  section: string; // A-Z
  classTeacherId: string;
  academicYear: string; // e.g., "2025-2026"
  strength: number; // Auto-calculated
  subjects: string[]; // Subject IDs
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
Class.index({ schoolId: 1, className: 1, section: 1 });
Class.index({ classTeacherId: 1 });
```

### Subject Model

```typescript
interface Subject {
  _id: string;
  schoolId: string; // Indexed
  name: string;
  code: string; // e.g., "MATH101"
  description?: string;
  credits?: number;
  createdAt: Date;
}

// Indexes
Subject.index({ schoolId: 1, code: 1 }, { unique: true });
```

### Attendance Model

```typescript
interface AttendanceRecord {
  _id: string;
  studentId: string; // Indexed
  schoolId: string; // Indexed
  classId: string;
  date: Date; // Indexed
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string; // Teacher ID
  notes?: string;
  createdAt: Date;
}

// Indexes
AttendanceRecord.index({ studentId: 1, date: -1 });
AttendanceRecord.index({ schoolId: 1, classId: 1, date: -1 });
AttendanceRecord.index({ studentId: 1, date: 1 }, { unique: true }); // Prevent duplicates
```

### Mark Model

```typescript
interface MarkRecord {
  _id: string;
  studentId: string; // Indexed
  schoolId: string; // Indexed
  examId: string;
  subjectId: string;
  marksScored: number;
  totalMarks: number;
  percentage: number; // Auto-calculated
  grade: string; // Auto-calculated
  remarks?: string;
  markedBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
MarkRecord.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });
MarkRecord.index({ schoolId: 1, examId: 1 });
MarkRecord.index({ examId: 1, subjectId: 1 });
```

### Exam Model

```typescript
interface Exam {
  _id: string;
  schoolId: string; // Indexed
  name: string;
  date: Date;
  duration: number; // minutes
  totalMarks: number;
  classIds: string[];
  subjectIds: string[];
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
Exam.index({ schoolId: 1, date: -1 });
Exam.index({ schoolId: 1, classIds: 1 });
```

### Course Model

```typescript
interface Course {
  _id: string;
  schoolId: string; // Indexed
  title: string;
  description: string;
  instructorId: string; // Teacher ID
  classIds: string[];
  subjectId: string;
  thumbnail?: string;
  lessons: {
    _id: string;
    title: string;
    description?: string;
    order: number;
    content: {
      type: 'video' | 'pdf' | 'text' | 'image';
      url?: string;
      text?: string;
    }[];
  }[];
  quizzes: {
    _id: string;
    title: string;
    questions: {
      question: string;
      type: 'multiple-choice' | 'true-false' | 'short-answer';
      options?: string[];
      correctAnswer: string | number;
      points: number;
    }[];
    passingScore: number;
  }[];
  enrolledStudents: string[];
  rating?: number;
  reviews: {
    studentId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
Course.index({ schoolId: 1, isPublished: 1 });
Course.index({ instructorId: 1 });
Course.index({ enrolledStudents: 1 });
```

### Video Model

```typescript
interface Video {
  _id: string;
  courseId: string; // Indexed
  lessonId: string;
  title: string;
  description?: string;
  cdnUrl: string;
  fileSize: number;
  duration?: number; // seconds
  format: string; // mp4, webm, etc.
  thumbnail?: string;
  uploadedBy: string; // Teacher ID
  views: number;
  createdAt: Date;
}

// Indexes
Video.index({ courseId: 1, lessonId: 1 });
Video.index({ uploadedBy: 1 });
```

### ChatMessage Model

```typescript
interface ChatMessage {
  _id: string;
  userId: string; // Indexed
  userName: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  timestamp: Date;
}

// Indexes
ChatMessage.index({ userId: 1, timestamp: -1 });
```

### Notification Model

```typescript
interface Notification {
  _id: string;
  userId: string; // Indexed
  schoolId: string;
  type: 'student_registration' | 'attendance_alert' | 'marks_update' | 
        'course_added' | 'quiz_added' | 'assignment' | 'announcement' | 'general';
  title: string;
  message: string;
  relatedUser?: string; // User who triggered notification
  relatedClass?: string;
  relatedCourse?: string;
  isRead: boolean;
  createdAt: Date;
}

// Indexes
Notification.index({ userId: 1, isRead: 1, createdAt: -1 });
Notification.index({ schoolId: 1, createdAt: -1 });
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Password Encryption Consistency
*For any* user registration with valid credentials, the stored password hash should be verifiable using bcrypt with 10 rounds, and the original password should never be stored in plain text.

**Validates: Requirements 1.1, 13.1**

### Property 2: Email Uniqueness Enforcement
*For any* two user registration attempts with the same email address, the second registration should be rejected with an error message, regardless of other field values.

**Validates: Requirements 1.2**

### Property 3: Disposable Email Validation
*For any* Super_Admin or Principal registration attempt, if the email domain is a known disposable email service, the registration should be rejected.

**Validates: Requirements 1.3**

### Property 4: Authentication Round Trip
*For any* valid user credentials, successful login should generate a JWT token that, when verified, returns the same user session data (userId, email, role, schoolId).

**Validates: Requirements 1.4, 1.5**

### Property 5: Logout Session Invalidation
*For any* authenticated user session, after logout, the authentication cookie should be cleared and subsequent requests with that token should be rejected.

**Validates: Requirements 1.6**

### Property 6: Student Registration Validation
*For any* student registration attempt, the system should require parent name and parent phone number, and reject registrations missing these fields.

**Validates: Requirements 1.7**

### Property 7: Roll Number Uniqueness Within Class
*For any* class, all students in that class should have unique roll numbers, and no two students in the same class should share a roll number.

**Validates: Requirements 1.8**

### Property 8: School Code Generation Uniqueness
*For any* two school registrations, the generated school codes should be unique, 8 characters long, and alphanumeric.

**Validates: Requirements 2.1**

### Property 9: School Approval Initial State
*For any* new school registration, the initial approval status should be "pending" until explicitly changed by a Super_Admin.

**Validates: Requirements 2.2**

### Property 10: School Approval Workflow
*For any* pending school, a Super_Admin should be able to change the status to either "approved" or "rejected", and no other roles should have this capability.

**Validates: Requirements 2.3**

### Property 11: School Approval Notification
*For any* school approval or rejection, a notification record should be created for the principal with the appropriate status message.

**Validates: Requirements 2.4**

### Property 12: Multi-Tenant Data Isolation
*For any* database query by a non-Super_Admin user, the results should only include records matching the user's schoolId, and attempts to access other schools' data should be denied with an authorization error.

**Validates: Requirements 2.5, 2.6, 13.7**

### Property 13: Super Admin Cross-School Access
*For any* Super_Admin query, the system should allow access to data from all schools without schoolId filtering.

**Validates: Requirements 2.7**

### Property 14: Role Assignment Validity
*For any* user creation, the assigned role should be one of: super-admin, principal, teacher, or student, and no other role values should be accepted.

**Validates: Requirements 3.1**

### Property 15: Role-Based Feature Access
*For any* feature access attempt, the system should verify the user's role meets the minimum required role (Super_Admin for admin features, Principal+ for principal features, Teacher+ for teacher features), and deny access otherwise.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 16: Student Data Isolation
*For any* student data access (attendance, marks, courses), students should only be able to view their own records, and attempts to access other students' data should be denied.

**Validates: Requirements 3.5, 5.7, 6.6**

### Property 17: Teacher Class Scope Restriction
*For any* teacher query for students, the results should only include students from the teacher's assigned classes.

**Validates: Requirements 3.6**

### Property 18: Principal School Scope Restriction
*For any* principal operation on users, the operation should only affect users within the principal's school.

**Validates: Requirements 3.7**

### Property 19: Class Creation Validation
*For any* class creation attempt, the system should require class name, section, and academic year, and reject creations missing any of these fields.

**Validates: Requirements 4.1**

### Property 20: Class ID Uniqueness
*For any* two class creations, the assigned class identifiers should be unique across the entire system.

**Validates: Requirements 4.2**

### Property 21: Teacher Assignment Persistence
*For any* teacher-class assignment operation, the class ID should be added to the teacher's assignedClasses array, and for multiple assignments, all class IDs should be stored in the array.

**Validates: Requirements 4.3, 4.4, 15.3, 15.4**

### Property 22: Teacher Assignment Display Format
*For any* teacher with assigned classes, the display should show a summary format (e.g., "X classes, Y subjects") instead of raw database IDs.

**Validates: Requirements 4.5, 15.5**

### Property 23: Super Admin Cross-School Teacher Assignment
*For any* Super_Admin teacher assignment operation, the system should allow assigning teachers to classes across different schools.

**Validates: Requirements 4.6, 15.7**

### Property 24: Principal School-Restricted Teacher Assignment
*For any* Principal teacher assignment operation, the system should only allow assigning teachers to classes within the principal's school.

**Validates: Requirements 4.7**

### Property 25: Attendance Record Completeness
*For any* attendance marking operation, the created record should include student ID, date, status (Present/Absent/Late), and marking teacher ID.

**Validates: Requirements 5.1**

### Property 26: Bulk Attendance Capacity
*For any* bulk attendance operation with up to 100 students, all attendance records should be created successfully.

**Validates: Requirements 5.2**

### Property 27: Attendance Duplicate Prevention
*For any* student and date combination, only one attendance record should exist, and attempts to create duplicate records should be rejected.

**Validates: Requirements 5.3**

### Property 28: Attendance Historical Date Range
*For any* attendance marking operation, dates up to 1 year in the past should be accepted, and dates beyond 1 year should be rejected.

**Validates: Requirements 5.4**

### Property 29: Attendance Update Idempotence
*For any* existing attendance record, updating the status should modify the existing record rather than creating a new one.

**Validates: Requirements 5.5**

### Property 30: Attendance Percentage Calculation
*For any* student and date range, the attendance percentage should equal (Present days / Total days) × 100, rounded to 2 decimal places.

**Validates: Requirements 5.6**

### Property 31: Principal School-Wide Attendance Access
*For any* Principal attendance query, the results should include attendance for all classes in the principal's school.

**Validates: Requirements 5.8**

### Property 32: Mark Record Completeness
*For any* mark entry operation, the created record should include student ID, exam ID, subject ID, marks scored, and total marks.

**Validates: Requirements 6.1**

### Property 33: Marks Range Validation
*For any* mark entry, the marks scored should be less than or equal to total marks, and entries violating this should be rejected.

**Validates: Requirements 6.2**

### Property 34: Percentage Auto-Calculation
*For any* mark entry, the percentage should be automatically calculated as (marks scored / total marks) × 100.

**Validates: Requirements 6.3**

### Property 35: Grade Auto-Assignment
*For any* calculated percentage, the grade should be automatically assigned according to the scale: A+ (90-100%), A (80-89%), B (70-79%), C (60-69%), D (50-59%), F (<50%).

**Validates: Requirements 6.4**

### Property 36: Bulk Marks Entry Support
*For any* bulk marks entry operation with multiple students, all mark records should be created successfully.

**Validates: Requirements 6.5**

### Property 37: Subject-Wise Performance Display
*For any* marks display, the system should show performance grouped by subject with corresponding grades.

**Validates: Requirements 6.7**

### Property 38: Class Rank Calculation
*For any* exam and class combination, students should be ranked by total marks in descending order, with rank 1 being the highest scorer.

**Validates: Requirements 6.8**

### Property 39: Course Creation Validation
*For any* course creation attempt, the system should require course name, description, subject, and target class, and reject creations missing any of these fields.

**Validates: Requirements 7.1**

### Property 40: Course ID Uniqueness
*For any* two course creations, the assigned course identifiers should be unique across the entire system.

**Validates: Requirements 7.2**

### Property 41: Course Content Type Support
*For any* content addition to a course, the system should accept videos, PDFs, images, and text lessons as valid content types.

**Validates: Requirements 7.3**

### Property 42: Course Lesson Structure
*For any* course, content should be organizable into lessons with ordering preserved.

**Validates: Requirements 7.4**

### Property 43: Quiz Question Type Support
*For any* quiz addition to a course, the system should support multiple choice, true/false, and short answer question types.

**Validates: Requirements 7.5**

### Property 44: Course Enrollment Persistence
*For any* student enrollment in a course, the student ID should be added to the course's enrolledStudents array.

**Validates: Requirements 7.6**

### Property 45: Course Progress Tracking
*For any* student accessing a course, the system should track lessons completed and quiz scores.

**Validates: Requirements 7.7**

### Property 46: Video Upload Size-Based Routing
*For any* video upload, files smaller than 4MB should route through the Vercel server, and files 4MB or larger should upload directly to Bunny.net CDN.

**Validates: Requirements 8.1, 8.2**

### Property 47: Video Format Validation
*For any* video upload attempt, only MP4, WebM, MOV, and AVI formats should be accepted, and other formats should be rejected.

**Validates: Requirements 8.3**

### Property 48: Video Size Limit Enforcement
*For any* video upload, files up to 500MB should be accepted, and files larger than 500MB should be rejected.

**Validates: Requirements 8.4**

### Property 49: Video Upload CDN URL Return
*For any* successful video upload, the system should return a valid CDN URL pointing to the uploaded video.

**Validates: Requirements 8.6**

### Property 50: Video CDN Delivery
*For any* video request, the video should be served from Bunny.net CDN rather than the application server.

**Validates: Requirements 8.7**

### Property 51: Video Offline Storage
*For any* video download for offline viewing, the video should be stored in browser IndexedDB and retrievable when offline.

**Validates: Requirements 8.8**

### Property 52: Chatbot Message Routing
*For any* user message to the chatbot, the message should be sent to Cohere AI Command R+ model with appropriate context.

**Validates: Requirements 9.1**

### Property 53: Chatbot Context Inclusion
*For any* chatbot response generation, the prompt should include the user's role, school context, and class information.

**Validates: Requirements 9.2**

### Property 54: Chat History Maintenance
*For any* user chat session, the system should maintain the last 10 messages for context in subsequent responses.

**Validates: Requirements 9.3**

### Property 55: Chatbot Content Filtering
*For any* chatbot response, the system should apply content filtering to prevent inappropriate, harmful, or offensive content.

**Validates: Requirements 9.4**

### Property 56: Chatbot Error Handling
*For any* Cohere AI API failure, the system should display a user-friendly error message with a retry option rather than crashing.

**Validates: Requirements 9.6**

### Property 57: Student Dashboard Metrics
*For any* student dashboard view, the system should display attendance percentage, average marks, and course progress calculated from the student's records.

**Validates: Requirements 10.1**

### Property 58: Teacher Class Analytics
*For any* teacher class analytics view, the system should display average attendance, average marks, and top performers calculated from the class's records.

**Validates: Requirements 10.2**

### Property 59: Principal School Analytics
*For any* principal school analytics view, the system should display total students, total teachers, total classes, and overall attendance calculated from the school's records.

**Validates: Requirements 10.3**

### Property 60: Super Admin Platform Analytics
*For any* Super_Admin platform analytics view, the system should display total schools, total users, and active sessions calculated from platform-wide data.

**Validates: Requirements 10.4**

### Property 61: Subject-Wise Performance Analytics
*For any* subject performance display, the system should show average, highest, and lowest scores calculated from all marks for that subject.

**Validates: Requirements 10.5**

### Property 62: Performance Trend Data Calculation
*For any* performance trend display, the system should calculate improvement over time by comparing marks across multiple time periods.

**Validates: Requirements 10.6**

### Property 63: School Report Export
*For any* school report generation request, the system should export data to PDF or Excel format with all requested metrics included.

**Validates: Requirements 10.7**

### Property 64: Offline Authentication Caching
*For any* successful login, authentication data should be cached for offline access and remain valid for up to 7 days.

**Validates: Requirements 12.1**

### Property 65: Video Offline Storage Persistence
*For any* video downloaded for offline viewing, the video should remain in IndexedDB until explicitly deleted or evicted by browser storage management.

**Validates: Requirements 12.2**

### Property 66: Offline Content Serving
*For any* platform access while offline, cached content should be served from service workers without requiring network access.

**Validates: Requirements 12.3**

### Property 67: Sync Queue FIFO Ordering
*For any* set of queued operations, when internet connection is restored, operations should be synced in the order they were queued (first-in, first-out).

**Validates: Requirements 12.4**

### Property 68: Sync Conflict Resolution
*For any* sync conflict between local and server data, the system should resolve using last-write-wins strategy based on timestamps.

**Validates: Requirements 12.5**

### Property 69: Offline Operation Queuing
*For any* operation requiring internet while offline, the operation should be queued for later sync rather than failing immediately.

**Validates: Requirements 12.7**

### Property 70: JWT Token Security Properties
*For any* JWT token generation, the token should be set as an HTTP-only cookie with Secure and SameSite=Strict flags in production.

**Validates: Requirements 13.2**

### Property 71: Input Validation with Zod
*For any* user input received by the system, the input should be validated against Zod schemas before processing.

**Validates: Requirements 13.4**

### Property 72: Mongoose Query Parameterization
*For any* database query, the system should use Mongoose ODM with parameterized queries to prevent SQL injection attacks.

**Validates: Requirements 13.5**

### Property 73: Authentication Attempt Logging
*For any* authentication attempt, the system should log the timestamp, IP address, and success/failure status.

**Validates: Requirements 13.6**

### Property 74: Pagination Implementation
*For any* list display with more than 20 items, the system should implement pagination with 20 items per page.

**Validates: Requirements 14.3, 18.6**

### Property 75: Teacher Query for School
*For any* Principal opening the teacher assignment dialog, the system should display all teachers belonging to the principal's school.

**Validates: Requirements 15.1**

### Property 76: Class Query for Assignment
*For any* teacher selection in the assignment dialog, the system should display all available classes for assignment.

**Validates: Requirements 15.2**

### Property 77: Teacher Assignment Removal
*For any* teacher assignment removal operation, the class ID should be removed from the teacher's assignedClasses array.

**Validates: Requirements 15.6**

### Property 78: Database Connection Retry Logic
*For any* database connection failure, the system should implement retry logic with exponential backoff before giving up.

**Validates: Requirements 16.2**

### Property 79: API Error Graceful Handling
*For any* API error, the system should handle the error gracefully with try-catch blocks and return user-friendly error messages without crashing.

**Validates: Requirements 16.4**

### Property 80: Student Search Functionality
*For any* teacher search for students, the system should support searching by name, email, and roll number, returning all matching students.

**Validates: Requirements 18.1**

### Property 81: Search Result Text Highlighting
*For any* search results display, matching text should be highlighted in the results.

**Validates: Requirements 18.2**

### Property 82: Student Class Filtering
*For any* teacher filter by class, the system should display only students belonging to the selected class.

**Validates: Requirements 18.3**

### Property 83: Teacher Search Functionality
*For any* Principal search for teachers, the system should support searching by name, email, and subject, returning all matching teachers.

**Validates: Requirements 18.4**

### Property 84: Marks Entry Notification Creation
*For any* teacher marks entry for a student, the system should create a notification record for that student with type "marks_update".

**Validates: Requirements 19.1**

### Property 85: Absence Notification Creation
*For any* teacher marking a student absent, the system should create a notification record for that student with type "attendance_alert".

**Validates: Requirements 19.2**

### Property 86: Course Addition Notification Creation
*For any* new course added to a class, the system should create notification records for all enrolled students with type "course_added".

**Validates: Requirements 19.3**

### Property 87: Notification Record Completeness
*For any* notification creation, the record should include user ID, type, title, message, and timestamp.

**Validates: Requirements 19.4**

### Property 88: Unread Notification Display
*For any* user viewing notifications, unread notifications should be displayed with a visual indicator distinguishing them from read notifications.

**Validates: Requirements 19.5**

### Property 89: Notification Read Status Update
*For any* user clicking a notification, the notification's isRead status should be updated to true.

**Validates: Requirements 19.6**

### Property 90: Notification Archival by Age
*For any* notification older than 30 days, the system should archive the notification.

**Validates: Requirements 19.7**

### Property 91: Exam Creation Validation
*For any* exam creation attempt, the system should require exam name, date, duration, and total marks, and reject creations missing any of these fields.

**Validates: Requirements 20.1**

### Property 92: Exam ID Uniqueness
*For any* two exam creations, the assigned exam identifiers should be unique across the entire system.

**Validates: Requirements 20.2**

### Property 93: Exam Class and Subject Association
*For any* exam scheduling, the exam should be associated with specific class IDs and subject IDs.

**Validates: Requirements 20.3**

### Property 94: Exam Reminder Notification
*For any* exam with a date 3 days in the future, the system should create notification records for all enrolled students.

**Validates: Requirements 20.4**

### Property 95: Mark-Exam Association
*For any* marks entry for an exam, the mark record should include the exam ID linking it to the exam.

**Validates: Requirements 20.5**

### Property 96: Exam Results Class Average and Ranking
*For any* exam results publication, the system should calculate class average marks and rank all students in the class by total marks.

**Validates: Requirements 20.6**

### Property 97: Exam Comparative Analytics
*For any* Principal viewing exam analytics, the system should display comparative performance metrics across all classes that took the exam.

**Validates: Requirements 20.7**

## Error Handling

### Error Categories

**1. Validation Errors**
- Invalid input format (email, phone, dates)
- Missing required fields
- Out-of-range values (marks > total marks)
- Duplicate entries (email, roll number within class)

**Response:** 400 Bad Request with specific error message

**2. Authentication Errors**
- Invalid credentials
- Expired JWT token
- Missing authentication cookie
- Invalid school code

**Response:** 401 Unauthorized with error message

**3. Authorization Errors**
- Insufficient permissions for operation
- Cross-school data access attempt
- Student accessing other student's data

**Response:** 403 Forbidden with error message

**4. Resource Not Found Errors**
- User not found
- School not found
- Class not found
- Course not found

**Response:** 404 Not Found with error message

**5. Conflict Errors**
- Duplicate attendance entry
- School code already exists
- Email already registered

**Response:** 409 Conflict with error message

**6. External Service Errors**
- Cohere AI API failure
- Bunny.net CDN upload failure
- MongoDB connection failure

**Response:** 503 Service Unavailable with retry suggestion

**7. Server Errors**
- Unhandled exceptions
- Database query failures
- File system errors

**Response:** 500 Internal Server Error with generic message (log details server-side)

### Error Handling Strategy

```typescript
// API Route Error Handler
export async function handleApiError(error: unknown): Promise<Response> {
  console.error('API Error:', error);
  
  if (error instanceof ValidationError) {
    return Response.json(
      { error: error.message, field: error.field },
      { status: 400 }
    );
  }
  
  if (error instanceof AuthenticationError) {
    return Response.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
  
  if (error instanceof AuthorizationError) {
    return Response.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  if (error instanceof NotFoundError) {
    return Response.json(
      { error: 'Resource not found' },
      { status: 404 }
    );
  }
  
  if (error instanceof ConflictError) {
    return Response.json(
      { error: error.message },
      { status: 409 }
    );
  }
  
  if (error instanceof ExternalServiceError) {
    return Response.json(
      { error: 'External service unavailable', retry: true },
      { status: 503 }
    );
  }
  
  // Generic server error
  return Response.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
```

### Client-Side Error Handling

```typescript
// React Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Retry Logic

```typescript
// Exponential Backoff Retry
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const data = await retryWithBackoff(() => 
  fetch('/api/data').then(r => r.json())
);
```

## Testing Strategy

### Dual Testing Approach

The EduBridge AI Platform requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests:**
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values, null/undefined)
- Error conditions (invalid inputs, missing data)
- Integration points between components
- Mock external services (Cohere AI, Bunny.net CDN)

**Property-Based Tests:**
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Minimum 100 iterations per property test
- Each property test references its design document property

**Balance:** Avoid writing too many unit tests for scenarios that property tests already cover. Focus unit tests on specific examples and edge cases, while property tests verify general correctness across all inputs.

### Property-Based Testing Configuration

**Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
```typescript
import fc from 'fast-check';

// Example property test
describe('Property Tests', () => {
  it('Property 30: Attendance Percentage Calculation', () => {
    // Feature: edubridge-platform, Property 30: For any student and date range, 
    // the attendance percentage should equal (Present days / Total days) × 100
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // presentDays
        fc.integer({ min: 1, max: 100 }), // totalDays
        (presentDays, totalDays) => {
          // Ensure presentDays <= totalDays
          const validPresentDays = Math.min(presentDays, totalDays);
          
          const percentage = calculateAttendancePercentage(
            validPresentDays,
            totalDays
          );
          
          const expected = (validPresentDays / totalDays) * 100;
          
          // Should match to 2 decimal places
          expect(percentage).toBeCloseTo(expected, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Test Tagging Format:**
```typescript
// Feature: edubridge-platform, Property {number}: {property_text}
```

### Test Coverage Goals

- **Unit Test Coverage:** 60%+ of codebase
- **Property Test Coverage:** All 97 correctness properties
- **Integration Test Coverage:** All API endpoints
- **E2E Test Coverage:** Critical user flows (login, attendance, marks, video upload)

### Testing Tools

- **Unit Testing:** Jest + React Testing Library
- **Property Testing:** fast-check
- **Integration Testing:** Supertest (API testing)
- **E2E Testing:** Playwright or Cypress
- **Mocking:** MSW (Mock Service Worker) for API mocking

### Example Test Structure

```typescript
// Unit Test Example
describe('Grade Calculation', () => {
  it('should assign A+ for 95%', () => {
    expect(calculateGrade(95)).toBe('A+');
  });
  
  it('should assign F for 45%', () => {
    expect(calculateGrade(45)).toBe('F');
  });
  
  it('should handle boundary at 90%', () => {
    expect(calculateGrade(90)).toBe('A+');
    expect(calculateGrade(89.99)).toBe('A');
  });
});

// Property Test Example
describe('Property 35: Grade Auto-Assignment', () => {
  it('should assign correct grade for any percentage', () => {
    // Feature: edubridge-platform, Property 35: For any calculated percentage,
    // the grade should be automatically assigned according to the scale
    
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100 }),
        (percentage) => {
          const grade = calculateGrade(percentage);
          
          if (percentage >= 90) expect(grade).toBe('A+');
          else if (percentage >= 80) expect(grade).toBe('A');
          else if (percentage >= 70) expect(grade).toBe('B');
          else if (percentage >= 60) expect(grade).toBe('C');
          else if (percentage >= 50) expect(grade).toBe('D');
          else expect(grade).toBe('F');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Complete
