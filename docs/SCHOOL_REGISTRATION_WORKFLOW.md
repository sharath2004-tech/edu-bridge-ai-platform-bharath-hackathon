# School Registration & Activation Workflow

## Overview
This document explains the complete school registration process and how to activate registered schools.

---

## Registration Process

### Step 1: School Registration Form
- Navigate to: `/school-registration`
- Fill in three sections:
  1. **School Information**: Name, code, type, board, medium, logo
  2. **Address Details**: Address lines, district, state, pincode
  3. **Admin Details**: Principal/admin name, email, mobile, designation, password

### Step 2: Backend Processing
When the form is submitted to `/api/school-registration`:

1. **Validation Checks**:
   - All required fields present
   - School code is unique
   - Email not already registered
   - Password meets requirements

2. **School Creation**:
   ```typescript
   School.create({
     name: schoolName,
     code: schoolCode.toUpperCase(),
     email: adminEmail,
     isActive: false,  // 🔴 Set to false by default
     subscription: {
       plan: 'free',
       maxStudents: 100,
       maxTeachers: 10
     }
   })
   ```

3. **Principal Account Creation**:
   - Creates a User with `role: 'principal'`
   - Links to the newly created school
   - Password is hashed with bcrypt

4. **Response**:
   - Success message: "School registered successfully. Awaiting admin approval."
   - School starts with `isActive: false` status

---

## Why Schools Show as "Inactive"

### By Design
- **Security Measure**: Prevents unauthorized schools from accessing the platform
- **Quality Control**: Allows admin to verify school details before activation
- **Subscription Management**: Ensures proper subscription setup

### Status Explained
```typescript
isActive: false  // Newly registered schools
isActive: true   // Admin-approved schools
```

---

## How to Activate a School

### For Admins Only

#### Method 1: Through Admin Dashboard
1. Login as admin
2. Navigate to: `/admin/schools`
3. Find the school in the list
4. Click the toggle button to activate/deactivate

#### Method 2: Via API
```bash
PUT /api/admin/schools
Content-Type: application/json

{
  "schoolId": "school_id_here",
  "isActive": true
}
```

### Code Reference
File: [admin/schools/page.tsx](../app/admin/schools/page.tsx#L215-L230)
```typescript
const toggleSchoolStatus = async (school: School) => {
  const res = await fetch('/api/admin/schools', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolId: school._id,
      isActive: !school.isActive
    })
  })
  
  if (res.ok) {
    fetchSchools() // Refresh list
  }
}
```

---

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  1. SCHOOL REGISTRATION                                     │
│  /school-registration page                                  │
│  - Fill form with school & admin details                    │
│  - Submit registration                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. API PROCESSING                                          │
│  POST /api/school-registration                              │
│  ✓ Validate data                                            │
│  ✓ Create School (isActive: false)                          │
│  ✓ Create Principal user account                            │
│  ✓ Return success message                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. AWAITING APPROVAL                                       │
│  School Status: INACTIVE 🔴                                 │
│  - School appears in admin dashboard                        │
│  - Principal can login but limited access                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. ADMIN REVIEW                                            │
│  Admin Dashboard /admin/schools                             │
│  - Review school details                                    │
│  - Verify information                                       │
│  - Click toggle to activate                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. ACTIVATION                                              │
│  PUT /api/admin/schools                                     │
│  { schoolId, isActive: true }                               │
│  - Update school status                                     │
│  - Enable full access                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. ACTIVE SCHOOL ✅                                        │
│  School Status: ACTIVE 🟢                                   │
│  - Full platform access                                     │
│  - Can add teachers & students                              │
│  - Can create courses                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Access Levels by Status

### When `isActive: false` (Inactive)
- ✅ Principal can login
- ✅ View limited dashboard
- ❌ Cannot add teachers/students
- ❌ Cannot create courses
- ❌ Limited functionality

### When `isActive: true` (Active)
- ✅ Full access to all features
- ✅ Add/manage teachers
- ✅ Add/manage students
- ✅ Create/manage courses
- ✅ Access all sections

---

## Important API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/school-registration` | POST | Register new school | Public |
| `/api/admin/schools` | GET | List all schools | Admin |
| `/api/admin/schools` | PUT | Update school (activate/deactivate) | Admin |
| `/api/admin/schools?id={schoolId}` | GET | Get specific school details | Admin |
| `/api/admin/schools?id={schoolId}` | DELETE | Delete school | Admin |

---

## Database Schema

### School Model
```typescript
{
  name: string,
  code: string,        // Unique school code
  email: string,
  isActive: boolean,   // 🔑 Activation status
  subscription: {
    plan: 'free' | 'basic' | 'premium',
    maxStudents: number,
    maxTeachers: number
  },
  stats: {
    totalStudents: number,
    totalTeachers: number,
    totalCourses: number
  }
}
```

---

## Testing the Workflow

### 1. Register a School
```bash
# Navigate to school registration
Open: http://localhost:3000/school-registration

# Fill form and submit
# Note: School will be created with isActive: false
```

### 2. Verify Registration
```bash
# Login as admin
Open: http://localhost:3000/login
Email: admin@edubridge.com

# Check schools list
Open: http://localhost:3000/admin/schools
# You should see the new school with "Inactive" badge
```

### 3. Activate School
```bash
# In admin schools page
# Click the toggle/activate button next to the school
# Status should change to "Active"
```

### 4. Verify Activation
```bash
# Login as principal
Use the principal credentials created during registration

# Should now have full access to:
- /principal/dashboard
- /principal/teachers
- /principal/students
- All other principal features
```

---

## Troubleshooting

### Issue: School shows as inactive after registration
**Expected Behavior**: This is by design for security and quality control.

**Solution**: Admin must manually activate the school from `/admin/schools`

### Issue: Cannot toggle school status
**Possible Causes**:
1. Not logged in as admin
2. API endpoint not responding
3. Database connection issue

**Solution**:
```bash
# Check admin role
console.log(session.role) // Should be 'admin'

# Check API response
PUT /api/admin/schools
Body: { "schoolId": "...", "isActive": true }

# Check database
db.schools.find({ _id: ObjectId("...") })
```

### Issue: Principal cannot access features after activation
**Solution**:
1. Verify school `isActive: true` in database
2. Check principal's `schoolId` matches the school
3. Clear browser cache and re-login

---

## Summary

✅ **Registration**: Schools register via `/school-registration` and are created with `isActive: false`

✅ **Review**: Admins review schools in `/admin/schools` dashboard

✅ **Activation**: Admins toggle `isActive` to `true` to activate schools

✅ **Access**: Only active schools have full platform access

This workflow ensures quality control and security before granting full access to the platform.
