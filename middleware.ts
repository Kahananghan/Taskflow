import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Rate limiting for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Simple rate limiting check (in production, use Redis/database)
    const rateLimitKey = `rate_limit_${ip}`
    
    // Add CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/blog/:path*'
  ]
}