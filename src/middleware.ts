import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuración de rate limiting básico
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  if (record.count >= limit) {
    return true
  }
  
  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Obtener IP del cliente
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // Headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HTTPS redirect en producción
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto')
    
    if (protocol !== 'https' && host) {
      return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}`, 301)
    }
  }
  
  // CORS headers para API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
