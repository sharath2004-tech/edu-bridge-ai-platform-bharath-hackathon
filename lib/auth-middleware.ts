import { NextRequest, NextResponse } from 'next/server';
import { UserRole, canAccessSchool, hasPermission } from './permissions';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  schoolId?: string;
}

/**
 * Get authenticated user from request cookies
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const cookie = request.cookies.get('edubridge_session');
    if (!cookie?.value) {
      return null;
    }
    
    const session = JSON.parse(cookie.value);
    return {
      id: session.id,
      role: session.role as UserRole,
      name: session.name,
      email: session.email,
      schoolId: session.schoolId,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication - returns 401 if not authenticated
 */
export function requireAuth(request: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(request);
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return user;
}

/**
 * Require specific role(s) - returns 403 if not authorized
 */
export function requireRoles(
  user: AuthUser,
  allowedRoles: UserRole[]
): true | NextResponse {
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      },
      { status: 403 }
    );
  }
  
  return true;
}

/**
 * Require permission for a resource and action
 */
export function requirePermission(
  user: AuthUser,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage',
  scope?: 'all' | 'school' | 'own' | 'assigned'
): true | NextResponse {
  if (!hasPermission(user.role, resource, action, scope)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Insufficient permissions',
        message: `You don't have permission to ${action} ${resource}`
      },
      { status: 403 }
    );
  }
  
  return true;
}

/**
 * Require school access - returns 403 if user can't access the school
 */
export function requireSchoolAccess(
  user: AuthUser,
  targetSchoolId: string
): true | NextResponse {
  if (!canAccessSchool(user.role, user.schoolId, targetSchoolId)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Access denied',
        message: 'You do not have access to this school'
      },
      { status: 403 }
    );
  }
  
  return true;
}

/**
 * Require same school - ensures user and target are in same school
 */
export function requireSameSchool(
  user: AuthUser,
  targetSchoolId: string | undefined
): true | NextResponse {
  // Super admin can access all schools
  if (user.role === 'super-admin') {
    return true;
  }
  
  if (!user.schoolId || !targetSchoolId) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'School information missing',
      },
      { status: 400 }
    );
  }
  
  if (user.schoolId !== targetSchoolId) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Access denied',
        message: 'You can only access users in your school'
      },
      { status: 403 }
    );
  }
  
  return true;
}

/**
 * Helper to handle auth checks in API routes
 * Returns user if all checks pass, otherwise returns NextResponse error
 */
export function authenticateAndAuthorize(
  request: NextRequest,
  options: {
    requiredRoles?: UserRole[];
    resource?: string;
    action?: 'create' | 'read' | 'update' | 'delete' | 'manage';
    scope?: 'all' | 'school' | 'own' | 'assigned';
  } = {}
): AuthUser | NextResponse {
  // Check authentication
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  const user = authResult;
  
  // Check role if specified
  if (options.requiredRoles) {
    const roleCheck = requireRoles(user, options.requiredRoles);
    if (roleCheck instanceof NextResponse) {
      return roleCheck;
    }
  }
  
  // Check permission if specified
  if (options.resource && options.action) {
    const permCheck = requirePermission(
      user,
      options.resource,
      options.action,
      options.scope
    );
    if (permCheck instanceof NextResponse) {
      return permCheck;
    }
  }
  
  return user;
}
