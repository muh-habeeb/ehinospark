import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth check for login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token (basic check - more detailed verification in API routes)
    try {
      // You could add JWT verification here, but we'll do it in API routes for better error handling
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};