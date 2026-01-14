import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('edubridge_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse the session cookie
    const sessionData = JSON.parse(sessionCookie.value)
    
    return NextResponse.json({
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role,
      schoolId: sessionData.schoolId,
      mustChangePassword: sessionData.mustChangePassword || false
    })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
