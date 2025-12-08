import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Read session cookie if exists
  const sessionCookie = req.cookies.get('edubridge_session')?.value
  let role: string | undefined
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie)
      role = parsed?.role
    } catch {}
  }

  // If the user hits / after logging in, send them to their dashboard
  if (pathname === '/' && role) {
    const url = req.nextUrl.clone()
    // Map roles to their dashboard routes
    if (role === 'super-admin') {
      url.pathname = '/admin/dashboard'
    } else if (role === 'principal') {
      url.pathname = '/principal/dashboard'
    } else {
      url.pathname = `/${role}/dashboard`
    }
    return NextResponse.redirect(url)
  }

  // Protect role-specific routes
  if (pathname.startsWith('/admin') && role !== 'super-admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/principal') && role !== 'principal' && role !== 'super-admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/teacher') && role !== 'teacher' && role !== 'principal' && role !== 'super-admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/student') && role !== 'student') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*', '/principal/:path*', '/teacher/:path*', '/student/:path*'],
}
