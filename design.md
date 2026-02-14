# EduBridge AI Platform - System Design Document

## 1. Executive Summary

EduBridge AI is a comprehensive multi-tenant educational management system that combines intelligent automation, AI-powered personalized learning, and offline-first architecture. This document outlines the technical architecture, design decisions, and implementation details.

### 1.1 Design Goals
- Multi-tenancy with complete data isolation
- Offline-first PWA architecture
- AI-powered educational assistance
- Scalable role-based access control
- Efficient video content delivery
- Real-time analytics and reporting

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │ Service      │  │  IndexedDB   │      │
│  │   Frontend   │  │   Worker     │  │   (Offline)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js     │  │   API        │  │  Middleware  │      │
│  │  App Router  │  │   Routes     │  │  (Auth/RBAC) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Data Layer         │    │  External Services   │
│  ┌────────────────┐  │    │  ┌────────────────┐  │
│  │   MongoDB      │  │    │  │  Cohere AI     │  │
│  │   (Atlas)      │  │    │  │  (Chatbot)     │  │
│  └────────────────┘  │    │  └────────────────┘  │
│                      │    │  ┌────────────────┐  │
│                      │    │  │  Bunny.net     │  │
│                      │    │  │  (CDN/Video)   │  │
│                      │    │  └────────────────┘  │
└──────────────────────┘    └──────────────────────┘
```

### 2.2 Technology Stack

#### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod

#### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes (RESTful)
- **Authentication**: JWT with HTTP-only cookies
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **CDN**: Bunny.net

#### AI & Intelligence
- **Provider**: Cohere AI
- **Model**: Command R+
- **Use Cases**: Educational chatbot, content generation, recommendations

---

## 3. Data Architecture

### 3.1 Multi-Tenancy Strategy

**Approach**: Shared database with tenant isolation via `schoolId`

```typescript
// Every query includes schoolId filter
const students = await User.find({
  schoolId: session.schoolId,
  role: 'student'
});
```

**Benefits**:
- Cost-effective (single database)
- Simplified maintenance
- Easy cross-school analytics for super admin
- Efficient resource utilization

**Data Isolation**:
- All models include `schoolId` field
- Middleware enforces schoolId filtering
- API routes validate school access
- Indexes on `schoolId` for performance

### 3.2 Database Schema Design

#### Core Entities

**User Model**
```typescript
{
  _id: ObjectId
  name: string
  email: string (unique, indexed)
  password: string (bcrypt hashed)
  role: enum ['super-admin', 'principal', 'teacher', 'student']
  schoolId: ObjectId (ref: School, indexed)
  classId: ObjectId (ref: Class) // students only
  rollNo: number // students only
  parentName: string
  parentPhone: string
  phone: string
  bio: string
  avatar: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

**School Model**
```typescript
{
  _id: ObjectId
  name: string
  code: string (unique, indexed, e.g., "GVHS2025")
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  principal: {
    name: string
    email: string
    phone: string
  }
  logo: string
  website: string
  established: Date
  type: enum ['primary', 'secondary', 'higher-secondary']
  board: string
  isActive: boolean
  approvalStatus: enum ['pending', 'approved', 'rejected']
  createdAt: Date
}
```

**Class Model**
```typescript
{
  _id: ObjectId
  schoolId: ObjectId (ref: School, indexed)
  className: string (e.g., "10th")
  section: string (e.g., "A")
  classTeacherId: ObjectId (ref: User)
  academicYear: string
  strength: number
  subjects: [ObjectId] (ref: Subject)
}
```

**Attendance Model**
```typescript
{
  _id: ObjectId
  studentId: ObjectId (ref: User, indexed)
  schoolId: ObjectId (ref: School, indexed)
  classId: ObjectId (ref: Class)
  date: Date (indexed)
  status: enum ['Present', 'Absent', 'Late']
  markedBy: ObjectId (ref: User)
  notes: string
  createdAt: Date
}
```

**Mark Model**
```typescript
{
  _id: ObjectId
  studentId: ObjectId (ref: User, indexed)
  schoolId: ObjectId (ref: School, indexed)
  examId: ObjectId (ref: Exam)
  subjectId: ObjectId (ref: Subject)
  marksScored: number
  totalMarks: number
  percentage: number (auto-calculated)
  grade: string (auto-calculated)
  remarks: string
  markedBy: ObjectId (ref: User)
  createdAt: Date
}
```

### 3.3 Indexing Strategy

```javascript
// User indexes
User.index({ email: 1 }, { unique: true });
User.index({ schoolId: 1, role: 1 });
User.index({ schoolId: 1, classId: 1 });

// School indexes
School.index({ code: 1 }, { unique: true });
School.index({ approvalStatus: 1 });

// Attendance indexes
Attendance.index({ studentId: 1, date: -1 });
Attendance.index({ schoolId: 1, classId: 1, date: -1 });

// Mark indexes
Mark.index({ studentId: 1, examId: 1 });
Mark.index({ schoolId: 1, examId: 1 });
```

---

## 4. Authentication & Authorization

### 4.1 Authentication Flow

```
User Login Request
      │
      ▼
Validate Credentials (bcrypt)
      │
      ▼
Generate JWT Token
      │
      ▼
Set HTTP-only Cookie
      │
      ▼
Return User Session
```

**JWT Payload**:
```typescript
{
  userId: string
  email: string
  role: string
  schoolId: string
  exp: number // 7 days
}
```

### 4.2 Role-Based Access Control (RBAC)

**Role Hierarchy**:
```
Super Admin (Platform-wide)
    │
    ├── Principal (School-level)
    │       │
    │       ├── Teacher (Class-level)
    │       │
    │       └── Student (Individual)
```

**Permission Matrix**:

| Resource | Super Admin | Principal | Teacher | Student |
|----------|-------------|-----------|---------|---------|
| All Schools | CRUD | - | - | - |
| Own School | CRUD | CRUD | Read | Read |
| Teachers | CRUD | CRUD | Read | - |
| Students | CRUD | CRUD | CRUD | Read (self) |
| Classes | CRUD | CRUD | Read | Read |
| Attendance | Read | Read | CRUD | Read (self) |
| Marks | Read | Read | CRUD | Read (self) |
| Courses | CRUD | CRUD | CRUD | Read |
| Analytics | All | School | Class | Self |

### 4.3 Middleware Implementation

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect('/login');
  }
  
  const session = await verifyToken(token);
  
  // Role-based route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session.role !== 'super-admin') {
      return NextResponse.redirect('/unauthorized');
    }
  }
  
  // School isolation
  request.headers.set('x-school-id', session.schoolId);
  
  return NextResponse.next();
}
```

---

## 5. Video Upload & CDN Architecture

### 5.1 Dual Upload Strategy

**Problem**: Vercel free tier has 4.5MB request body limit

**Solution**: Size-based routing

```
File Upload Request
      │
      ▼
Check File Size
      │
      ├─── < 4MB ──────────┐
      │                    ▼
      │            Upload via Vercel API
      │                    │
      │                    ▼
      │            Forward to Bunny.net
      │                    │
      │                    ▼
      │            Return CDN URL
      │
      └─── ≥ 4MB ──────────┐
                           ▼
                  Generate Signed URL
                           │
                           ▼
                  Direct Browser Upload to Bunny.net
                           │
                           ▼
                  Return CDN URL
```

### 5.2 Bunny.net Integration

**Configuration**:
```typescript
const bunnyConfig = {
  storageZone: process.env.BUNNY_STORAGE_ZONE,
  apiKey: process.env.BUNNY_API_KEY,
  cdnHostname: process.env.BUNNY_CDN_HOSTNAME,
  region: 'de' // Germany
};
```

**Upload Flow**:
```typescript
// Small files (< 4MB)
POST /api/courses/upload
  → Vercel receives file
  → Uploads to Bunny.net
  → Returns CDN URL

// Large files (≥ 4MB)
POST /api/courses/upload-url
  → Generate signed URL
  → Return to client
  → Client uploads directly to Bunny.net
  → Client confirms upload
```

### 5.3 Offline Video Access

**Architecture**:
```
Video Request
      │
      ▼
Check IndexedDB Cache
      │
      ├─── Found ────────┐
      │                  ▼
      │          Serve from Cache
      │
      └─── Not Found ────┐
                         ▼
                  Fetch from CDN
                         │
                         ▼
                  Store in IndexedDB
                         │
                         ▼
                  Serve to User
```

**Storage Limits**:
- Browser: 5-10GB typical
- Quota API for management
- LRU eviction strategy

---

## 6. AI Chatbot Architecture

### 6.1 Cohere AI Integration

**Model**: Command R+

**Features**:
- Context-aware responses
- Role-specific knowledge
- Chat history
- Educational content generation

### 6.2 Chatbot Flow

```
User Message
      │
      ▼
Load Chat History (last 10 messages)
      │
      ▼
Build Context (role, school, class)
      │
      ▼
Send to Cohere API
      │
      ▼
Receive AI Response
      │
      ▼
Save to Chat History
      │
      ▼
Return to User
```

**Context Building**:
```typescript
const context = {
  role: session.role,
  schoolName: school.name,
  className: class?.name,
  recentActivity: {
    attendance: recentAttendance,
    marks: recentMarks,
    courses: enrolledCourses
  }
};
```

### 6.3 Prompt Engineering

**System Prompt Template**:
```
You are an educational AI assistant for {schoolName}.
User role: {role}
Current context: {context}

Guidelines:
- Provide accurate educational information
- Be encouraging and supportive
- Adapt responses to user's role
- Reference specific courses/subjects when relevant
```

---

## 7. Attendance Management System

### 7.1 Quick Mark Interface

**Design Goals**:
- Mark 50 students in < 30 seconds
- Minimal clicks per student
- Bulk operations support
- Date navigation

**UI Flow**:
```
Select Class → Select Date → Quick Mark (P/A/L) → Save Bulk
```

### 7.2 Bulk Operations

```typescript
// Bulk attendance marking
POST /api/teacher/attendance
{
  classId: "...",
  date: "2026-02-14",
  records: [
    { studentId: "...", status: "Present" },
    { studentId: "...", status: "Absent" },
    // ... up to 100 students
  ]
}
```

### 7.3 Analytics Calculation

```typescript
// Monthly attendance percentage
const totalDays = await Attendance.countDocuments({
  studentId,
  date: { $gte: startDate, $lte: endDate }
});

const presentDays = await Attendance.countDocuments({
  studentId,
  status: 'Present',
  date: { $gte: startDate, $lte: endDate }
});

const percentage = (presentDays / totalDays) * 100;
```

---

## 8. Marks & Grading System

### 8.1 Auto-Grade Calculation

**Grading Scale**:
```typescript
const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};
```

### 8.2 Marks Entry Flow

```
Select Exam → Select Subject → Enter Marks → Auto-calculate Grade → Save
```

### 8.3 Performance Analytics

**Metrics Calculated**:
- Subject-wise average
- Class rank
- Improvement trends
- Weak areas identification
- Comparative analysis

---

## 9. Offline-First Architecture

### 9.1 Service Worker Strategy

**Caching Strategy**:
```javascript
// Cache-first for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
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
      .catch(() => caches.match(event.request))
  );
}
```

### 9.2 IndexedDB Schema

```typescript
const dbSchema = {
  videos: {
    keyPath: 'id',
    indexes: ['courseId', 'downloadedAt']
  },
  courses: {
    keyPath: 'id',
    indexes: ['schoolId', 'updatedAt']
  },
  attendance: {
    keyPath: 'id',
    indexes: ['studentId', 'date']
  }
};
```

### 9.3 Sync Strategy

```
Online Detection
      │
      ▼
Check Pending Operations
      │
      ▼
Upload in Order (FIFO)
      │
      ▼
Resolve Conflicts (Last-Write-Wins)
      │
      ▼
Update Local Cache
```

---

## 10. Performance Optimization

### 10.1 Database Optimization

**Strategies**:
- Compound indexes on frequent queries
- Pagination (20 items per page)
- Projection to limit fields
- Aggregation pipelines for analytics
- Connection pooling

**Example Query Optimization**:
```typescript
// Before: 2.5s
const students = await User.find({ schoolId, role: 'student' });

// After: 0.3s
const students = await User.find(
  { schoolId, role: 'student' },
  { name: 1, email: 1, rollNo: 1 } // projection
)
.limit(20)
.skip(page * 20)
.lean(); // plain objects
```

### 10.2 Frontend Optimization

**Techniques**:
- Server Components (reduce bundle size)
- Code splitting per route
- Lazy loading images
- Debounced search (500ms)
- Virtual scrolling for large lists
- Memoization of expensive calculations

### 10.3 CDN & Caching

**Strategy**:
- Static assets → Vercel Edge Network
- Videos → Bunny.net CDN
- API responses → SWR caching
- Browser caching headers

---

## 11. Security Architecture

### 11.1 Security Layers

```
┌─────────────────────────────────────┐
│  1. Input Validation (Zod)         │
├─────────────────────────────────────┤
│  2. Authentication (JWT)            │
├─────────────────────────────────────┤
│  3. Authorization (RBAC)            │
├─────────────────────────────────────┤
│  4. Data Isolation (schoolId)       │
├─────────────────────────────────────┤
│  5. Rate Limiting                   │
├─────────────────────────────────────┤
│  6. HTTPS/TLS                       │
└─────────────────────────────────────┘
```

### 11.2 Security Measures

**Password Security**:
- Bcrypt hashing (10 rounds)
- Minimum 6 characters
- No plain text storage
- Password change API

**Token Security**:
- HTTP-only cookies
- Secure flag in production
- SameSite=Strict
- 7-day expiration

**API Security**:
- CORS configuration
- Request validation
- SQL injection prevention (Mongoose)
- XSS protection (React escaping)

### 11.3 Data Privacy

**GDPR Compliance**:
- User consent for data collection
- Right to data export
- Right to deletion
- Data minimization
- Encryption at rest (MongoDB)
- Encryption in transit (TLS)

---

## 12. Scalability Considerations

### 12.1 Current Capacity

**Estimated Limits** (Vercel Free Tier):
- 100 GB bandwidth/month
- 100 GB-hours compute/month
- ~10,000 active users
- ~100 schools

### 12.2 Scaling Strategy

**Horizontal Scaling**:
```
Phase 1: Single Vercel Instance
    │
    ▼
Phase 2: Multiple Vercel Instances + Load Balancer
    │
    ▼
Phase 3: Microservices Architecture
    │
    ▼
Phase 4: Kubernetes Cluster
```

**Database Scaling**:
```
Phase 1: MongoDB Atlas M0 (Free)
    │
    ▼
Phase 2: MongoDB Atlas M10 (Dedicated)
    │
    ▼
Phase 3: Sharding by schoolId
    │
    ▼
Phase 4: Read Replicas
```

### 12.3 Caching Strategy

**Redis Integration** (Future):
```typescript
// Cache frequently accessed data
const schoolData = await redis.get(`school:${schoolId}`);
if (!schoolData) {
  const data = await School.findById(schoolId);
  await redis.setex(`school:${schoolId}`, 3600, JSON.stringify(data));
}
```

---

## 13. Monitoring & Analytics

### 13.1 Application Monitoring

**Metrics Tracked**:
- API response times
- Error rates
- User sessions
- Database query performance
- CDN bandwidth usage

**Tools**:
- Vercel Analytics
- MongoDB Atlas Monitoring
- Custom logging

### 13.2 User Analytics

**Tracked Events**:
- Login/logout
- Course enrollment
- Video views
- Quiz completions
- Attendance marking
- Marks entry

### 13.3 Error Handling

**Strategy**:
```typescript
try {
  // Operation
} catch (error) {
  // Log error
  console.error('Operation failed:', error);
  
  // Send to monitoring service
  await logError(error, context);
  
  // Return user-friendly message
  return { error: 'Something went wrong. Please try again.' };
}
```

---

## 14. Testing Strategy

### 14.1 Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (10%)
        ├─────────────┤
        │ Integration │  (30%)
        ├─────────────┤
        │ Unit Tests  │  (60%)
        └─────────────┘
```

### 14.2 Test Coverage

**Unit Tests**:
- Utility functions
- Grade calculation
- Date formatting
- Validation schemas

**Integration Tests**:
- API routes
- Database operations
- Authentication flow
- Authorization checks

**E2E Tests**:
- User login flow
- Attendance marking
- Marks entry
- Course enrollment

---

## 15. Deployment Architecture

### 15.1 Production Environment

```
GitHub Repository
      │
      ▼
Vercel CI/CD Pipeline
      │
      ├─── Build ────────┐
      │                  ▼
      │          Run Tests
      │                  │
      │                  ▼
      │          Type Check
      │                  │
      │                  ▼
      │          Lint Code
      │                  │
      ▼                  ▼
Deploy to Edge ← Success
```

### 15.2 Environment Configuration

**Environments**:
- Development (localhost)
- Staging (staging.edubridge.app)
- Production (edubridge.app)

**Environment Variables**:
```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=...

# AI
COHERE_API_KEY=...

# CDN
BUNNY_STORAGE_ZONE=...
BUNNY_API_KEY=...
BUNNY_CDN_HOSTNAME=...

# App
NEXT_PUBLIC_APP_URL=...
NODE_ENV=production
```

---

## 16. Future Enhancements

### 16.1 Planned Features

**Phase 2** (Q2 2026):
- [ ] Mobile apps (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Parent portal

**Phase 3** (Q3 2026):
- [ ] AI-powered learning paths
- [ ] Automated essay grading
- [ ] Plagiarism detection
- [ ] Virtual classrooms
- [ ] Gamification system

**Phase 4** (Q4 2026):
- [ ] Multi-language support
- [ ] Blockchain certificates
- [ ] AR/VR learning modules
- [ ] Predictive analytics
- [ ] Integration marketplace

### 16.2 Technical Debt

**Known Issues**:
- [ ] Add Redis caching layer
- [ ] Implement rate limiting
- [ ] Add comprehensive error boundaries
- [ ] Improve test coverage (currently ~40%)
- [ ] Add API documentation (Swagger)
- [ ] Implement database migrations
- [ ] Add performance monitoring
- [ ] Optimize bundle size

---

## 17. Conclusion

EduBridge AI Platform is designed as a scalable, secure, and user-friendly educational management system. The architecture prioritizes:

- **Multi-tenancy** with complete data isolation
- **Offline-first** approach for accessibility
- **AI-powered** personalized learning
- **Performance** through optimization and caching
- **Security** with multiple layers of protection
- **Scalability** for future growth

The modular design allows for easy feature additions and modifications while maintaining system stability and performance.

---

## Appendix A: API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Teacher APIs
- `GET /api/teacher/classes` - Get teacher's classes
- `GET /api/teacher/students` - Get students (paginated)
- `POST /api/teacher/attendance` - Mark attendance (bulk)
- `POST /api/teacher/marks` - Enter marks (bulk)

### Student APIs
- `GET /api/student/attendance` - View own attendance
- `GET /api/student/marks` - View own marks
- `GET /api/student/courses` - View enrolled courses

### Principal APIs
- `GET /api/principal/teachers` - Get all teachers
- `POST /api/principal/assign-teacher` - Assign teacher to class
- `GET /api/principal/analytics` - School analytics

### Super Admin APIs
- `GET /api/admin/schools` - Get all schools
- `POST /api/admin/schools` - Approve/reject school
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Platform analytics

---

## Appendix B: Database Indexes

```javascript
// Critical indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ schoolId: 1, role: 1 });
db.schools.createIndex({ code: 1 }, { unique: true });
db.attendance.createIndex({ studentId: 1, date: -1 });
db.marks.createIndex({ studentId: 1, examId: 1 });
```

---

**Document Version**: 1.0  
**Last Updated**: February 14, 2026  
**Author**: EduBridge AI Team
