import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ssm-humane-society-secret-key-2026'
);

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/admin'];
// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];
// Public routes that should redirect if already logged in
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Check if route needs protection
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isAdminApi = pathname.startsWith('/api/') && (
    pathname.startsWith('/api/seed') ||
    pathname.startsWith('/api/activity') ||
    pathname.startsWith('/api/users') ||
    pathname.startsWith('/api/messages') ||
    (pathname.startsWith('/api/settings') && request.method === 'PUT')
  );

  // Verify token if present
  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch {
      // Token invalid/expired — clear it
      if (isProtected || isAdminApi) {
        const response = isAdminApi 
          ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
          : NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
    }
  }

  // Protect authenticated routes
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes — require admin or staff role
  if (isAdminRoute && user && !['admin', 'staff'].includes(user.role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect admin API routes
  if (isAdminApi && (!user || !['admin', 'staff'].includes(user.role))) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to headers for downstream use
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.id || '');
    response.headers.set('x-user-role', user.role || 'adopter');
    response.headers.set('x-user-email', user.email || '');
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/api/seed/:path*',
    '/api/activity/:path*',
    '/api/users/:path*',
    '/api/messages/:path*',
    '/api/settings/:path*',
  ],
};
