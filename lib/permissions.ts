/**
 * Role-Based Access Control (RBAC) System
 * 
 * Role Hierarchy:
 * 1. Super Admin - Platform owner, manages all schools
 * 2. Principal - School-level admin, manages their school
 * 3. Teacher - Manages assigned classes and subjects
 * 4. Student - View-only access to their own data
 */

export type UserRole = 'super-admin' | 'principal' | 'teacher' | 'student';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope?: 'all' | 'school' | 'own' | 'assigned';
}

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  'super-admin': [
    // Full platform access
    { resource: 'schools', action: 'manage', scope: 'all' },
    { resource: 'users', action: 'manage', scope: 'all' },
    { resource: 'principals', action: 'create', scope: 'all' },
    { resource: 'principals', action: 'manage', scope: 'all' },
    { resource: 'billing', action: 'manage', scope: 'all' },
    { resource: 'analytics', action: 'read', scope: 'all' },
    { resource: 'reports', action: 'read', scope: 'all' },
    { resource: 'school-registrations', action: 'manage', scope: 'all' },
  ],
  
  'principal': [
    // School-level management
    { resource: 'school', action: 'read', scope: 'own' },
    { resource: 'school', action: 'update', scope: 'own' },
    { resource: 'teachers', action: 'create', scope: 'school' },
    { resource: 'teachers', action: 'manage', scope: 'school' },
    { resource: 'students', action: 'create', scope: 'school' },
    { resource: 'students', action: 'manage', scope: 'school' },
    { resource: 'classes', action: 'manage', scope: 'school' },
    { resource: 'subjects', action: 'manage', scope: 'school' },
    { resource: 'attendance', action: 'read', scope: 'school' },
    { resource: 'marks', action: 'read', scope: 'school' },
    { resource: 'reports', action: 'read', scope: 'school' },
    { resource: 'stats', action: 'read', scope: 'school' },
    { resource: 'analytics', action: 'read', scope: 'school' },
    { resource: 'timetable', action: 'manage', scope: 'school' },
    { resource: 'courses', action: 'manage', scope: 'school' },
  ],
  
  'teacher': [
    // Class and subject specific access
    { resource: 'school', action: 'read', scope: 'own' }, // Read-only school info
    { resource: 'students', action: 'read', scope: 'assigned' }, // Only their class students
    { resource: 'classes', action: 'read', scope: 'assigned' },
    { resource: 'subjects', action: 'read', scope: 'assigned' },
    { resource: 'homework', action: 'manage', scope: 'assigned' },
    { resource: 'attendance', action: 'create', scope: 'assigned' },
    { resource: 'attendance', action: 'read', scope: 'assigned' },
    { resource: 'marks', action: 'create', scope: 'assigned' },
    { resource: 'marks', action: 'update', scope: 'assigned' },
    { resource: 'marks', action: 'read', scope: 'assigned' },
    { resource: 'timetable', action: 'read', scope: 'assigned' },
    { resource: 'courses', action: 'read', scope: 'assigned' },
    { resource: 'quizzes', action: 'read', scope: 'assigned' }, // View quiz responses
  ],
  
  'student': [
    // Personal dashboard only
    { resource: 'profile', action: 'read', scope: 'own' },
    { resource: 'profile', action: 'update', scope: 'own' },
    { resource: 'class', action: 'read', scope: 'own' },
    { resource: 'subjects', action: 'read', scope: 'own' },
    { resource: 'teachers', action: 'read', scope: 'own' },
    { resource: 'homework', action: 'read', scope: 'own' },
    { resource: 'attendance', action: 'read', scope: 'own' },
    { resource: 'marks', action: 'read', scope: 'own' },
    { resource: 'timetable', action: 'read', scope: 'own' },
    { resource: 'courses', action: 'read', scope: 'own' },
    { resource: 'quizzes', action: 'read', scope: 'own' },
    { resource: 'quizzes', action: 'create', scope: 'own' }, // Submit quiz responses
    { resource: 'school', action: 'read', scope: 'own' }, // Basic school info only
  ],
};

/**
 * Check if a user has permission to perform an action
 */
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage',
  scope?: 'all' | 'school' | 'own' | 'assigned'
): boolean {
  const permissions = rolePermissions[userRole];
  
  return permissions.some(permission => {
    // Check if resource matches
    const resourceMatch = permission.resource === resource;
    
    // Check if action matches (manage includes all actions)
    const actionMatch = 
      permission.action === action || 
      permission.action === 'manage';
    
    // Check if scope matches (if scope is specified)
    const scopeMatch = !scope || permission.scope === scope || permission.scope === 'all';
    
    return resourceMatch && actionMatch && scopeMatch;
  });
}

/**
 * Check if user can access a school's data
 */
export function canAccessSchool(
  userRole: UserRole,
  userSchoolId: string | undefined,
  targetSchoolId: string
): boolean {
  // Super admin can access all schools
  if (userRole === 'super-admin') {
    return true;
  }
  
  // Others can only access their own school
  return userSchoolId === targetSchoolId;
}

/**
 * Check if user can access another user's data
 */
export function canAccessUser(
  userRole: UserRole,
  userId: string,
  targetUserId: string,
  userSchoolId: string | undefined,
  targetUserSchoolId: string | undefined,
  targetUserRole?: UserRole
): boolean {
  // Super admin can access all users
  if (userRole === 'super-admin') {
    return true;
  }
  
  // Users can always access their own data
  if (userId === targetUserId) {
    return true;
  }
  
  // Principal can access all users in their school
  if (userRole === 'principal' && userSchoolId === targetUserSchoolId) {
    return true;
  }
  
  // Teachers can access students in their school (will be further filtered by assigned classes)
  if (
    userRole === 'teacher' && 
    targetUserRole === 'student' && 
    userSchoolId === targetUserSchoolId
  ) {
    return true;
  }
  
  return false;
}

/**
 * Filter data based on user's role and scope
 */
export function getAccessibleSchoolIds(
  userRole: UserRole,
  userSchoolId: string | undefined
): string[] | 'all' {
  if (userRole === 'super-admin') {
    return 'all';
  }
  
  if (userSchoolId) {
    return [userSchoolId];
  }
  
  return [];
}

/**
 * Get user-friendly role names
 */
export const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Administrator',
  'principal': 'Principal / Head of School',
  'teacher': 'Teacher',
  'student': 'Student',
};

/**
 * Get role descriptions
 */
export const roleDescriptions: Record<UserRole, string> = {
  'super-admin': 'Platform owner with full access to all schools and features',
  'principal': 'School administrator with full control over their school',
  'teacher': 'Can manage assigned classes, subjects, and student data',
  'student': 'View-only access to personal academic information',
};

/**
 * Get dashboard route based on role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'super-admin':
      return '/admin/dashboard';
    case 'principal':
      return '/principal/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/';
  }
}

/**
 * Check if role can create users of target role
 */
export function canCreateRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  if (userRole === 'super-admin') {
    // Super admin can create principals and approve schools
    return ['principal', 'super-admin'].includes(targetRole);
  }
  
  if (userRole === 'principal') {
    // Principal can create teachers and students
    return ['teacher', 'student'].includes(targetRole);
  }
  
  return false;
}

/**
 * Middleware helper for API routes
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (userRole: UserRole) => {
    return allowedRoles.includes(userRole);
  };
}

/**
 * Check if user has elevated privileges
 */
export function isAdmin(role: UserRole): boolean {
  return ['super-admin', 'principal'].includes(role);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super-admin';
}

/**
 * Check if user is principal
 */
export function isPrincipal(role: UserRole): boolean {
  return role === 'principal';
}

/**
 * Check if user is teacher
 */
export function isTeacher(role: UserRole): boolean {
  return role === 'teacher';
}

/**
 * Check if user is student
 */
export function isStudent(role: UserRole): boolean {
  return role === 'student';
}
