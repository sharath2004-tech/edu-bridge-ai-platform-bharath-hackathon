# Authentication & School Approval System Fixes

## Issues Fixed

### 1. **Security Issue: Open Role Selection** ❌ → ✅
**Problem:** Anyone could register as Teacher, Principal, or even Admin through the signup page.

**Solution:** 
- **Students only** can self-register through the signup page
- Teachers and Principals **must be created by school administrators**
- Role selection removed from signup form
- Backend validation enforces student-only registration

**Files Modified:**
- `app/api/auth/signup/route.ts` - Added role validation
- `app/signup/page.tsx` - Removed role selector

---

### 2. **School Selection Vulnerability** ❌ → ✅
**Problem:** Users could select ANY school during signup, even inactive/unapproved ones.

**Solution:**
- Only **active (approved) schools** appear in signup dropdown
- Backend verifies school exists and is active before creating account
- School code verification only works for active schools

**Files Modified:**
- `app/api/auth/signup/route.ts` - Added school activation check
- `app/api/schools/route.ts` - Already filtered for active schools

---

### 3. **Missing School Approval Workflow** ❌ → ✅
**Problem:** Schools registered but had no way to be approved by super-admin.

**Solution:**
- New **Pending Schools** page for Super Admin
- Shows all schools waiting for approval (isActive: false)
- Super Admin can **Approve** or **Reject** schools
- Approved schools become active and visible to students
- Rejected schools are deleted from system

**New Files Created:**
- `app/api/admin/pending-schools/route.ts` - API to fetch pending schools
- `app/super-admin/pending-schools/page.tsx` - Approval UI

**Files Modified:**
- `app/super-admin/dashboard/page.tsx` - Added "Pending Approvals" card

---

## Complete Registration & Approval Flow

### For Schools:
1. **School Registration** (anyone can register)
   - Visit `/school-registration`
   - Fill in school details
   - Principal account is created (but school is **inactive**)
   - ✅ School appears in Super Admin's "Pending Approvals"

2. **Super Admin Approval**
   - Super Admin visits `/super-admin/pending-schools`
   - Reviews school details
   - Can **Approve** or **Reject**
   - Once approved, school becomes **active**

3. **School Becomes Active**
   - Principal can now log in
   - Students can see school in signup dropdown
   - Principal can add teachers and students

### For Students:
1. **Student Signup** (self-registration)
   - Visit `/signup`
   - Can only register as **Student**
   - Must select an **active school**
   - Account created and can immediately log in

### For Teachers & Principals:
- **Cannot self-register**
- Must be created by:
  - School administrators (Principal)
  - Platform administrators (Admin/Super-Admin)

---

## Security Improvements

### Role-Based Access Control (RBAC)

**Role Hierarchy:**
```
Super Admin (Level 5) 
  └─> Can manage all schools
      └─> Approve/reject school registrations
      
Admin (Level 4)
  └─> Can view all schools
  └─> Cannot approve schools (Super Admin only)

Principal (Level 3)
  └─> Manages their own school
  └─> Can add teachers and students
  
Teacher (Level 2)
  └─> Access to their classes
  └─> Cannot create other users

Student (Level 1)
  └─> Access to enrolled courses
  └─> Self-registration allowed
```

### Authentication Flow:
1. **Signup**: Only students, only active schools
2. **Login**: Email + password, role determined by database
3. **Session**: Role stored in cookie (cannot be changed client-side)
4. **Authorization**: All routes check role from session cookie

---

## API Endpoints

### New Endpoints:
- `GET /api/admin/pending-schools` - Fetch schools awaiting approval
  - **Auth Required:** Super Admin or Admin
  - **Returns:** List of inactive schools

### Modified Endpoints:
- `POST /api/auth/signup`
  - **Before:** Accepted any role
  - **After:** Only accepts students, validates active school
  
- `GET /api/schools`
  - **Before:** Returned all schools
  - **After:** Only returns active schools (for signup)

### Existing Endpoints (already secure):
- `PUT /api/super-admin/schools` - Approve/activate school
- `DELETE /api/super-admin/schools` - Reject/delete school

---

## Testing Checklist

### ✅ Student Registration
- [ ] Can only register as student (no role selection)
- [ ] Can only see active schools in dropdown
- [ ] Cannot select inactive schools
- [ ] Registration fails if school becomes inactive

### ✅ School Registration
- [ ] New school is created with `isActive: false`
- [ ] Principal account is created but cannot log in until approved
- [ ] School appears in pending approvals

### ✅ Super Admin Approval
- [ ] Can see all pending schools
- [ ] Can approve school → school becomes active
- [ ] Can reject school → school is deleted
- [ ] Approved schools appear in student signup

### ✅ Security
- [ ] Cannot bypass role check via API (try changing role in POST body)
- [ ] Cannot select inactive school (try using school ID directly)
- [ ] Principal cannot log in until school approved
- [ ] Teachers/Principals cannot self-register

---

## Environment Setup

No environment variable changes needed. All features use existing:
- `MONGODB_URI` - Database connection
- `SESSION_SECRET` - Cookie encryption

---

## Migration Notes

### Existing Data:
- All **existing schools** should have `isActive: true` set manually
- All **existing users** keep their current roles
- **No data loss** - only adds new approval workflow

### To Activate Existing Schools:
```javascript
// Run in MongoDB
db.schools.updateMany(
  { isActive: { $exists: false } },
  { $set: { isActive: true } }
)
```

---

## Future Enhancements

### Recommended Next Steps:
1. **Email Notifications**
   - Notify super-admin when school registers
   - Notify principal when school is approved/rejected

2. **School Admin Portal**
   - Let principals add teachers
   - Let principals add students (bulk import)

3. **Audit Log**
   - Track all approvals/rejections
   - Track user creation/deletion

4. **Multi-level Approval**
   - Admin reviews → Super Admin final approval
   - Regional admins for specific areas

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs (MongoDB connection, auth errors)
3. Verify environment variables are set
4. Ensure MongoDB is running and accessible

---

## Credentials Reference

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for:
- Super Admin login
- Admin login
- Test school details
- Role hierarchy

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Author:** EduBridge AI Development Team
