import { cookies } from 'next/headers';

export type Session = { 
  id: string; 
  role: 'student' | 'teacher' | 'admin' | 'super-admin' | 'principal'; 
  name: string; 
  email: string;
  userId?: string;
  schoolId?: string;
}

// Session validation with additional security checks
function validateSession(data: unknown): Session | null {
  if (!data || typeof data !== 'object') return null
  
  const session = data as Record<string, unknown>
  
  // Required fields validation
  if (typeof session.id !== 'string' || !session.id) return null
  if (typeof session.role !== 'string' || !session.role) return null
  if (typeof session.name !== 'string') return null
  if (typeof session.email !== 'string') return null
  
  // Role validation
  const validRoles = ['student', 'teacher', 'admin', 'super-admin', 'principal']
  if (!validRoles.includes(session.role)) return null
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(session.email)) return null
  
  return {
    id: session.id,
    role: session.role as Session['role'],
    name: session.name,
    email: session.email,
    userId: typeof session.userId === 'string' ? session.userId : session.id,
    schoolId: typeof session.schoolId === 'string' ? session.schoolId : undefined,
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const c = cookieStore.get('edubridge_session')?.value
  if (!c) return null
  
  try {
    const parsed = JSON.parse(c)
    return validateSession(parsed)
  } catch {
    return null
  }
}

export async function requireRole(role: Session['role']): Promise<Session | null> {
  const s = await getSession()
  if (!s || s.role !== role) {
    return null
  }
  return s
}

// Check if user has at least the specified role level
export async function requireMinRole(minRole: Session['role']): Promise<Session | null> {
  const ROLE_HIERARCHY: Record<string, number> = {
    'super-admin': 4,
    'admin': 4,
    'principal': 3,
    'teacher': 2,
    'student': 1,
  }
  
  const s = await getSession()
  if (!s) return null
  
  const userLevel = ROLE_HIERARCHY[s.role] || 0
  const requiredLevel = ROLE_HIERARCHY[minRole] || 0
  
  return userLevel >= requiredLevel ? s : null
}

// Get session with safe defaults for client-side use
export function getSessionFromCookie(cookieValue: string | undefined): Session | null {
  if (!cookieValue) return null
  
  try {
    const parsed = JSON.parse(cookieValue)
    return validateSession(parsed)
  } catch {
    return null
  }
}
