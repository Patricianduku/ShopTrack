import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the user is authenticated
  const isAuth = !!session;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isRootPage = req.nextUrl.pathname === '/';

  // If user is on auth page but already authenticated, redirect to dashboard
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is accessing protected routes but not authenticated, redirect to sign in
  if (!isAuth && !isAuthPage && !isRootPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};