import { cookies } from 'next/headers';

export type Session = { 
  id: string; 
  role: 'student' | 'teacher' | 'admin' | 'super-admin' | 'principal'; 
  name: string; 
  email: string;
  userId?: string;
  schoolId?: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const c = cookieStore.get('edubridge_session')?.value
  if (!c) return null
  try {
    const session = JSON.parse(c)
    // Ensure userId is set (some older code uses userId instead of id)
    if (session.id && !session.userId) {
      session.userId = session.id
    }
    return session
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
