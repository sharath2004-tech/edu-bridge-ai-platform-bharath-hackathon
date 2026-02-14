# EduBridge AI Platform - Requirements Specification

## Document Information

- **Project Name**: EduBridge AI Platform
- **Version**: 1.0
- **Date**: February 14, 2026
- **Status**: Active Development
- **Document Type**: Software Requirements Specification (SRS)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for the EduBridge AI Platform, a comprehensive multi-tenant educational management system designed to revolutionize how schools operate and students learn.

### 1.2 Scope

EduBridge AI Platform provides:
- Multi-school management with complete data isolation
- Role-based access for Super Admin, Principal, Teacher, and Student
- AI-powered educational chatbot using Cohere AI
- Offline-first Progressive Web App (PWA) architecture
- Attendance and marks management system
- Video content delivery via CDN
- Real-time analytics and reporting

### 1.3 Intended Audience

- Development Team
- Project Managers
- Quality Assurance Team
- Stakeholders (School Administrators, Teachers, Students)
- System Administrators

### 1.4 Definitions and Acronyms

- **PWA**: Progressive Web App
- **RBAC**: Role-Based Access Control
- **CDN**: Content Delivery Network
- **JWT**: JSON Web Token
- **AI**: Artificial Intelligence
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface

---

## 2. Overall Description

### 2.1 Product Perspective

EduBridge AI is a standalone web-based platform that integrates:
- Next.js 16 frontend framework
- MongoDB database for data persistence
- Cohere AI for intelligent chatbot
- Bunny.net CDN for video delivery
- Vercel hosting platform

### 2.2 Product Functions


**Core Functions**:
1. Multi-tenant school management
2. User authentication and authorization
3. Attendance tracking and reporting
4. Marks entry and grade calculation
5. Course and content management
6. Video upload and offline viewing
7. AI-powered educational assistance
8. Real-time analytics and dashboards
9. Teacher-class assignment system
10. Interactive onboarding system

### 2.3 User Classes and Characteristics

**Super Admin**:
- Platform-wide authority
- Manages all schools and users
- Approves school registrations
- Views system-wide analytics
- Technical proficiency: High

**Principal**:
- School-level administrator
- Manages teachers, students, and classes
- Assigns teachers to classes
- Views school analytics
- Technical proficiency: Medium

**Teacher**:
- Classroom manager
- Marks attendance and enters grades
- Creates courses and uploads content
- Views class performance
- Technical proficiency: Medium

**Student**:
- End learner
- Views attendance and marks
- Accesses courses and videos offline
- Uses AI chatbot for help
- Technical proficiency: Low to Medium

### 2.4 Operating Environment

**Client-Side**:
- Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS 14+, Android 10+)
- Internet connection (required for initial access, optional for offline features)
- Minimum 5GB browser storage for offline videos

**Server-Side**:
- Vercel hosting platform
- Node.js 18+ runtime
- MongoDB Atlas database
- Bunny.net CDN


### 2.5 Design and Implementation Constraints

**Technical Constraints**:
- Must use Next.js 16 App Router
- Must use TypeScript for type safety
- Must use MongoDB for data persistence
- Must implement JWT-based authentication
- Must support offline functionality via PWA
- Vercel free tier: 4.5MB request body limit
- Bunny.net free tier: 25GB storage, 25GB bandwidth/month

**Regulatory Constraints**:
- GDPR compliance for data privacy
- Educational data protection standards
- Secure password storage (bcrypt)
- HTTPS/TLS encryption required

**Business Constraints**:
- Must be cost-effective for schools
- Must work in low-connectivity areas
- Must scale to 100+ schools
- Must support multiple languages (future)

### 2.6 Assumptions and Dependencies

**Assumptions**:
- Users have access to modern web browsers
- Schools have basic internet connectivity
- Users have valid email addresses
- Schools provide accurate registration information

**Dependencies**:
- MongoDB Atlas availability
- Cohere AI API availability
- Bunny.net CDN uptime
- Vercel platform stability
- Third-party npm packages

---

## 3. Functional Requirements

### 3.1 User Management

#### 3.1.1 User Registration

**FR-UM-001**: The system shall allow new users to register with email and password.


- **Priority**: High
- **Input**: Name, email, password, role, school code
- **Output**: User account created, confirmation message
- **Validation**: Email format, password minimum 6 characters, unique email

**FR-UM-002**: The system shall validate email addresses for Super Admin and Principal roles.
- **Priority**: High
- **Validation**: No disposable email services, valid domain required

**FR-UM-003**: The system shall assign unique roll numbers to students within their class.
- **Priority**: High
- **Validation**: Roll number unique per class

**FR-UM-004**: The system shall require parent contact information for student registration.
- **Priority**: Medium
- **Input**: Parent name, parent phone number

#### 3.1.2 User Authentication

**FR-UM-005**: The system shall authenticate users using email and password.
- **Priority**: High
- **Process**: Validate credentials, generate JWT token, set HTTP-only cookie
- **Security**: Bcrypt password hashing (10 rounds)

**FR-UM-006**: The system shall maintain user sessions for 7 days.
- **Priority**: High
- **Token**: JWT with 7-day expiration

**FR-UM-007**: The system shall allow users to logout and invalidate their session.
- **Priority**: High
- **Process**: Clear authentication cookie

**FR-UM-008**: The system shall allow users to change their password.
- **Priority**: Medium
- **Security**: Require current password verification


#### 3.1.3 Role-Based Access Control

**FR-UM-009**: The system shall implement role-based access control with four roles.
- **Priority**: High
- **Roles**: Super Admin, Principal, Teacher, Student
- **Access**: Each role has specific permissions

**FR-UM-010**: The system shall restrict Super Admin features to super-admin role only.
- **Priority**: High
- **Features**: Manage all schools, approve registrations, platform analytics

**FR-UM-011**: The system shall restrict Principal features to principal role and above.
- **Priority**: High
- **Features**: Manage school, teachers, students, classes

**FR-UM-012**: The system shall restrict Teacher features to teacher role and above.
- **Priority**: High
- **Features**: Mark attendance, enter marks, create courses

**FR-UM-013**: The system shall allow students to view only their own data.
- **Priority**: High
- **Data**: Own attendance, marks, courses, profile

### 3.2 School Management

#### 3.2.1 School Registration

**FR-SM-001**: The system shall allow new schools to register via registration form.
- **Priority**: High
- **Input**: School name, email, phone, address, principal details, board
- **Output**: Registration submitted, pending approval status

**FR-SM-002**: The system shall generate unique school codes automatically.
- **Priority**: High
- **Format**: Alphanumeric, 8 characters (e.g., "GVHS2025")
- **Validation**: Must be unique across platform


**FR-SM-003**: The system shall require Super Admin approval for new schools.
- **Priority**: High
- **Process**: Super Admin reviews and approves/rejects
- **Status**: Pending → Approved/Rejected

**FR-SM-004**: The system shall notify principals when their school is approved.
- **Priority**: Medium
- **Notification**: Email or in-app notification

#### 3.2.2 Multi-Tenancy

**FR-SM-005**: The system shall isolate data between schools using schoolId.
- **Priority**: Critical
- **Implementation**: All queries filtered by schoolId
- **Security**: Users cannot access other schools' data

**FR-SM-006**: The system shall support unlimited schools on single platform.
- **Priority**: High
- **Scalability**: Shared database with tenant isolation

**FR-SM-007**: The system shall allow Super Admin to view all schools' data.
- **Priority**: High
- **Access**: Cross-school analytics and management

### 3.3 Class Management

**FR-CM-001**: The system shall allow creation of classes with name and section.
- **Priority**: High
- **Input**: Class name (e.g., "10th"), section (e.g., "A"), academic year
- **Output**: Class created with unique ID

**FR-CM-002**: The system shall assign a class teacher to each class.
- **Priority**: High
- **Assignment**: One teacher per class as class teacher


**FR-CM-003**: The system shall support sections A-Z (maximum 26 sections).
- **Priority**: Medium
- **Validation**: Section must be single uppercase letter

**FR-CM-004**: The system shall track class strength (number of students).
- **Priority**: Medium
- **Calculation**: Auto-calculated from enrolled students

**FR-CM-005**: The system shall allow assigning multiple teachers to a class.
- **Priority**: High
- **Feature**: Teacher assignment system for subject teachers
- **Access**: Principal and Super Admin can assign

### 3.4 Attendance Management

#### 3.4.1 Attendance Marking

**FR-AM-001**: The system shall allow teachers to mark attendance for their classes.
- **Priority**: High
- **Input**: Class, date, student status (Present/Absent/Late)
- **Output**: Attendance records saved

**FR-AM-002**: The system shall support bulk attendance marking.
- **Priority**: High
- **Capacity**: Up to 100 students per operation
- **Interface**: Quick-mark buttons (P/A/L)

**FR-AM-003**: The system shall allow attendance marking for any past date.
- **Priority**: Medium
- **Range**: Up to 1 year historical data

**FR-AM-004**: The system shall prevent duplicate attendance entries.
- **Priority**: High
- **Validation**: One entry per student per date


**FR-AM-005**: The system shall allow editing of previously marked attendance.
- **Priority**: Medium
- **Access**: Teachers and above

#### 3.4.2 Attendance Reporting

**FR-AM-006**: The system shall calculate attendance percentage automatically.
- **Priority**: High
- **Formula**: (Present days / Total days) × 100
- **Display**: Percentage with 2 decimal places

**FR-AM-007**: The system shall generate monthly attendance reports.
- **Priority**: Medium
- **Output**: PDF/Excel export with student-wise data

**FR-AM-008**: The system shall show attendance trends and analytics.
- **Priority**: Medium
- **Visualization**: Charts showing attendance patterns

**FR-AM-009**: The system shall allow students to view their own attendance.
- **Priority**: High
- **Access**: Students can view only their records

**FR-AM-010**: The system shall allow principals to view school-wide attendance.
- **Priority**: High
- **Scope**: All classes in their school

### 3.5 Marks Management

#### 3.5.1 Marks Entry

**FR-MM-001**: The system shall allow teachers to enter marks for exams.
- **Priority**: High
- **Input**: Student, exam, subject, marks scored, total marks
- **Output**: Mark record saved


**FR-MM-002**: The system shall support bulk marks entry.
- **Priority**: High
- **Capacity**: Multiple students per operation
- **Interface**: Table-based entry form

**FR-MM-003**: The system shall validate marks within range (0-100).
- **Priority**: High
- **Validation**: Marks scored ≤ Total marks

**FR-MM-004**: The system shall calculate percentage automatically.
- **Priority**: High
- **Formula**: (Marks scored / Total marks) × 100

#### 3.5.2 Grade Calculation

**FR-MM-005**: The system shall auto-calculate grades based on percentage.
- **Priority**: High
- **Grading Scale**:
  - A+: 90-100%
  - A: 80-89%
  - B: 70-79%
  - C: 60-69%
  - D: 50-59%
  - F: Below 50%

**FR-MM-006**: The system shall allow custom grading scales per school.
- **Priority**: Low
- **Configuration**: School-specific grade boundaries

#### 3.5.3 Marks Reporting

**FR-MM-007**: The system shall generate mark sheets for students.
- **Priority**: High
- **Output**: PDF with all subjects and grades

**FR-MM-008**: The system shall calculate class rank based on total marks.
- **Priority**: Medium
- **Calculation**: Rank within class for each exam


**FR-MM-009**: The system shall show subject-wise performance analytics.
- **Priority**: Medium
- **Metrics**: Average, highest, lowest, improvement trends

**FR-MM-010**: The system shall allow students to view their own marks.
- **Priority**: High
- **Access**: Students can view only their records

### 3.6 Course Management

#### 3.6.1 Course Creation

**FR-CR-001**: The system shall allow teachers to create courses.
- **Priority**: High
- **Input**: Course name, description, subject, class
- **Output**: Course created with unique ID

**FR-CR-002**: The system shall support multimedia content in courses.
- **Priority**: High
- **Content Types**: Videos, PDFs, images, text lessons

**FR-CR-003**: The system shall allow organizing courses into lessons.
- **Priority**: Medium
- **Structure**: Course → Lessons → Content items

**FR-CR-004**: The system shall allow adding quizzes to courses.
- **Priority**: Medium
- **Quiz Types**: Multiple choice, true/false, short answer

#### 3.6.2 Course Enrollment

**FR-CR-005**: The system shall allow students to enroll in courses.
- **Priority**: High
- **Process**: Browse courses, click enroll, confirmation

**FR-CR-006**: The system shall track course progress for students.
- **Priority**: Medium
- **Metrics**: Lessons completed, quiz scores, time spent


**FR-CR-007**: The system shall allow students to rate and review courses.
- **Priority**: Low
- **Rating**: 1-5 stars with optional text review

### 3.7 Video Management

#### 3.7.1 Video Upload

**FR-VM-001**: The system shall support video uploads up to 500MB.
- **Priority**: High
- **Formats**: MP4, WebM, MOV, AVI
- **Storage**: Bunny.net CDN

**FR-VM-002**: The system shall route small videos (<4MB) through server.
- **Priority**: High
- **Process**: Upload to Vercel → Forward to Bunny.net

**FR-VM-003**: The system shall route large videos (≥4MB) directly to CDN.
- **Priority**: High
- **Process**: Generate signed URL → Direct browser upload to Bunny.net

**FR-VM-004**: The system shall show upload progress for all file sizes.
- **Priority**: Medium
- **Display**: Progress bar with percentage

**FR-VM-005**: The system shall validate video formats before upload.
- **Priority**: High
- **Validation**: Check file extension and MIME type

#### 3.7.2 Video Delivery

**FR-VM-006**: The system shall serve videos from CDN for fast delivery.
- **Priority**: High
- **CDN**: Bunny.net with global edge locations


**FR-VM-007**: The system shall allow students to download videos for offline viewing.
- **Priority**: High
- **Storage**: Browser IndexedDB
- **Limit**: Based on browser storage quota (5-10GB typical)

**FR-VM-008**: The system shall support video streaming with adaptive quality.
- **Priority**: Medium
- **Quality**: Auto-adjust based on connection speed

**FR-VM-009**: The system shall track video view analytics.
- **Priority**: Low
- **Metrics**: Views, watch time, completion rate

### 3.8 AI Chatbot

#### 3.8.1 Chatbot Functionality

**FR-AI-001**: The system shall provide an AI-powered educational chatbot.
- **Priority**: High
- **Provider**: Cohere AI (Command R+ model)
- **Access**: All authenticated users

**FR-AI-002**: The system shall provide role-specific chatbot responses.
- **Priority**: High
- **Context**: User role, school, class, recent activity

**FR-AI-003**: The system shall maintain chat history for continuity.
- **Priority**: Medium
- **Storage**: Last 10 messages per user session

**FR-AI-004**: The system shall support educational queries and homework help.
- **Priority**: High
- **Topics**: Subject concepts, problem solving, study tips


**FR-AI-005**: The system shall provide safe and appropriate responses.
- **Priority**: Critical
- **Filtering**: No inappropriate, harmful, or offensive content

**FR-AI-006**: The system shall handle chatbot errors gracefully.
- **Priority**: High
- **Fallback**: User-friendly error messages, retry option

### 3.9 Analytics and Reporting

#### 3.9.1 Student Analytics

**FR-AN-001**: The system shall show student performance dashboard.
- **Priority**: High
- **Metrics**: Attendance %, average marks, course progress

**FR-AN-002**: The system shall show subject-wise performance trends.
- **Priority**: Medium
- **Visualization**: Line charts showing improvement over time

**FR-AN-003**: The system shall identify weak areas for students.
- **Priority**: Medium
- **Analysis**: Subjects/topics with low scores

#### 3.9.2 Teacher Analytics

**FR-AN-004**: The system shall show class performance overview.
- **Priority**: High
- **Metrics**: Average attendance, average marks, top performers

**FR-AN-005**: The system shall show subject-wise class analytics.
- **Priority**: Medium
- **Comparison**: Performance across different subjects


#### 3.9.3 Principal Analytics

**FR-AN-006**: The system shall show school-wide statistics.
- **Priority**: High
- **Metrics**: Total students, teachers, classes, overall attendance

**FR-AN-007**: The system shall show comparative class performance.
- **Priority**: Medium
- **Comparison**: Performance across different classes

**FR-AN-008**: The system shall generate school reports.
- **Priority**: Medium
- **Output**: PDF/Excel with comprehensive school data

#### 3.9.4 Super Admin Analytics

**FR-AN-009**: The system shall show platform-wide statistics.
- **Priority**: High
- **Metrics**: Total schools, users, active sessions

**FR-AN-010**: The system shall show school comparison analytics.
- **Priority**: Medium
- **Comparison**: Performance across different schools

### 3.10 Onboarding System

**FR-ON-001**: The system shall show interactive onboarding on first visit.
- **Priority**: High
- **Trigger**: First-time user detection via localStorage

**FR-ON-002**: The system shall provide two onboarding paths.
- **Priority**: High
- **Paths**: Demo mode with credentials, or new school registration

**FR-ON-003**: The system shall display demo credentials for all roles.
- **Priority**: High
- **Roles**: Super Admin, Principal, Teacher, Student


**FR-ON-004**: The system shall allow replaying onboarding via "Take a Tour" button.
- **Priority**: Medium
- **Location**: Navigation bar, always accessible

**FR-ON-005**: The system shall provide step-by-step feature explanation.
- **Priority**: Medium
- **Format**: Progressive slides with images and descriptions

### 3.11 Teacher Assignment

**FR-TA-001**: The system shall allow assigning teachers to multiple classes.
- **Priority**: High
- **Access**: Principal and Super Admin
- **Interface**: Interactive assignment dialog

**FR-TA-002**: The system shall show teacher assignment summary.
- **Priority**: Medium
- **Display**: "X classes, Y subjects" instead of raw IDs

**FR-TA-003**: The system shall allow removing teacher assignments.
- **Priority**: High
- **Process**: Select teacher, remove from class

**FR-TA-004**: The system shall validate teacher availability before assignment.
- **Priority**: Medium
- **Validation**: Check for scheduling conflicts (future)

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

**NFR-PF-001**: The system shall load pages within 3 seconds on 3G connection.
- **Priority**: High
- **Measurement**: Time to Interactive (TTI)


**NFR-PF-002**: The system shall support 10,000 concurrent users.
- **Priority**: High
- **Scalability**: Horizontal scaling on Vercel

**NFR-PF-003**: The system shall respond to API requests within 500ms.
- **Priority**: High
- **Measurement**: Average response time (p95)

**NFR-PF-004**: The system shall handle 100 students per class efficiently.
- **Priority**: Medium
- **Optimization**: Pagination, indexing, caching

**NFR-PF-005**: The system shall support video streaming without buffering.
- **Priority**: High
- **CDN**: Bunny.net with edge caching

### 4.2 Security Requirements

**NFR-SC-001**: The system shall encrypt all data in transit using HTTPS/TLS.
- **Priority**: Critical
- **Implementation**: SSL certificate, HTTPS redirect

**NFR-SC-002**: The system shall encrypt passwords using bcrypt.
- **Priority**: Critical
- **Rounds**: 10 rounds minimum

**NFR-SC-003**: The system shall use HTTP-only cookies for authentication.
- **Priority**: Critical
- **Flags**: HttpOnly, Secure, SameSite=Strict

**NFR-SC-004**: The system shall implement JWT token expiration.
- **Priority**: High
- **Duration**: 7 days maximum


**NFR-SC-005**: The system shall validate all user inputs.
- **Priority**: Critical
- **Validation**: Zod schemas, sanitization

**NFR-SC-006**: The system shall prevent SQL injection attacks.
- **Priority**: Critical
- **Implementation**: Mongoose ODM, parameterized queries

**NFR-SC-007**: The system shall prevent XSS attacks.
- **Priority**: Critical
- **Implementation**: React automatic escaping, CSP headers

**NFR-SC-008**: The system shall implement rate limiting on API endpoints.
- **Priority**: High
- **Limit**: 100 requests per minute per IP (future)

**NFR-SC-009**: The system shall log all authentication attempts.
- **Priority**: Medium
- **Logging**: Timestamp, IP, success/failure

**NFR-SC-010**: The system shall enforce data isolation between schools.
- **Priority**: Critical
- **Implementation**: schoolId filtering on all queries

### 4.3 Reliability Requirements

**NFR-RL-001**: The system shall have 99.9% uptime.
- **Priority**: High
- **Measurement**: Monthly uptime percentage

**NFR-RL-002**: The system shall handle database connection failures gracefully.
- **Priority**: High
- **Fallback**: Retry logic, error messages


**NFR-RL-003**: The system shall backup data daily.
- **Priority**: High
- **Backup**: MongoDB Atlas automated backups

**NFR-RL-004**: The system shall recover from crashes within 5 minutes.
- **Priority**: High
- **Recovery**: Automatic restart, health checks

**NFR-RL-005**: The system shall handle API errors without crashing.
- **Priority**: High
- **Error Handling**: Try-catch blocks, error boundaries

### 4.4 Usability Requirements

**NFR-US-001**: The system shall be accessible to users with disabilities.
- **Priority**: High
- **Standards**: WCAG 2.1 Level AA compliance (target)

**NFR-US-002**: The system shall provide intuitive navigation.
- **Priority**: High
- **Design**: Clear menus, breadcrumbs, consistent layout

**NFR-US-003**: The system shall provide helpful error messages.
- **Priority**: High
- **Messages**: Clear, actionable, user-friendly

**NFR-US-004**: The system shall support mobile devices.
- **Priority**: High
- **Design**: Responsive design, touch-friendly

**NFR-US-005**: The system shall provide search functionality.
- **Priority**: Medium
- **Scope**: Students, courses, classes


**NFR-US-006**: The system shall provide pagination for large lists.
- **Priority**: High
- **Page Size**: 20 items per page

**NFR-US-007**: The system shall provide loading indicators.
- **Priority**: Medium
- **Indicators**: Spinners, skeleton screens

### 4.5 Scalability Requirements

**NFR-SL-001**: The system shall support 100+ schools.
- **Priority**: High
- **Architecture**: Multi-tenant with shared database

**NFR-SL-002**: The system shall support 10,000+ students per school.
- **Priority**: Medium
- **Optimization**: Indexing, pagination, caching

**NFR-SL-003**: The system shall scale horizontally.
- **Priority**: High
- **Platform**: Vercel serverless functions

**NFR-SL-004**: The system shall support database sharding (future).
- **Priority**: Low
- **Strategy**: Shard by schoolId

### 4.6 Maintainability Requirements

**NFR-MT-001**: The system shall use TypeScript for type safety.
- **Priority**: High
- **Coverage**: 100% TypeScript, no JavaScript files

**NFR-MT-002**: The system shall follow consistent code style.
- **Priority**: High
- **Tools**: ESLint, Prettier


**NFR-MT-003**: The system shall have comprehensive documentation.
- **Priority**: High
- **Docs**: README, API docs, code comments

**NFR-MT-004**: The system shall have modular architecture.
- **Priority**: High
- **Structure**: Separation of concerns, reusable components

**NFR-MT-005**: The system shall have automated tests.
- **Priority**: Medium
- **Coverage**: 60%+ code coverage (target)

### 4.7 Portability Requirements

**NFR-PT-001**: The system shall work on all major browsers.
- **Priority**: High
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**NFR-PT-002**: The system shall work on mobile browsers.
- **Priority**: High
- **Mobile**: iOS 14+, Android 10+

**NFR-PT-003**: The system shall be deployable on multiple platforms.
- **Priority**: Medium
- **Platforms**: Vercel, Railway, Docker

### 4.8 Offline Requirements

**NFR-OF-001**: The system shall function offline after initial login.
- **Priority**: High
- **Duration**: 7 days offline before re-authentication

**NFR-OF-002**: The system shall cache videos for offline viewing.
- **Priority**: High
- **Storage**: IndexedDB, up to browser quota


**NFR-OF-003**: The system shall sync data when connection is restored.
- **Priority**: High
- **Strategy**: Background sync, conflict resolution

**NFR-OF-004**: The system shall show offline status indicator.
- **Priority**: Medium
- **Display**: Banner or icon showing offline mode

**NFR-OF-005**: The system shall queue operations for later sync.
- **Priority**: Medium
- **Operations**: Attendance, marks, course progress

### 4.9 Compliance Requirements

**NFR-CP-001**: The system shall comply with GDPR.
- **Priority**: High
- **Features**: Data export, deletion, consent

**NFR-CP-002**: The system shall comply with educational data protection laws.
- **Priority**: High
- **Standards**: FERPA (US), local regulations

**NFR-CP-003**: The system shall provide data retention policies.
- **Priority**: Medium
- **Policy**: Define retention periods for different data types

**NFR-CP-004**: The system shall provide audit logs.
- **Priority**: Medium
- **Logging**: User actions, data changes, access logs

---

## 5. System Features Priority

### 5.1 Must Have (P0)

1. User authentication and authorization
2. Multi-tenant school management
3. Attendance marking and viewing
4. Marks entry and viewing
5. Role-based access control
6. Data isolation between schools


7. Basic course management
8. Video upload and delivery
9. Security (HTTPS, password hashing, JWT)

### 5.2 Should Have (P1)

1. AI chatbot integration
2. Offline video viewing
3. Teacher assignment system
4. Interactive onboarding
5. Analytics dashboards
6. Bulk operations (attendance, marks)
7. School approval workflow
8. Auto-grade calculation
9. Pagination and search

### 5.3 Could Have (P2)

1. Advanced analytics and trends
2. Report generation (PDF/Excel)
3. Quiz system
4. Course ratings and reviews
5. Email notifications
6. Mobile app (PWA)
7. Multi-language support
8. Custom grading scales

### 5.4 Won't Have (This Release)

1. Video conferencing
2. Real-time chat between users
3. Parent portal
4. Payment integration
5. Blockchain certificates
6. AR/VR learning modules
7. Plagiarism detection
8. Automated essay grading

---

## 6. External Interface Requirements

### 6.1 User Interfaces

**UI-001**: The system shall provide a responsive web interface.
- **Framework**: Next.js with Tailwind CSS
- **Components**: Shadcn/UI, Radix UI


**UI-002**: The system shall provide role-specific dashboards.
- **Dashboards**: Super Admin, Principal, Teacher, Student
- **Content**: Role-appropriate widgets and navigation

**UI-003**: The system shall provide consistent navigation.
- **Navigation**: Sidebar for main menu, top bar for user actions
- **Responsive**: Collapsible sidebar on mobile

**UI-004**: The system shall use consistent color scheme.
- **Theme**: Professional, educational, accessible
- **Colors**: High contrast for readability

### 6.2 Hardware Interfaces

**HW-001**: The system shall support standard input devices.
- **Devices**: Keyboard, mouse, touchscreen
- **Accessibility**: Keyboard navigation support

**HW-002**: The system shall support camera for future features.
- **Future**: Profile pictures, document scanning
- **Permissions**: Request camera access when needed

### 6.3 Software Interfaces

**SW-001**: The system shall interface with MongoDB Atlas.
- **Purpose**: Data persistence
- **Protocol**: MongoDB wire protocol
- **Version**: MongoDB 7.0+

**SW-002**: The system shall interface with Cohere AI API.
- **Purpose**: AI chatbot functionality
- **Protocol**: HTTPS REST API
- **Model**: Command R+


**SW-003**: The system shall interface with Bunny.net CDN.
- **Purpose**: Video storage and delivery
- **Protocol**: HTTPS REST API
- **Features**: Upload, streaming, download

**SW-004**: The system shall interface with browser APIs.
- **APIs**: IndexedDB, Service Worker, Cache API
- **Purpose**: Offline functionality

### 6.4 Communication Interfaces

**CM-001**: The system shall use HTTPS for all communications.
- **Protocol**: HTTPS (TLS 1.2+)
- **Port**: 443

**CM-002**: The system shall use RESTful API architecture.
- **Format**: JSON request/response
- **Methods**: GET, POST, PUT, DELETE

**CM-003**: The system shall use WebSocket for future real-time features.
- **Purpose**: Real-time notifications, chat
- **Protocol**: WSS (WebSocket Secure)

---

## 7. Data Requirements

### 7.1 Data Models

**Core Entities**:
1. User (Super Admin, Principal, Teacher, Student)
2. School
3. Class
4. Subject
5. Attendance
6. Mark
7. Exam
8. Course
9. Lesson
10. Quiz
11. ChatHistory

### 7.2 Data Retention

**DR-001**: The system shall retain user data indefinitely until deletion.
- **Scope**: User profiles, authentication data


**DR-002**: The system shall retain attendance data for 5 years.
- **Purpose**: Historical records, compliance

**DR-003**: The system shall retain marks data for 5 years.
- **Purpose**: Academic records, transcripts

**DR-004**: The system shall retain chat history for 30 days.
- **Purpose**: Recent context, privacy

**DR-005**: The system shall allow data export before deletion.
- **Format**: JSON, CSV, PDF
- **Scope**: All user-related data

### 7.3 Data Backup

**DB-001**: The system shall backup database daily.
- **Frequency**: Every 24 hours
- **Provider**: MongoDB Atlas automated backups

**DB-002**: The system shall retain backups for 30 days.
- **Retention**: Rolling 30-day window

**DB-003**: The system shall allow point-in-time recovery.
- **Window**: Last 30 days
- **Granularity**: 1-hour intervals

### 7.4 Data Migration

**DM-001**: The system shall support data import from CSV.
- **Entities**: Students, teachers, classes
- **Validation**: Format validation before import

**DM-002**: The system shall support data export to CSV/Excel.
- **Entities**: All major entities
- **Access**: Role-based export permissions

---

## 8. Quality Attributes

### 8.1 Availability

- **Target**: 99.9% uptime (8.76 hours downtime per year)
- **Measurement**: Monthly uptime monitoring


- **Monitoring**: Health checks, alerting

### 8.2 Performance

- **Page Load**: < 3 seconds on 3G
- **API Response**: < 500ms (p95)
- **Video Streaming**: No buffering on 4G+
- **Concurrent Users**: 10,000+

### 8.3 Security

- **Authentication**: JWT with HTTP-only cookies
- **Encryption**: HTTPS/TLS for transit, bcrypt for passwords
- **Authorization**: Role-based access control
- **Data Isolation**: Multi-tenant with schoolId filtering

### 8.4 Usability

- **Learning Curve**: < 30 minutes for basic operations
- **Error Rate**: < 5% user errors
- **Satisfaction**: > 4.0/5.0 user rating (target)
- **Accessibility**: WCAG 2.1 Level AA (target)

### 8.5 Maintainability

- **Code Quality**: TypeScript, ESLint, Prettier
- **Documentation**: Comprehensive README, API docs
- **Test Coverage**: > 60% (target)
- **Modularity**: Component-based architecture

### 8.6 Reliability

- **Mean Time Between Failures (MTBF)**: > 720 hours (30 days)
- **Mean Time To Recovery (MTTR)**: < 5 minutes
- **Error Rate**: < 0.1% of requests

---

## 9. Constraints

### 9.1 Technical Constraints


1. Must use Next.js 16 App Router
2. Must use TypeScript for type safety
3. Must use MongoDB for database
4. Must deploy on Vercel platform
5. Vercel free tier: 4.5MB request body limit
6. Bunny.net free tier: 25GB storage, 25GB bandwidth/month
7. Browser storage: 5-10GB typical limit

### 9.2 Business Constraints

1. Must be cost-effective for schools
2. Must support low-connectivity areas
3. Must scale to 100+ schools
4. Must launch within 6 months
5. Must comply with educational regulations

### 9.3 Regulatory Constraints

1. GDPR compliance for EU users
2. FERPA compliance for US schools
3. Local data protection laws
4. Educational content standards
5. Accessibility standards (WCAG 2.1)

### 9.4 Resource Constraints

1. Development team: 2-4 developers
2. Budget: Limited (free tier services)
3. Timeline: 6 months to MVP
4. Infrastructure: Serverless (Vercel)

---

## 10. Acceptance Criteria

### 10.1 Functional Acceptance

**AC-F-001**: User can register and login successfully.
- **Test**: Create account, login, access dashboard

**AC-F-002**: Teacher can mark attendance for entire class in < 30 seconds.
- **Test**: Select class, mark 50 students, save


**AC-F-003**: Teacher can enter marks and grades are auto-calculated.
- **Test**: Enter marks, verify grade calculation

**AC-F-004**: Student can download and view videos offline.
- **Test**: Download video, go offline, play video

**AC-F-005**: AI chatbot provides relevant educational responses.
- **Test**: Ask educational question, verify response quality

**AC-F-006**: Principal can assign teachers to classes.
- **Test**: Select teacher, assign to class, verify assignment

**AC-F-007**: Super Admin can approve school registrations.
- **Test**: Review pending school, approve, verify activation

**AC-F-008**: Data is isolated between schools.
- **Test**: Login as different schools, verify no data leakage

### 10.2 Performance Acceptance

**AC-P-001**: Pages load within 3 seconds on 3G.
- **Test**: Lighthouse performance score > 70

**AC-P-002**: API responds within 500ms.
- **Test**: Load testing with 100 concurrent requests

**AC-P-003**: Video uploads complete successfully for files up to 500MB.
- **Test**: Upload various file sizes, verify success

**AC-P-004**: System supports 10,000 concurrent users.
- **Test**: Load testing with 10,000 simulated users

### 10.3 Security Acceptance

**AC-S-001**: Passwords are hashed and not stored in plain text.
- **Test**: Inspect database, verify bcrypt hashes


**AC-S-002**: Authentication uses HTTP-only cookies.
- **Test**: Inspect browser cookies, verify HttpOnly flag

**AC-S-003**: All communications use HTTPS.
- **Test**: Verify SSL certificate, check for mixed content

**AC-S-004**: Users cannot access other schools' data.
- **Test**: Attempt cross-school data access, verify denial

**AC-S-005**: Input validation prevents injection attacks.
- **Test**: Attempt SQL injection, XSS attacks, verify prevention

### 10.4 Usability Acceptance

**AC-U-001**: New users can complete onboarding in < 5 minutes.
- **Test**: User testing with 10 new users

**AC-U-002**: Interface is responsive on mobile devices.
- **Test**: Test on iOS and Android devices

**AC-U-003**: Error messages are clear and actionable.
- **Test**: Trigger errors, verify message quality

**AC-U-004**: Navigation is intuitive and consistent.
- **Test**: User testing, measure task completion rate

---

## 11. Testing Requirements

### 11.1 Unit Testing

- **Coverage**: > 60% code coverage
- **Framework**: Jest, React Testing Library
- **Scope**: Utility functions, components, calculations

### 11.2 Integration Testing

- **Scope**: API routes, database operations, authentication
- **Tools**: Jest, Supertest
- **Coverage**: All critical user flows


### 11.3 End-to-End Testing

- **Scope**: Complete user workflows
- **Tools**: Playwright, Cypress
- **Scenarios**: Login, attendance, marks, courses

### 11.4 Performance Testing

- **Load Testing**: 10,000 concurrent users
- **Stress Testing**: Find breaking point
- **Tools**: k6, Artillery

### 11.5 Security Testing

- **Penetration Testing**: Identify vulnerabilities
- **Authentication Testing**: Verify access controls
- **Tools**: OWASP ZAP, manual testing

### 11.6 Usability Testing

- **User Testing**: 10+ users per role
- **Metrics**: Task completion rate, time, satisfaction
- **Method**: Think-aloud protocol

### 11.7 Compatibility Testing

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, tablet, mobile
- **OS**: Windows, macOS, Linux, iOS, Android

---

## 12. Documentation Requirements

### 12.1 User Documentation

**DOC-U-001**: User manual for each role.
- **Content**: Step-by-step guides, screenshots
- **Format**: PDF, online help

**DOC-U-002**: Video tutorials for common tasks.
- **Topics**: Login, attendance, marks, courses
- **Duration**: 2-5 minutes each


**DOC-U-003**: FAQ section for common questions.
- **Topics**: Account issues, technical problems, features
- **Format**: Searchable knowledge base

### 12.2 Technical Documentation

**DOC-T-001**: API documentation with examples.
- **Format**: OpenAPI/Swagger specification
- **Content**: Endpoints, parameters, responses

**DOC-T-002**: Database schema documentation.
- **Content**: Entity relationships, indexes, constraints
- **Format**: Markdown with diagrams

**DOC-T-003**: Deployment guide.
- **Content**: Environment setup, configuration, deployment steps
- **Format**: Markdown README

**DOC-T-004**: Architecture documentation.
- **Content**: System design, data flow, security
- **Format**: Design document (this document)

### 12.3 Developer Documentation

**DOC-D-001**: Code comments and JSDoc.
- **Coverage**: All public functions and components
- **Standard**: JSDoc format

**DOC-D-002**: Contributing guide.
- **Content**: Code style, PR process, testing
- **Format**: CONTRIBUTING.md

**DOC-D-003**: Setup guide for local development.
- **Content**: Prerequisites, installation, running locally
- **Format**: README.md

---

## 13. Deployment Requirements

### 13.1 Deployment Environment


**DEP-001**: The system shall be deployed on Vercel.
- **Platform**: Vercel serverless
- **Region**: Auto (global edge network)

**DEP-002**: The system shall use MongoDB Atlas for database.
- **Tier**: M0 (free) for development, M10+ for production
- **Region**: Closest to primary users

**DEP-003**: The system shall use Bunny.net for CDN.
- **Storage Zone**: Dedicated zone for videos
- **Region**: Global distribution

### 13.2 CI/CD Pipeline

**DEP-004**: The system shall use automated deployment.
- **Trigger**: Git push to main branch
- **Process**: Build → Test → Deploy

**DEP-005**: The system shall run tests before deployment.
- **Tests**: Unit, integration, linting, type checking
- **Failure**: Block deployment on test failure

**DEP-006**: The system shall support rollback.
- **Method**: Vercel instant rollback
- **Trigger**: Manual or automatic on errors

### 13.3 Environment Configuration

**DEP-007**: The system shall support multiple environments.
- **Environments**: Development, staging, production
- **Config**: Environment-specific variables

**DEP-008**: The system shall use environment variables for secrets.
- **Secrets**: API keys, database URLs, JWT secret
- **Storage**: Vercel environment variables

---

## 14. Maintenance Requirements

### 14.1 Monitoring


**MNT-001**: The system shall monitor application health.
- **Metrics**: Uptime, response time, error rate
- **Tools**: Vercel Analytics, custom logging

**MNT-002**: The system shall monitor database performance.
- **Metrics**: Query time, connection pool, storage
- **Tools**: MongoDB Atlas monitoring

**MNT-003**: The system shall monitor CDN usage.
- **Metrics**: Bandwidth, storage, requests
- **Tools**: Bunny.net dashboard

**MNT-004**: The system shall alert on critical errors.
- **Channels**: Email, Slack (future)
- **Triggers**: High error rate, downtime, quota exceeded

### 14.2 Updates and Patches

**MNT-005**: The system shall support zero-downtime deployments.
- **Method**: Vercel atomic deployments
- **Process**: New version deployed, traffic switched

**MNT-006**: The system shall apply security patches within 48 hours.
- **Priority**: Critical vulnerabilities
- **Process**: Test → Deploy → Verify

**MNT-007**: The system shall update dependencies monthly.
- **Scope**: npm packages, framework versions
- **Process**: Review → Test → Update

### 14.3 Support

**MNT-008**: The system shall provide user support channels.
- **Channels**: Email, in-app help, documentation
- **Response Time**: 24 hours for non-critical issues


**MNT-009**: The system shall maintain issue tracking.
- **Tool**: GitHub Issues
- **Categories**: Bug, feature request, question

**MNT-010**: The system shall provide release notes.
- **Content**: New features, bug fixes, breaking changes
- **Format**: CHANGELOG.md

---

## 15. Future Enhancements

### 15.1 Phase 2 (Q2 2026)

1. **Mobile Apps**: Native iOS and Android apps using React Native
2. **Real-time Notifications**: WebSocket-based push notifications
3. **Video Conferencing**: Integration with Zoom/Google Meet
4. **Advanced Analytics**: Predictive analytics, ML-based insights
5. **Parent Portal**: Dedicated portal for parents to track children

### 15.2 Phase 3 (Q3 2026)

1. **AI Learning Paths**: Personalized learning recommendations
2. **Automated Grading**: AI-powered essay and assignment grading
3. **Plagiarism Detection**: Content originality checking
4. **Virtual Classrooms**: Live streaming and interactive sessions
5. **Gamification**: Points, badges, leaderboards

### 15.3 Phase 4 (Q4 2026)

1. **Multi-language Support**: Internationalization (i18n)
2. **Blockchain Certificates**: Verifiable digital certificates
3. **AR/VR Modules**: Immersive learning experiences
4. **Integration Marketplace**: Third-party app integrations
5. **Advanced Reporting**: Custom report builder

---

## 16. Risks and Mitigation

### 16.1 Technical Risks


**Risk 1**: Vercel free tier limitations
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: Upgrade to Pro plan, optimize bundle size, use CDN

**Risk 2**: Database performance degradation
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: Proper indexing, query optimization, caching layer

**Risk 3**: Third-party API failures (Cohere, Bunny.net)
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: Graceful degradation, fallback mechanisms, error handling

**Risk 4**: Browser storage limitations
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Quota management, user notifications, LRU eviction

### 16.2 Security Risks

**Risk 5**: Data breach or unauthorized access
- **Impact**: Critical
- **Probability**: Low
- **Mitigation**: Multi-layer security, encryption, regular audits, penetration testing

**Risk 6**: Cross-school data leakage
- **Impact**: Critical
- **Probability**: Low
- **Mitigation**: Strict schoolId filtering, automated tests, code reviews

**Risk 7**: DDoS attacks
- **Impact**: High
- **Probability**: Low
- **Mitigation**: Rate limiting, Vercel DDoS protection, monitoring

### 16.3 Business Risks

**Risk 8**: Low user adoption
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: User-friendly design, onboarding, training, support


**Risk 9**: Competition from established platforms
- **Impact**: High
- **Probability**: High
- **Mitigation**: Unique features (AI, offline), competitive pricing, superior UX

**Risk 10**: Regulatory compliance issues
- **Impact**: High
- **Probability**: Low
- **Mitigation**: Legal consultation, compliance audits, privacy policies

### 16.4 Operational Risks

**Risk 11**: Insufficient support resources
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Comprehensive documentation, self-service help, community forum

**Risk 12**: Scalability challenges
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: Horizontal scaling, performance monitoring, capacity planning

---

## 17. Glossary

**Academic Year**: The period of time schools use for scheduling classes (e.g., 2025-2026)

**Attendance**: Record of student presence in class (Present, Absent, Late)

**Bcrypt**: Password hashing algorithm for secure storage

**CDN**: Content Delivery Network for fast global content delivery

**Class**: A group of students in the same grade and section (e.g., 10th Grade - Section A)

**Cohere AI**: AI platform providing language models for chatbot

**Grade**: Letter grade (A+, A, B, C, D, F) calculated from percentage

**IndexedDB**: Browser database for offline data storage

**JWT**: JSON Web Token for authentication

**Marks**: Numerical scores on exams and assignments


**Multi-tenancy**: Architecture supporting multiple schools on single platform

**Offline-first**: Design approach prioritizing offline functionality

**Principal**: School administrator role

**PWA**: Progressive Web App with offline capabilities

**RBAC**: Role-Based Access Control for permissions

**Roll Number**: Unique student identifier within a class

**School Code**: Unique identifier for each school (e.g., "GVHS2025")

**Section**: Subdivision of a class (A, B, C, etc.)

**Service Worker**: Browser script enabling offline functionality

**Super Admin**: Platform-wide administrator role

**Teacher**: Educator role managing classes and students

**Tenant**: Individual school in multi-tenant system

---

## 18. Appendices

### Appendix A: User Stories

**US-001**: As a teacher, I want to mark attendance quickly so that I can save time.
- **Acceptance**: Mark 50 students in < 30 seconds

**US-002**: As a student, I want to view my marks so that I can track my progress.
- **Acceptance**: View all marks with grades and percentages

**US-003**: As a principal, I want to assign teachers to classes so that I can manage my school.
- **Acceptance**: Assign multiple teachers to multiple classes

**US-004**: As a super admin, I want to approve schools so that I can control platform access.
- **Acceptance**: Review and approve/reject school registrations

**US-005**: As a student, I want to watch videos offline so that I can learn without internet.
- **Acceptance**: Download and play videos offline


**US-006**: As a teacher, I want AI help for lesson planning so that I can create better content.
- **Acceptance**: Get relevant educational suggestions from chatbot

**US-007**: As a student, I want to ask homework questions so that I can learn independently.
- **Acceptance**: Get accurate answers from AI chatbot

**US-008**: As a principal, I want to view school analytics so that I can make informed decisions.
- **Acceptance**: View comprehensive school performance dashboard

### Appendix B: Use Cases

**UC-001: Mark Attendance**
- **Actor**: Teacher
- **Precondition**: Teacher is logged in, has assigned classes
- **Main Flow**:
  1. Teacher selects class and date
  2. System displays student list
  3. Teacher marks each student (P/A/L)
  4. Teacher clicks Save
  5. System saves attendance records
- **Postcondition**: Attendance is recorded and visible to students

**UC-002: Enter Marks**
- **Actor**: Teacher
- **Precondition**: Teacher is logged in, exam is created
- **Main Flow**:
  1. Teacher selects exam and subject
  2. System displays student list
  3. Teacher enters marks for each student
  4. System auto-calculates grades
  5. Teacher clicks Save
  6. System saves mark records
- **Postcondition**: Marks are recorded and visible to students

**UC-003: Upload Video**
- **Actor**: Teacher
- **Precondition**: Teacher is logged in, course exists
- **Main Flow**:
  1. Teacher selects course and lesson
  2. Teacher clicks Upload Video
  3. Teacher selects video file
  4. System checks file size
  5a. If < 4MB: Upload via server to CDN
  5b. If ≥ 4MB: Direct upload to CDN
  6. System shows progress
  7. System saves video URL
- **Postcondition**: Video is available for students


**UC-004: Download Video for Offline**
- **Actor**: Student
- **Precondition**: Student is logged in, enrolled in course
- **Main Flow**:
  1. Student browses course videos
  2. Student clicks Download
  3. System checks browser storage quota
  4. System downloads video to IndexedDB
  5. System shows download progress
  6. System marks video as available offline
- **Postcondition**: Video is playable offline

**UC-005: Approve School Registration**
- **Actor**: Super Admin
- **Precondition**: Super Admin is logged in, school is pending
- **Main Flow**:
  1. Super Admin views pending schools
  2. Super Admin reviews school details
  3. Super Admin clicks Approve/Reject
  4. System updates school status
  5. System notifies principal
- **Postcondition**: School is approved and principal can login

### Appendix C: Data Dictionary

**User Table**:
- `_id`: ObjectId, Primary Key
- `name`: String, User's full name
- `email`: String, Unique, User's email address
- `password`: String, Bcrypt hashed password
- `role`: Enum, User role (super-admin, principal, teacher, student)
- `schoolId`: ObjectId, Foreign Key to School
- `classId`: ObjectId, Foreign Key to Class (students only)
- `rollNo`: Number, Student roll number (students only)
- `parentName`: String, Parent's name (students only)
- `parentPhone`: String, Parent's phone (students only)
- `phone`: String, User's phone number
- `bio`: String, User biography
- `avatar`: String, Profile picture URL
- `isActive`: Boolean, Account status
- `createdAt`: Date, Account creation timestamp
- `updatedAt`: Date, Last update timestamp


**School Table**:
- `_id`: ObjectId, Primary Key
- `name`: String, School name
- `code`: String, Unique, School code (e.g., "GVHS2025")
- `email`: String, School email
- `phone`: String, School phone
- `address`: Object, School address (street, city, state, country, zipCode)
- `principal`: Object, Principal details (name, email, phone)
- `logo`: String, School logo URL
- `website`: String, School website URL
- `established`: Date, Establishment date
- `type`: Enum, School type (primary, secondary, higher-secondary)
- `board`: String, Education board (CBSE, ICSE, etc.)
- `isActive`: Boolean, School status
- `approvalStatus`: Enum, Approval status (pending, approved, rejected)
- `createdAt`: Date, Registration timestamp

**Attendance Table**:
- `_id`: ObjectId, Primary Key
- `studentId`: ObjectId, Foreign Key to User
- `schoolId`: ObjectId, Foreign Key to School
- `classId`: ObjectId, Foreign Key to Class
- `date`: Date, Attendance date
- `status`: Enum, Attendance status (Present, Absent, Late)
- `markedBy`: ObjectId, Foreign Key to User (teacher)
- `notes`: String, Optional notes
- `createdAt`: Date, Record creation timestamp

**Mark Table**:
- `_id`: ObjectId, Primary Key
- `studentId`: ObjectId, Foreign Key to User
- `schoolId`: ObjectId, Foreign Key to School
- `examId`: ObjectId, Foreign Key to Exam
- `subjectId`: ObjectId, Foreign Key to Subject
- `marksScored`: Number, Marks obtained
- `totalMarks`: Number, Maximum marks
- `percentage`: Number, Calculated percentage
- `grade`: String, Calculated grade (A+, A, B, C, D, F)
- `remarks`: String, Teacher remarks
- `markedBy`: ObjectId, Foreign Key to User (teacher)
- `createdAt`: Date, Record creation timestamp


### Appendix D: API Request/Response Examples

**POST /api/auth/login**

Request:
```json
{
  "email": "teacher@school.edu",
  "password": "password123",
  "schoolCode": "GVHS2025"
}
```

Response (Success):
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "teacher@school.edu",
    "role": "teacher",
    "schoolId": "507f1f77bcf86cd799439012"
  }
}
```

**POST /api/teacher/attendance**

Request:
```json
{
  "classId": "507f1f77bcf86cd799439013",
  "date": "2026-02-14",
  "records": [
    {
      "studentId": "507f1f77bcf86cd799439014",
      "status": "Present"
    },
    {
      "studentId": "507f1f77bcf86cd799439015",
      "status": "Absent"
    }
  ]
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Attendance marked for 2 students",
  "count": 2
}
```

**GET /api/student/marks**

Response (Success):
```json
{
  "success": true,
  "marks": [
    {
      "examName": "Mid-Term Exam",
      "subject": "Mathematics",
      "marksScored": 85,
      "totalMarks": 100,
      "percentage": 85,
      "grade": "A",
      "date": "2026-02-10"
    }
  ]
}
```


### Appendix E: Screen Mockups Reference

The following screens are implemented in the system:

1. **Landing Page** (`/`)
   - Hero section with platform overview
   - Feature highlights
   - Demo credentials
   - "Take a Tour" button

2. **Login Page** (`/login`)
   - Email and password fields
   - School code field
   - Login button
   - Link to signup

3. **Super Admin Dashboard** (`/admin/dashboard`)
   - Platform statistics
   - Pending school approvals
   - User management
   - System analytics

4. **Principal Dashboard** (`/principal/dashboard`)
   - School statistics
   - Teacher and student counts
   - Class overview
   - Quick actions

5. **Teacher Dashboard** (`/teacher/dashboard`)
   - Class list
   - Recent activity
   - Quick attendance
   - Quick marks entry

6. **Student Dashboard** (`/student/dashboard`)
   - Enrolled courses
   - Recent marks
   - Attendance summary
   - AI chatbot access

7. **Attendance Page** (`/teacher/attendance`)
   - Class selector
   - Date picker
   - Student list with P/A/L buttons
   - Bulk save

8. **Marks Entry Page** (`/teacher/marks`)
   - Exam selector
   - Subject selector
   - Student list with marks input
   - Auto-grade display

9. **Course Page** (`/teacher/courses`)
   - Course list
   - Create course button
   - Video upload interface
   - Lesson management


10. **Analytics Page** (`/teacher/analytics`, `/student/analytics`)
    - Performance charts
    - Attendance trends
    - Subject-wise analysis
    - Comparative statistics

---

## 19. Approval and Sign-off

### 19.1 Document Review

This requirements document has been reviewed and approved by:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | [Name] | _________ | ______ |
| Lead Developer | [Name] | _________ | ______ |
| QA Lead | [Name] | _________ | ______ |
| Stakeholder | [Name] | _________ | ______ |

### 19.2 Change Control

All changes to this requirements document must be:
1. Documented in change log
2. Reviewed by project team
3. Approved by project manager
4. Communicated to all stakeholders

### 19.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-14 | EduBridge Team | Initial requirements specification |

---

## 20. References

1. **Next.js Documentation**: https://nextjs.org/docs
2. **MongoDB Documentation**: https://docs.mongodb.com/
3. **Cohere AI Documentation**: https://docs.cohere.ai/
4. **Bunny.net Documentation**: https://docs.bunny.net/
5. **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
6. **GDPR Compliance**: https://gdpr.eu/
7. **FERPA Guidelines**: https://www2.ed.gov/policy/gen/guid/fpco/ferpa/


8. **PWA Best Practices**: https://web.dev/progressive-web-apps/
9. **JWT Best Practices**: https://tools.ietf.org/html/rfc7519
10. **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## 21. Contact Information

For questions or clarifications regarding this requirements document, please contact:

**Project Team**:
- **Email**: 2004sharath@gmail.com
- **GitHub**: https://github.com/sharath2004-tech/edu-bridge-ai-platform
- **Issues**: https://github.com/sharath2004-tech/edu-bridge-ai-platform/issues

**Support**:
- **Documentation**: See README.md
- **Technical Support**: Create GitHub issue
- **Feature Requests**: Create GitHub issue with "enhancement" label

---

**Document Status**: Active  
**Last Updated**: February 14, 2026  
**Next Review Date**: May 14, 2026  
**Document Owner**: EduBridge AI Development Team

---

## End of Requirements Specification Document
