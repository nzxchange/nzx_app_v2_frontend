import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if this is a password reset request
  const requestUrl = new URL(req.url);
  if (requestUrl.pathname === '/auth/callback' && requestUrl.hash.includes('type=recovery')) {
    // Redirect recovery attempts to reset-password-confirm
    return NextResponse.redirect(
      new URL('/auth/reset-password-confirm' + requestUrl.hash, req.url)
    );
  }

  return res;
}

export const config = {
  matcher: ['/auth/callback', '/auth/reset-password-confirm']
}; 