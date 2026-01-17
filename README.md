# EduBridge AI Platform

<div align="center">
  <img src="./docs/images/logo.png" alt="EduBridge AI Logo" width="200"/>
  
  ### AI-Powered Multi-Tenant Educational Management System
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Cohere AI](https://img.shields.io/badge/Cohere-AI-purple?style=for-the-badge)](https://cohere.ai/)
  
  **[🚀 Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/sharath2004-tech/edu-bridge-ai-platform)** | [Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [API](#-api-documentation)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Recent Updates](#-recent-updates)
- [Key Features](#-key-features)
- [User Workflows](#-user-workflows)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Routes](#-api-routes)
- [User Roles](#-user-roles)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🆕 Recent Updates

### Latest Features (January 2026)

#### 🎓 Interactive Onboarding System
- **First-Time Experience**: Automatic welcome wizard on first visit
- **Two Paths**: Demo mode with credentials or guided school registration
- **Replayable**: "Take a Tour" button in navigation to restart anytime
- **User-Friendly**: Step-by-step slides explaining platform features

#### 👥 Teacher Assignment System
- **Flexible Assignment**: Assign teachers to multiple classes
- **Role-Based**: Super Admin (all schools) and Principal (their school)
- **Clean Interface**: Shows summary instead of raw database IDs
- **Interactive Dialog**: Easy-to-use assignment interface

#### 🎬 Enhanced Video Upload
- **Direct CDN Upload**: Large files (>4MB) upload directly to Bunny.net
- **Bypass Limits**: Avoids Vercel's 4.5MB body size limit
- **Progress Tracking**: Real-time upload progress for all file sizes
- **Automatic Routing**: Smart selection between server and direct upload

#### 🔐 Simplified Authentication
- **Removed OAuth**: Removed Google and GitHub login buttons
- **Streamlined Flow**: Clean email/password authentication only
- **Consistent Experience**: Same login flow across all roles

---

## 🌟 Overview

**EduBridge AI Platform** is a comprehensive, multi-tenant educational management system that revolutionizes how schools operate and students learn. Built with cutting-edge technologies, it combines intelligent automation, AI-powered personalized learning, and offline-first architecture into a unified ecosystem.

### The Problem We Solve

Traditional educational institutions face critical challenges:
- **Fragmented Systems**: Multiple disconnected tools for attendance, marks, and enrollment
- **Limited Accessibility**: Online-only platforms fail students in areas with poor connectivity
- **Lack of Personalization**: One-size-fits-all teaching methods don't adapt to individual needs
- **Administrative Burden**: Manual data entry consuming valuable teacher time
- **No Intelligent Support**: Students lack 24/7 learning assistance

### Our Solution

EduBridge AI provides:
- ✅ **Unified Platform** - Single dashboard replacing 5+ disconnected tools
- ✅ **Offline-First PWA** - Learn anywhere without internet, sync automatically
- ✅ **AI-Powered Chatbot** - Context-aware educational assistance using Cohere AI
- ✅ **Smart Automation** - Attendance in 30 seconds, auto-calculated grades
- ✅ **Multi-School Support** - True multi-tenancy with data isolation
- ✅ **Real-Time Analytics** - Track performance, attendance, and progress

---

## ✨ Key Features

### � Interactive Onboarding System
- **Welcome Wizard** - First-time users see an interactive tour
- **Two Learning Paths**:
  - 🎬 **Demo Mode**: Explore with pre-loaded Green Valley High School data
  - 🚀 **Create New School**: Guided registration process
- **Demo Credentials**: Instant access to all user roles (Super Admin, Principal, Teacher, Student)
- **"Take a Tour" Button**: Reopen onboarding anytime from navigation
- **Progressive Slides**: Step-by-step guide explaining platform features
- **Copy Credentials**: One-click copy for easy demo access

![Onboarding Wizard](./docs/images/onboarding-wizard.png)

### 🏫 Multi-School Management
- Support for unlimited schools on a single platform
- Complete data isolation via `schoolId` filtering
- Unique school codes for easy identification
- School-specific branding and configuration
- **Manual Approval System**: Super Admin reviews and approves new schools
- **Teacher Assignment**: Assign teachers to multiple classes easily

![Multi-School Dashboard](./docs/images/multi-school-dashboard.png)

### 👥 Advanced Teacher Management
- **Assign Teachers to Classes**: Principals and Super Admins can assign teachers
- **Multi-Class Support**: Teachers can manage multiple classes
- **Clean UI**: Shows teacher summary (X classes, Y subjects) instead of raw data
- **Assignment Dialog**: Interactive interface for class assignments
- **Role-Based Access**: Super Admin manages all schools, Principals manage their school

### 🎬 Smart Video Upload System
- **Bunny.net CDN Integration**: Fast, reliable video hosting
- **Large File Support**: Direct upload for files >4MB bypassing Vercel limits
- **Automatic Routing**: Small files through server, large files direct to CDN
- **Progress Tracking**: Real-time upload progress for both methods
- **Video Optimization**: Automatic optimization for streaming
- **Offline Download**: Students can download videos for offline viewing

![Video Upload](./docs/images/video-upload.png)

### 🤖 AI-Powered Learning Assistant
- **Context-Aware Chatbot** powered by Cohere AI
- Role-specific responses (Student/Teacher/Principal)
- Chat history for continuity
- Educational knowledge base integration
- Homework help and concept explanations

![AI Chatbot](./docs/images/ai-chatbot.png)

### 📅 Smart Attendance Management
- Quick-mark with P/A/L buttons
- Bulk attendance operations
- Date-wise tracking
- Monthly/yearly reports
- Automatic percentage calculation
- Class-based filtering with sections

![Attendance Management](./docs/images/attendance-page.png)

### 📊 Marks & Examination System
- Subject-wise marks entry
- Auto-calculated grades (A+ to F)
- Exam creation and scheduling
- Performance analytics
- Historical mark records
- Export to Excel/PDF

![Marks Management](./docs/images/marks-page.png)

### 👥 Student Management
- Class-based organization (e.g., 10th Grade - Section A)
- Pagination (20 students per page)
- Search by name, email, roll number
- Bulk student enrollment
- Parent contact information
- Academic history tracking

![Student List](./docs/images/students-page.png)

### 📚 Course Management
- Create courses with lessons and quizzes
- Multimedia content support
- Course enrollment tracking
- Progress monitoring
- Student reviews and ratings

### 📈 Advanced Analytics
- **For Teachers**: Class performance, subject-wise analysis
- **For Students**: Personal progress, attendance trends
- **For Principals**: School-wide statistics, comparative reports
- Visual charts and graphs
- Export capabilities

![Analytics Dashboard](./docs/images/analytics.png)

### 📱 Offline-First Architecture
- PWA with service workers
- IndexedDB for local caching
- Automatic sync on reconnection
- Conflict resolution
- Background sync for data integrity

### 🔐 Role-Based Access Control (RBAC)
Four distinct user roles with granular permissions:
- **Super Admin**: Platform-wide management
- **Principal**: School administration
- **Teacher**: Class management, teaching operations
- **Student**: Learning and progress tracking

---

## � User Workflows

### 🏫 School Registration Flow
```
New School → Fill Registration Form → Super Admin Reviews
   ↓
Super Admin Approves/Rejects in Platform
   ↓
Principal Receives Access → Sets Up School → Adds Teachers & Students
```

### 👩‍🏫 Teacher Workflow
```
Login → Create Course → Upload Videos (Auto-routed to CDN)
   ↓
Students Enroll → Download Videos for Offline
   ↓
Mark Attendance → Grade Assignments → Track Progress
```

### 👨‍🎓 Student Workflow
```
Login → Browse Courses → Download Videos (IndexedDB)
   ↓
Learn Offline → Take Quizzes → Submit Assignments
   ↓
View Marks → Check Attendance → Track Progress
```

### 🔵 Super Admin Workflow
```
Review Pending Schools → Approve/Reject
   ↓
Manage All Schools → Assign Teachers to Classes
   ↓
Monitor Platform Analytics → View Multi-School Reports
```

### 👨‍💼 Principal Workflow
```
Manage School → Create Classes → Add Teachers
   ↓
Assign Teachers to Classes → Enroll Students
   ↓
Monitor School Performance → Generate Reports
```

---

## �🛠 Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (RESTful)
- **Authentication**: JWT with HTTP-only cookies (no OAuth)
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **CDN**: Bunny.net for video storage and delivery
- **File Upload**: Multi-strategy (server + direct CDN)

### AI & Intelligence
- **AI Provider**: Cohere AI
- **Model**: Command R+
- **Use Cases**: 
  - Educational chatbot
  - Content generation
  - Personalized recommendations
  - Learning path recommendations

### DevOps & Tools
- **Package Manager**: pnpm
- **Version Control**: Git & GitHub
- **Deployment**: Vercel (recommended)
- **Monitoring**: Vercel Analytics
- **Database Hosting**: MongoDB Atlas

---

## 📸 Screenshots

### Landing Page
![Landing Page](./docs/images/landing-page.png)
*Modern, responsive landing page with feature highlights*

### Teacher Dashboard
![Teacher Dashboard](./docs/images/teacher-dashboard.png)
*Comprehensive overview of classes, students, and recent activity*

### Student Dashboard
![Student Dashboard](./docs/images/student-dashboard.png)
*Personalized learning dashboard with courses and progress*

### Principal Dashboard
![Principal Dashboard](./docs/images/principal-dashboard.png)
*School-wide analytics and management tools*

### Attendance Page
![Attendance](./docs/images/attendance-interface.png)
*Quick attendance marking with class selection and date picker*

### Marks Entry
![Marks Entry](./docs/images/marks-entry.png)
*Intuitive marks entry with auto-grade calculation*

### AI Tools
![AI Tools](./docs/images/ai-tools.png)
*Teacher guide tools*



---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher (or npm/yarn)
- **MongoDB**: Atlas account or local instance
- **Cohere API Key**: Free tier available at [cohere.ai](https://cohere.ai)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharath2004-tech/edu-bridge-ai-platform.git
   cd edu-bridge-ai-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edubridge?retryWrites=true&w=majority

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters

   # Cohere AI API Key
   COHERE_API_KEY=your-cohere-api-key

   # Bunny.net CDN Configuration (for video uploads)
   BUNNY_STORAGE_ZONE=your-storage-zone-name
   BUNNY_API_KEY=your-bunny-api-key
   BUNNY_CDN_HOSTNAME=your-cdn-hostname.b-cdn.net

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Bunny.net Setup** (Optional for video features):
   1. Sign up at [bunny.net](https://bunny.net) (25GB free tier)
   2. Create a Storage Zone
   3. Copy Storage Zone name, API Key, and CDN hostname
   4. Add to `.env.local`

4. **Seed the database** (Optional but recommended)
   ```bash
   pnpm seed
   ```
   
   This creates:
   - 3 schools with principals
   - 13 teachers
   - 1,080 students across 126 classes
   - 75,600 attendance records
   - 24,300 mark entries
   - 144 exams
   - Sample courses

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Login Credentials

After seeding the database, use these credentials to explore different roles:

### 🔵 Super Admin
- **Email**: `superadmin@edubridge.com`
- **Password**: `superadmin123`
- **Access**: Manage all schools, approve registrations, platform-wide analytics

### 👨‍💼 Principal (Green Valley High School)
- **School Code**: `GVHS2025`
- **Email**: `robert.anderson@greenvalley.edu`
- **Password**: `principal123`
- **Access**: Manage school, teachers, students, assign classes

### 👩‍🏫 Teacher (Green Valley High School)
- **School Code**: `GVHS2025`
- **Email**: `sarah.johnson@greenvalley.edu`
- **Password**: `teacher123`
- **Access**: Create courses, upload videos, grade students, mark attendance

### 👨‍🎓 Student (Green Valley High School)
- **School Code**: `GVHS2025`
- **Email**: `student1.9th.a@student.edu`
- **Password**: `student123`
- **Access**: Watch videos offline, take quizzes, view marks and attendance

**💡 Tip**: Use the "Take a Tour" button on the homepage to see all credentials and platform features!

---

## 📁 Project Structure

```
edu-bridge-ai-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── admin/                    # Super Admin portal
│   │   ├── dashboard/
│   │   ├── moderation/
│   │   └── users/
│   ├── principal/                # Principal portal
│   │   ├── dashboard/
│   │   ├── teachers/
│   │   ├── students/
│   │   └── classes/
│   ├── teacher/                  # Teacher portal
│   │   ├── dashboard/
│   │   ├── attendance/           # Attendance management
│   │   ├── marks/                # Marks entry
│   │   ├── students/             # Student list
│   │   ├── analytics/
│   │   └── courses/
│   ├── student/                  # Student portal
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── attendance/           # View own attendance
│   │   ├── marks/                # View own marks
│   │   ├── analytics/
│   │   └── community/
│   └── api/                      # API Routes
│       ├── auth/                 # Authentication APIs
│       ├── teacher/              # Teacher APIs
│       ├── student/              # Student APIs
│       ├── principal/            # Principal APIs
│       ├── chatbot/              # AI Chatbot API
│       └── seed/                 # Database seeding
├── components/                   # Reusable components
│   ├── ui/                       # Shadcn UI components
│   ├── admin-sidebar.tsx
│   ├── teacher-sidebar.tsx
│   ├── sidebar.tsx               # Student sidebar
│   └── top-nav.tsx
├── lib/                          # Utility functions
│   ├── models/                   # MongoDB/Mongoose models
│   │   ├── User.ts
│   │   ├── School.ts
│   │   ├── Class.ts
│   │   ├── Subject.ts
│   │   ├── Attendance.ts
│   │   ├── Mark.ts
│   │   ├── Exam.ts
│   │   └── Course.ts
│   ├── auth.ts                   # Authentication helpers
│   ├── mongodb.ts                # Database connection
│   └── utils.ts                  # Utility functions
├── scripts/                      # Utility scripts
│   └── seed-complete.ts          # Database seeding script
├── public/                       # Static assets
├── docs/                         # Documentation & images
│   └── images/                   # Screenshots
├── .env.local                    # Environment variables (create this)
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🗄 Database Schema

### Core Models

#### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'super-admin' | 'principal' | 'teacher' | 'student'
  schoolId: ObjectId (ref: School)
  classId: ObjectId (ref: Class) // For students
  rollNo: number // For students
  parentName: string
  parentPhone: string
  phone: string
  bio: string
  avatar: string
  isActive: boolean
}
```

#### School Model
```typescript
{
  name: string
  code: string (unique, e.g., "GVHS2025")
  email: string
  phone: string
  address: {
    street, city, state, country, zipCode
  }
  principal: {
    name, email, phone
  }
  logo: string
  website: string
  established: Date
  type: 'primary' | 'secondary' | 'higher-secondary'
  board: string (e.g., "CBSE", "ICSE")
  isActive: boolean
}
```

#### Class Model
```typescript
{
  schoolId: ObjectId (ref: School)
  className: string (e.g., "10th")
  section: string (e.g., "A", "B", "C")
  classTeacherId: ObjectId (ref: User)
  academicYear: string
  strength: number
}
```

#### Attendance Model
```typescript
{
  studentId: ObjectId (ref: User)
  schoolId: ObjectId (ref: School)
  classId: ObjectId (ref: Class)
  date: Date
  status: 'Present' | 'Absent' | 'Late'
  markedBy: ObjectId (ref: User)
  notes: string
}
```

#### Mark Model
```typescript
{
  studentId: ObjectId (ref: User)
  schoolId: ObjectId (ref: School)
  examId: ObjectId (ref: Exam)
  subjectId: ObjectId (ref: Subject)
  marksScored: number
  totalMarks: number
  percentage: number (auto-calculated)
  grade: string (auto-calculated: A+, A, B, C, D, F)
  remarks: string
  markedBy: ObjectId (ref: User)
}
```

[View Complete Database Schema](./docs/DATABASE_SCHEMA.md)

---

## 🌐 API Routes

### Authentication APIs
```
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
POST   /api/auth/signup         - User registration
GET    /api/auth/session        - Get current session
```

### Teacher APIs
```
GET    /api/teacher/classes           - Get teacher's classes
GET    /api/teacher/students          - Get students (with pagination)
POST   /api/teacher/students          - Create new student
DELETE /api/teacher/students/[id]     - Delete student

GET    /api/teacher/attendance        - Get attendance records
POST   /api/teacher/attendance        - Mark attendance (bulk)

GET    /api/teacher/marks             - Get marks
POST   /api/teacher/marks             - Enter marks (bulk)

GET    /api/teacher/exams             - Get exams
GET    /api/teacher/subjects          - Get subjects
```

### Student APIs
```
GET    /api/student/attendance        - View own attendance
GET    /api/student/marks             - View own marks
GET    /api/student/exams             - View class exams
GET    /api/student/courses           - View enrolled courses
```

### Principal APIs
```
GET    /api/principal/teachers        - Get all teachers
POST   /api/principal/teachers        - Create teacher
GET    /api/principal/students        - Get all students
POST   /api/principal/students        - Create student
GET    /api/principal/classes         - Get all classes
POST   /api/principal/classes         - Create class
GET    /api/principal/analytics       - School analytics
```

### AI Chatbot API
```
POST   /api/chatbot                   - Send message to AI assistant
```

[View Complete API Documentation](./docs/API.md)

---

## 👥 User Roles

### 🔴 Super Admin
**Platform-wide authority**
- Manage all schools
- View system analytics
- User moderation
- Platform configuration

### 🟠 Principal
**School-level administration**
- Manage teachers and students
- Create and manage classes
- View school analytics
- Course approval
- Attendance oversight

### 🟡 Teacher
**Classroom management**
- Mark daily attendance
- Enter student marks
- Create and manage courses
- View class analytics
- Communicate with students
- Generate reports

### 🟢 Student
**Learning and tracking**
- View own attendance
- View marks and grades
- Enroll in courses
- Access learning materials
- Use AI chatbot for help
- Track academic progress

---

## 🔐 Authentication

### JWT-Based Authentication
- HTTP-only cookies for security
- Token expiration: 7 days
- Automatic token refresh
- Session validation on protected routes

### Password Security
- Bcrypt hashing (10 rounds)
- Minimum 6 characters
- No plain text storage

### Route Protection
```typescript
// Middleware checks user role
if (!session || !['teacher', 'principal'].includes(session.role)) {
  return redirect('/login')
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   Add all variables from `.env.local`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `COHERE_API_KEY`
   - `NEXT_PUBLIC_APP_URL`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Alternative Deployment Options

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Railway
- Connect GitHub repository
- Set environment variables
- Deploy automatically

---

## 📊 Performance Optimization

### Implemented Optimizations
- ✅ Server Components for reduced bundle size
- ✅ MongoDB indexing on critical fields
- ✅ Pagination (20 items per page)
- ✅ Debounced search (500ms)
- ✅ Lazy loading for images
- ✅ Code splitting per route
- ✅ Static asset optimization

### Future Optimizations
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Image compression pipeline
- [ ] Service worker for offline mode

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Use TypeScript
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for functions

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Cohere AI** for the powerful language model
- **Vercel** for hosting and deployment platform
- **Shadcn/UI** for beautiful UI components
- **MongoDB** for database infrastructure

---

## 📧 Contact & Support

- **Email**: 2004sharath@gmail.com
- **GitHub**: [sharath2004-tech](https://github.com/sharath2004-tech)
- **Issues**: [GitHub Issues](https://github.com/sharath2004-tech/edu-bridge-ai-platform/issues)

---

## 🗺 Roadmap

### Phase 1 (Completed) ✅
- [x] Multi-tenant architecture
- [x] Authentication & RBAC
- [x] Attendance management
- [x] Marks & exam system
- [x] AI chatbot integration
- [x] Student management

### Phase 2 (In Progress) 🚧
- [ ] Mobile app (React Native)
- [ ] Parent portal
- [ ] SMS/Email notifications
- [ ] Video conferencing integration
- [ ] Assignment submission system
- [ ] Library management

### Phase 3 (Planned) 📋
- [ ] Fee management
- [ ] Transport management
- [ ] Hostel management
- [ ] Inventory management
- [ ] HR & payroll
- [ ] Alumni portal

---

<div align="center">
  <p>Made with ❤️ by the EduBridge Team</p>
  <p>
    <a href="https://edubridge.ai">Website</a> •
    <a href="https://docs.edubridge.ai">Documentation</a> •
    <a href="https://twitter.com/edubridge">Twitter</a>
  </p>
</div>
