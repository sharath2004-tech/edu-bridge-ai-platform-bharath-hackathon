### EduBridge AI Platform

<div align="center">
  <img src="./docs/images/logo.png" alt="EduBridge AI Logo" width="200"/>
  
  ### AI-Powered Multi-Tenant Educational Management System
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Cohere AI](https://img.shields.io/badge/Cohere-AI-purple?style=for-the-badge)](https://cohere.ai/)
  
  ### 🌐 **[Live Demo](https://edu-bridge-ai-platform-bharath-hack.vercel.app/)** 
  
  **[🚀 Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/sharath2004-tech/edu-bridge-ai-platform-bharath-hackathon)** | [Features](#-key-features) • [Workflows](#-user-workflows) • [Installation](#-getting-started) • [API](#-api-routes) • [Demo Credentials](#-default-login-credentials)
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

**EduBridge AI Platform** is India's first district-centric educational AI platform that revolutionizes how schools operate and students learn. Built with cutting-edge technologies, it combines intelligent automation, AI-powered personalized learning, and offline-first architecture into a unified ecosystem designed specifically for India's diverse educational landscape.

### 🚨 The Critical Problems India Faces

India's education system is struggling with systemic challenges that prevent millions of students from reaching their full potential:

#### 1. **No Unified Platform**
- India lacks a district-level digital system to monitor learning outcomes
- Educational institutions operate in silos with no centralized tracking
- Government authorities cannot measure educational progress across regions

#### 2. **Fragmented Data Crisis**
- Educational data scattered across multiple disconnected institutions
- No way to correlate performance metrics across schools and districts
- Policymakers make decisions without comprehensive data insights

#### 3. **Zero Real-Time Insights**
- Teachers can't access student performance data instantly
- Delayed feedback loops prevent timely intervention
- Administrative burden consumes teaching time with manual data entry

#### 4. **No Personalized Support**
- Regional and rural students lack customized academic assistance
- One-size-fits-all teaching methods don't adapt to individual needs
- Students struggle without 24/7 learning support

#### 5. **Delayed Interventions**
- Schools and districts can't identify learning gaps early enough
- At-risk students fall further behind before help arrives
- No systems for proactive academic support

#### 6. **Accountability Gap**
- Government authorities have no data-driven tools to track educational progress
- Performance metrics are outdated by months or years
- Resource allocation decisions lack real-time insights

#### 7. **Language Barrier**
- English-only platforms exclude 70% of regional language students
- Digital divide creates educational inequality
- Rural students cannot access modern learning tools

#### 8. **Digital Divide**
- Urban-focused solutions ignore rural connectivity challenges
- Online-only platforms fail in low-bandwidth areas
- Expensive proprietary systems create cost barriers

### 💡 How EduBridge AI Is Different

#### Compared to Traditional Ed-Tech Solutions:

| **Traditional Platforms** | **EduBridge AI** |
|---------------------------|------------------|
| 🏙️ Urban-centric, limited rural reach | 🌾 District-level focus with rural-first design |
| 🔤 English-only interfaces | 🗣️ 12+ regional languages for true inclusivity |
| 💰 Expensive proprietary systems | 💚 Open-source core, free tier for government schools |
| 📊 Disconnected from government data | 🔗 Direct UDISE+ and state portal integration |
| 📄 Generic content for all | 🎯 District-level curriculum customization |
| 📴 Online-only, fails in low connectivity | 📱 Offline-first PWA with automatic sync |
| ⏰ Delayed insights (days/weeks) | ⚡ Real-time analytics and alerts |
| 🤖 No AI support or generic chatbots | 🧠 Context-aware AI trained on Indian curricula |

### 🎯 Our Unique Selling Propositions (USP)

**India's First District-Centric Educational AI Platform**

#### 1. **Hyper-Local Approach**
- **District-Level Data Sovereignty**: Each district maintains control of their educational data
- **Regional Language AI Models**: Trained on local contexts and dialects
- **State Board Alignment**: Content mapped to CBSE, ICSE, state boards
- **Cultural Relevance**: Examples and content reflect local contexts

#### 2. **Triple-Layer Personalization**
- **Student Level**: Adaptive learning paths based on individual performance
- **Teacher Level**: Classroom insights and intervention recommendations
- **District Level**: Policy recommendations backed by aggregated data
- **AI-Driven**: Machine learning identifies patterns and predicts outcomes

#### 3. **AI Integration**

- **Real-Time Pipelines**: Data flows to ministry dashboards instantly
- **Interoperability**: API-first architecture for ecosystem integration

#### 4. **Inclusive by Design**
- **Offline-First**: Works without internet, syncs when connected
- **Voice Interactions**: For low-literacy users and accessibility
- **Basic Device Support**: Runs on Android 6+ smartphones
- **Progressive Enhancement**: Core features work everywhere, advanced features where supported

#### 5. **Open Ecosystem**
- **Open-Source Core**: Transparent, auditable, community-driven
- **API-First Architecture**: Third-party integrations encouraged
- **Community Content**: Teachers can create and share resources
- **No Vendor Lock-in**: Data portability and export options

#### 6. **Cost-Effective Scale**
- **Cloud-Native**: Elastic scaling based on demand
- **Minimal Hardware**: No expensive infrastructure required
- **Free Tier**: Government schools access core features at no cost
- **Tiered Pricing**: Pay only for what you need

### ✅ Our Solution

EduBridge AI provides a comprehensive platform that addresses all these challenges:

- ✅ **Unified District Platform** - Single system replacing 5+ disconnected tools across entire districts
- ✅ **Offline-First PWA** - Learn anywhere without internet, automatic sync when connected
- ✅ **AI-Powered Multilingual Chatbot** - 24/7 academic support in 12+ regional languages
- ✅ **Real-Time Analytics** - Instant insights for students, teachers, and administrators
- ✅ **Smart Automation** - Attendance in 30 seconds, auto-calculated grades, reduced admin burden
- ✅ **Multi-School Support** - True multi-tenancy with complete data isolation
- ✅ **Government Integration** - Direct sync with UDISE+ and state education portals
- ✅ **Early Warning System** - Predictive analytics identify at-risk students proactively
- ✅ **Personalized Learning** - Adaptive content based on student proficiency levels
- ✅ **Accessible Design** - Voice support, mobile-first, works on basic smartphones

**Result**: A sustainable, scalable, and inclusive solution that bridges the digital divide while delivering measurable educational outcomes at the district level.

---

## 📊 EduBridge AI vs Traditional Ed-Tech: At a Glance

| Feature | Traditional Platforms | EduBridge AI Platform |
|---------|----------------------|------------------------|
| **Geographic Focus** | Urban areas only | District-level (rural + urban) |
| **Language Support** | English only | 12+ regional languages |
| **Connectivity** | Online-only | Offline-first with sync |
| **Cost Model** | Expensive proprietary | Open-source, free tier |
| **Data Integration** | Siloed, disconnected | UDISE+ & state portals |
| **Personalization** | Generic for all | AI-powered adaptive learning |
| **Government Sync** | ❌ None | ✅ Real-time integration |
| **Analytics** | Delayed (days/weeks) | Real-time insights |
| **Device Support** | High-end devices | Works on basic smartphones |
| **Accessibility** | Limited | Voice support, low-literacy friendly |
| **Pricing** | $5-20 per student/month | Free - $2 per student/month |
| **Implementation** | 6-12 months | 2-4 weeks |
| **Content** | Generic national | District-specific curriculum |
| **Support** | Business hours | 24/7 AI assistance |

### 🌐 Live Platform

**Experience EduBridge AI**: [https://edu-bridge-ai-platform-bharath-hack.vercel.app/](https://edu-bridge-ai-platform-bharath-hack.vercel.app/)

**Quick Start**:
1. Click the link above
2. Click "Take a Tour" button for guided onboarding
3. Choose "Try Demo School" for instant access
4. Login with demo credentials (provided in tour)

**Features to Try**:
- 🎓 Interactive onboarding wizard
- 👥 Multi-role dashboards (Super Admin, Principal, Teacher, Student)
- 🎬 Video upload and offline viewing
- 📊 Real-time analytics and reports
- 🤖 AI-powered chatbot assistance
- 👨‍🏫 Teacher-class assignment system

---

## 🏆 Why Choose EduBridge AI?

### For District Education Officers
- 📊 **Centralized Dashboard**: Monitor all schools in your district from one platform
- 📈 **Real-Time Reports**: Track learning outcomes instantly, not months later
- 🎯 **Data-Driven Decisions**: Resource allocation backed by comprehensive analytics
- ✅ **NEP 2020 Compliance**: Automated tracking of national education policy goals

### For School Principals
- 🏫 **Complete School Management**: Students, teachers, classes, and attendance in one system
- 👥 **Teacher Assignment**: Easily assign teachers to multiple classes and subjects
- 📋 **Performance Insights**: Identify underperforming classes early
- 💰 **Cost-Effective**: Free tier covers all essential features

### For Teachers
- ⚡ **Save Time**: Attendance in 30 seconds, auto-graded assessments
- 📊 **Student Analytics**: Instant insights into each student's performance
- 🎬 **Easy Content Sharing**: Upload videos directly, students access offline
- 📱 **Mobile-Friendly**: Manage everything from your smartphone

### For Students
- 🗣️ **Learn in Your Language**: 12+ regional languages supported
- 📚 **Offline Learning**: Download videos and learn without internet
- 🤖 **24/7 AI Tutor**: Get homework help anytime in your preferred language
- 🎯 **Personalized**: Content adapts to your learning pace and style

### For Government & Policymakers
- 🗺️ **Scalable Solution**: Deploy across districts without massive infrastructure
- 🔓 **Open Source**: Transparent, auditable, community-driven development
- 🔗 **Integrated**: Works with existing government databases (UDISE+)
- 💚 **Affordable**: Minimal cost per student compared to traditional systems

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
- **Framework**: Next.js 16 (App Router) - Server Components for optimal performance
- **Language**: TypeScript - Type-safe development
- **Styling**: Tailwind CSS - Utility-first responsive design
- **UI Components**: Shadcn/UI, Radix UI - Accessible, customizable components
- **State Management**: React Hooks - Modern, efficient state handling
- **Forms**: React Hook Form + Zod validation - Type-safe form management
- **PWA**: Service Workers + IndexedDB - Offline-first architecture

### Backend
- **Runtime**: Node.js - JavaScript runtime
- **API**: Next.js API Routes (RESTful) - Serverless API endpoints
- **Authentication**: JWT with HTTP-only cookies - Secure, stateless auth
- **Database**: MongoDB (Atlas) - Flexible, scalable NoSQL database
- **ODM**: Mongoose - Elegant MongoDB object modeling
- **CDN**: Bunny.net - Fast video storage and delivery (25GB free tier)
- **File Upload**: Multi-strategy (server + direct CDN) - Supports up to 500MB videos

### AI & Intelligence
- **AI Provider**: Cohere AI - Enterprise-grade language models
- **Model**: Command R+ - Advanced reasoning and multilingual support
- **Capabilities**:
  - 🗣️ Multilingual support (12+ Indian regional languages)
  - 🎯 Context-aware educational responses
  - 📚 Knowledge base integration for accurate answers
  - 🧠 Personalized recommendations and learning paths
  - 📊 Predictive analytics for student performance
  - ⚡ Real-time chat with conversation history

### Infrastructure & DevOps
- **Package Manager**: pnpm - Fast, disk-efficient package manager
- **Version Control**: Git & GitHub - Source code management
- **Deployment**: Vercel - Serverless deployment platform
- **Monitoring**: Vercel Analytics - Real-time performance monitoring
- **Database Hosting**: MongoDB Atlas - Cloud-hosted database
- **CDN**: Bunny.net - Global content delivery network

### Key Technical Features
- ✅ **Multi-Tenancy**: Complete data isolation via `schoolId`
- ✅ **District-Level Architecture**: Scalable to hundreds of schools per district
- ✅ **Offline-First**: Service Workers cache content for zero-connectivity scenarios
- ✅ **Real-Time Sync**: Background sync when connection is restored
- ✅ **API-First Design**: RESTful APIs for third-party integrations
- ✅ **Role-Based Access Control**: Granular permissions at API and UI levels
- ✅ **Responsive Design**: Mobile-first, works on all screen sizes
- ✅ **Performance Optimized**: Server components, pagination, lazy loading

---

## ⚠️ Platform Restrictions & Requirements

### 📧 Email Validation Rules

#### For All Users
- **Format**: Must be valid email format (user@domain.com)
- **School Email**: Recommended to use school domain for authenticity
- **Unique**: Each email can only be registered once per role
- **Case Insensitive**: Emails are stored in lowercase

#### For Super Admin & Principal Registration
- **Valid Domain Required**: Must have a real, working email domain
- **No Disposable Emails**: Temporary/disposable email services are not allowed
- **Verification**: Email must be accessible for receiving notifications
- **Examples of Valid Emails**:
  - ✅ `admin@schoolname.edu`
  - ✅ `principal@institution.org`
  - ✅ `admin@gmail.com` (verified Gmail accounts)
- **Examples of Invalid Emails**:
  - ❌ `admin@tempmail.com` (disposable)
  - ❌ `test@test.com` (non-existent domain)
  - ❌ `invalid-email` (incorrect format)

### 🎬 Video Upload Restrictions

#### Upload Methods by File Size
- **Small Files (<4MB)**: Upload through Vercel API
  - Recommended for short videos or demos
  - Instant processing and availability
  - Goes through server for validation
  
- **Large Files (≥4MB)**: Direct upload to Bunny.net CDN
  - Maximum size: 500MB per video (Bunny.net limit)
  - Bypasses Vercel's 4.5MB body size limit (free tier)
  - Automatic routing from browser directly to CDN
  - Progress tracking available

**Why Two Upload Methods?**  
Vercel's free tier has a 4.5MB request body limit. To support large video uploads (up to 500MB), files ≥4MB are uploaded directly from the user's browser to Bunny.net CDN using signed URLs, completely bypassing Vercel.

#### Download & Offline Access
- ✅ **All videos** (any size) can be downloaded for offline viewing
- ✅ Videos are served from Bunny.net CDN (no size restrictions on downloads)
- ✅ Students can download and watch offline regardless of video file size
- 💾 Browser storage limits apply (~5-10GB depending on browser)

#### Supported Video Formats
- ✅ MP4 (recommended)
- ✅ WebM
- ✅ MOV
- ✅ AVI
- ❌ Unsupported formats will be rejected

#### Video Quality Guidelines
- **Resolution**: Recommended 720p or 1080p
- **Bitrate**: 1-5 Mbps for optimal streaming
- **Frame Rate**: 24-30 fps
- **Compression**: Use H.264 codec for best compatibility

#### Storage Quotas (Bunny.net Free Tier)
- **Storage**: 25GB total (approximately 500 videos)
- **Bandwidth**: 25GB/month (approximately 1,000 video views)
- **Upgrade**: Available for $1/month per 100GB

### 👤 User Registration Restrictions

#### Student Registration
- **Require Valid Roll Number**: Must be unique within class
- **Require Parent Contact**: Valid phone number mandatory
- **Age Restriction**: Typically 5-20 years (configurable)
- **Class Assignment**: Must belong to an existing class

#### Teacher Registration
- **Subject Specialization**: Required field
- **Qualification Verification**: Optional but recommended
- **Background Check**: School's responsibility
- **Contact Verification**: Valid phone number required

#### School Registration
- **Required Information**:
  - School name (min 3 characters)
  - Official school email
  - Board registration number
  - Valid address with zip code
  - Principal contact details
- **Approval Process**: Super Admin must manually approve
- **Unique School Code**: Auto-generated, cannot be duplicated
- **Documentation**: May require proof of registration

### 🔐 Password Requirements

- **Minimum Length**: 6 characters
- **Recommended**: 8+ characters with mix of uppercase, lowercase, numbers
- **Not Allowed**: Common passwords (123456, password, etc.)
- **Expiration**: No automatic expiration (can be configured)

### 📊 Data Limits

#### Attendance
- **Bulk Operations**: Maximum 100 students per operation
- **Date Range**: Can view/edit up to 1 year of historical data
- **Status Options**: Present (P), Absent (A), Late (L)

#### Marks Entry
- **Range**: 0-100 (configurable per school)
- **Subjects**: Maximum 15 subjects per class
- **Exams**: Maximum 10 exam types per academic year
- **Historical Data**: Unlimited storage

#### Classes & Sections
- **Classes per School**: Unlimited
- **Students per Class**: Recommended maximum 50 for performance
- **Sections**: A-Z (26 sections maximum)

### 🌐 Browser Requirements

#### Minimum Browser Versions
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS 14+, Android 10+

#### Required Features
- ✅ JavaScript enabled
- ✅ Cookies enabled
- ✅ LocalStorage support (for offline features)
- ✅ IndexedDB support (for video caching)

### 📱 Offline Mode Restrictions

- **Initial Login**: Must login online at least once
- **Session Duration**: 7 days offline before re-authentication required
- **Video Storage**: Limited by browser storage (5-10GB typically)
- **Sync Required**: Upload operations require internet connection
- **Data Freshness**: Offline data may be up to 7 days old

### 🚫 Content Restrictions

#### Prohibited Content
- ❌ Copyrighted material without permission
- ❌ Inappropriate or offensive content
- ❌ Harmful or dangerous instructional content
- ❌ Personal student information in public courses
- ❌ Malware or malicious files

#### Content Moderation
- AI-powered content scanning (optional)
- Manual review by school administrators
- Reporting system for inappropriate content
- Automatic takedown for policy violations

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
- [x] Multi-tenant architecture with district-level support
- [x] Authentication & Role-Based Access Control
- [x] Attendance management system
- [x] Marks & examination system
- [x] AI chatbot integration (Cohere)
- [x] Student & teacher management
- [x] Offline-first PWA architecture
- [x] Video upload with CDN integration
- [x] Real-time analytics dashboard
- [x] School registration with approval workflow

### Phase 2 (In Progress) 🚧
- [ ] **Multilingual Content**: Support for 12+ Indian regional languages
- [ ] **UDISE+ Integration**: Direct sync with government databases
- [ ] **District Dashboard**: Aggregated analytics for district education officers
- [ ] **Voice-Based Interactions**: For low-literacy users
- [ ] **Mobile App** (React Native): Native Android/iOS apps
- [ ] **Parent Portal**: Parent engagement and communication
- [ ] **SMS/WhatsApp Notifications**: Automated alerts for attendance, marks
- [ ] **Assignment Submission**: Digital homework submission and grading
- [ ] **NEP 2020 Compliance Tracking**: Automated monitoring of policy goals

### Phase 3 (Planned) 📋
- [ ] **Regional Language AI Models**: Context-aware models for each language
- [ ] **Predictive Analytics**: Early warning system for at-risk students
- [ ] **Adaptive Learning Paths**: AI-generated personalized study plans
- [ ] **Video Conferencing**: Built-in virtual classroom support
- [ ] **Content Repository**: District-level shared resource library
- [ ] **Peer Learning Network**: Student collaboration features
- [ ] **Library Management**: Book tracking and digital library
- [ ] **Certificate Generation**: Automated certificates and transcripts

### Phase 4 (Future Vision) 🔮
- [ ] **State Education Portal Integration**: All Indian states
- [ ] **Blockchain Certificates**: Tamper-proof academic records
- [ ] **AR/VR Learning Modules**: Immersive educational experiences
- [ ] **Fee & Financial Management**: Complete school finance system
- [ ] **Transport & Hostel Management**: Comprehensive school operations
- [ ] **HR & Payroll**: Teacher management and payroll processing
- [ ] **Alumni Network**: Long-term student engagement
- [ ] **AI Content Generation**: Automated lesson plans and assessments

---

<div align="center">
  <p>Made with ❤️ by the EduBridge Team</p>
  <p>
    <a href="https://edubridge.ai">Website</a> •
    <a href="https://docs.edubridge.ai">Documentation</a> •
    <a href="https://twitter.com/edubridge">Twitter</a>
  </p>
</div>
