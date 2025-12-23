import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/apply': ['USER', 'DSA'],
  '/payment': ['USER', 'DSA'],
  '/my-requests': ['USER'],
  '/profile': ['USER', 'DSA', 'EMPLOYEE'],
  '/dsa': ['DSA'],
  '/employee': ['EMPLOYEE'],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/', 
  '/services', 
  '/about', 
  '/contact', 
  '/terms', 
  '/privacy', 
  '/refund', 
  '/login', 
  '/register', 
  '/verify-email',
  '/dsa-register',  // DSA registration is public
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // IMPORTANT: Check public routes first with exact matching
  // This prevents /dsa-register from matching /dsa protected route
  const isPublicRoute = publicRoutes.some((route) => {
    // Exact match or starts with route + /
    return pathname === route || pathname.startsWith(`${route}/`);
  });
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  // Only match if it's not a public sub-route
  const protectedRoute = Object.keys(protectedRoutes).find((route) => {
    // For /dsa, don't match /dsa-register since it's public
    if (route === '/dsa' && pathname.startsWith('/dsa-register')) {
      return false;
    }
    return pathname.startsWith(route);
  });

  if (protectedRoute) {
    // Check for session cookie - using the same cookie name as backend
    const sessionCookie = request.cookies.get('dhanseva.sid');
    
    if (!sessionCookie) {
      // Redirect to login with return URL
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Note: Role-based access control will be handled at the page level
    // since we can't decode the session cookie in middleware
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
