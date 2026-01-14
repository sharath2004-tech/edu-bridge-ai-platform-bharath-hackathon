import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Role hierarchy for authorization
const ROLE_HIERARCHY: Record<string, number> = {
  'super-admin': 5,
  'admin': 4,
  'principal': 3,
  'teacher': 2,
  'student': 1,
}

// Route access requirements
const ROUTE_ACCESS: Record<string, { minRole: string; allowedRoles?: string[] }> = {
  '/super-admin': { minRole: 'super-admin', allowedRoles: ['super-admin'] },
  '/admin': { minRole: 'admin', allowedRoles: ['admin', 'super-admin'] },
  '/principal': { minRole: 'principal', allowedRoles: ['principal', 'admin', 'super-admin'] },
  '/teacher': { minRole: 'teacher', allowedRoles: ['teacher', 'principal', 'admin', 'super-admin'] },
  '/student': { minRole: 'student', allowedRoles: ['student', 'teacher', 'principal', 'admin', 'super-admin'] },
}

function hasAccess(userRole: string | undefined, routePrefix: string): boolean {
  if (!userRole) return false
  
  const access = ROUTE_ACCESS[routePrefix]
  if (!access) return true
  
  if (access.allowedRoles) {
    return access.allowedRoles.includes(userRole)
  }
  
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[access.minRole] || 0
  return userLevel >= requiredLevel
}

function parseSession(sessionCookie: string | undefined): { role?: string; id?: string } | null {
  if (!sessionCookie) return null
  try {
    return JSON.parse(sessionCookie)
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = req.cookies.get('edubridge_session')?.value
  const session = parseSession(sessionCookie)
  const role = session?.role

  // If the user hits / after logging in, redirect to their dashboard
  if (pathname === '/' && role) {
    const url = req.nextUrl.clone()
    // Map roles to their dashboard routes
    if (role === 'super-admin') {
      url.pathname = '/super-admin/dashboard'
    } else if (role === 'admin') {
      url.pathname = '/admin/dashboard'
    } else if (role === 'principal') {
      url.pathname = '/principal/dashboard'
    } else {
      url.pathname = `/${role}/dashboard`
    }
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users from protected routes
  const protectedPrefixes = ['/super-admin', '/admin', '/principal', '/teacher', '/student']
  for (const prefix of protectedPrefixes) {
    if (pathname.startsWith(prefix)) {
      if (!role) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }
      
      if (!hasAccess(role, prefix)) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(url)
      }
      break
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/super-admin/:path*', '/admin/:path*', '/principal/:path*', '/teacher/:path*', '/student/:path*'],
}
