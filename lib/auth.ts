import { cookies } from 'next/headers';

export type Session = { id: string; role: 'student'|'teacher'|'admin'; name: string; email: string }

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const c = cookieStore.get('edubridge_session')?.value
  if (!c) return null
  try {
    return JSON.parse(c)
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
