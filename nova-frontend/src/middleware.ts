import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login' || path === '/register';

  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register, redirect to home
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/home/:path*',
    '/profile/:path*',
  ],
}; 