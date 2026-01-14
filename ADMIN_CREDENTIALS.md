# 🔐 ADMIN & SUPER ADMIN LOGIN CREDENTIALS

## ✅ THREE ADMINISTRATOR LEVELS

### 1. Super Admin (Highest Level)
```
Email: superadmin@edubridge.com
Password: superadmin123
Role: super-admin
Dashboard: /super-admin/dashboard
```
**Access:** Full platform control, manages everything

### 2. Admin (School Management Level) ✨ NEW
```
Email: admin@edubridge.com
Password: admin123
Role: admin
Dashboard: /admin/dashboard
```
**Access:** Manages all schools, activates schools, views analytics

### 3. Principal (School Level)
```
Created during school registration
Dashboard: /principal/dashboard
```
**Access:** Manages only their assigned school

---

## 🎯 Role Hierarchy

```
Level 5: SUPER ADMIN     (superadmin@edubridge.com)
         └─ Full platform control
         └─ Can do everything

Level 4: ADMIN           (admin@edubridge.com)
         └─ School management
         └─ Activate/deactivate schools
         └─ View platform analytics

Level 3: PRINCIPAL       (created during registration)
         └─ School management
         └─ Create teachers & students

Level 2: TEACHER         (created by principal)
         └─ Course management
         └─ Attendance & grading

Level 1: STUDENT         (created by principal)
         └─ View courses
         └─ Submit work
```

---

## 🎯 System Roles (Only 4 Roles Exist)

1. **`super-admin`** → Full platform access (`/admin/*` routes)
2. **`principal`** → School administrator (`/principal/*` routes)
3. **`teacher`** → Teacher (`/teacher/*` routes)
4. **`student`** → Student (`/student/*` routes)

---

## 🏫 Workflow Explained

### When School Registers:
1. School submits form at `/school-registration`
2. **Only PRINCIPAL account is created** (NOT admin!)
3. School is set to `isActive: false` (inactive)
4. Waits for super admin approval

### Super Admin's Job:
1. Login as: `superadmin@edubridge.com` / `superadmin123`
2. Go to: `/admin/schools`
3. Click **"Activate"** button for registered schools
4. That's it! Super admin doesn't create students/teachers

### Principal's Job (After Activation):
1. Principal logs in with credentials from registration
2. Go to: `/principal/teachers` → Create teachers
3. Go to: `/principal/students` → Create students
4. Go to: `/principal/classes` → Create classes

---

## 👥 Who Creates What?

| Role | Creates |
|------|---------|
| **Super Admin** | Nothing (only activates schools) |
| **Principal** | ✅ Teachers, ✅ Students, ✅ Classes |
| **Teacher** | ✅ Courses, ✅ Content |
| **Student** | Nothing |

---

## 🚀 Quick Start

### 1. First Time Setup (Create Super Admin):
```bash
# Go to: http://localhost:3000/seed
# Click "Seed Database"
```

### 2. Login as Super Admin:
```
URL: http://localhost:3000/login
Email: superadmin@edubridge.com
Password: superadmin123
```

### 3. Register a School:
```
URL: http://localhost:3000/school-registration
Fill form → Create principal account
```

### 4. Activate School (as Super Admin):
```
URL: http://localhost:3000/admin/schools
Click "Activate" button
```

### 5. Login as Principal:
```
Use credentials you created during school registration
URL: http://localhost:3000/login
```

### 6. Create Users (as Principal):
```
Teachers: /principal/teachers → Click "Add Teacher"
Students: /principal/students → Click "Add Student"
```

---

## ❓ Common Questions

**Q: Why can't I login as admin@edubridge.com?**
A: Because "admin" role doesn't exist! Use "superadmin@edubridge.com"

**Q: Where does super admin create teachers?**
A: Super admin doesn't! Principal creates teachers at `/principal/teachers`

**Q: Who creates students?**
A: Principal creates students at `/principal/students`

**Q: What if school registration doesn't work?**
A: Make sure super admin activates the school at `/admin/schools`

---

## 📊 Role Hierarchy

```
┌──────────────────────┐
│   SUPER ADMIN        │  ← superadmin@edubridge.com
│   (Platform Level)   │  ← Manages ALL schools
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    │   Schools   │
    └──────┬──────┘
           │
┌──────────┴───────────┐
│   PRINCIPAL          │  ← Created during school registration
│   (School Level)     │  ← Creates teachers & students
└──────────┬───────────┘
           │
      ┌────┴────┐
      │         │
┌─────▼────┐ ┌─▼────────┐
│ TEACHER  │ │ STUDENT  │
└──────────┘ └──────────┘
```

---

**TL;DR:**
- ✅ Login: `superadmin@edubridge.com` / `superadmin123`
- ✅ Super admin activates schools
- ✅ Principal creates teachers & students
- ❌ No "admin" role exists!
