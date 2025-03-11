import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // List of public paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/reset-password-confirm'
  ];

  // Allow access to auth verification endpoints
  if (req.nextUrl.pathname.startsWith('/auth/callback') || 
      req.nextUrl.searchParams.has('token')) {
    return NextResponse.next();
  }

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  // If the user is not signed in and trying to access a protected route
  if (!session && !isPublicPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access auth pages
  if (session && isPublicPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};