import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // "/" is ALWAYS public - never redirect for any reason
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Auth pages are public
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // For all other routes, check for auth token
  const token = request.cookies.get('yard_sync_token');

  // Redirect to login if no token on protected routes
  if (!token && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
