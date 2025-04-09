import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  try {
    // Log the request
    console.log(`[Middleware] Checking route: ${pathname}`);
    
    // Extract project ID from Supabase URL for cookie name
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectId = supabaseUrl ? supabaseUrl.split('.')[0].split('//')[1] : '';
    const cookieName = `sb-${projectId}-auth-token`;
    
    // Log existing cookies
    const cookies = Array.from(req.cookies.getAll());
    console.log('[Middleware] All cookies:', 
      cookies.map(c => `${c.name}`).join(', '));
    
    // Specifically check the authentication cookie
    const authCookie = req.cookies.get(cookieName);
    console.log(`[Middleware] Auth cookie (${cookieName}):`, 
      authCookie ? 'Present' : 'Absent');
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = req.cookies.get(name);
            console.log(`[Middleware] Cookie get: ${name} => ${cookie ? 'exists' : 'does not exist'}`);
            return cookie?.value;
          },
          set(name: string, value: string, options: { expires?: Date; maxAge?: number; domain?: string; path?: string; sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean }) {
            console.log(`[Middleware] Cookie set: ${name}`);
            res.cookies.set({
              name,
              value,
              ...options,
              // Ensuring these options are properly configured for development
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            });
          },
          remove(name: string, options: { domain?: string; path?: string }) {
            console.log(`[Middleware] Cookie remove: ${name}`);
            res.cookies.delete(name);
          },
        },
      }
    );
    
    // First, check if there's a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('[Middleware] Error checking session:', sessionError.message);
    }
    
    // Then, get the current user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Middleware] Error checking user:', error.message);
    }
    
    console.log(
      '[Middleware] Session status:',
      sessionData?.session ? 'Present' : 'Absent',
      '| User:',
      user?.email ?? 'Not authenticated'
    );
    
    // Log cookies after verification
    console.log('[Middleware] Cookies set in response:', 
      Array.from(res.cookies.getAll()).map(c => `${c.name}`).join(', '));

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/editor'];
    
    // Routes that should skip authentication even if they start with a protected path
    const publicExceptions = ['/editor/anon'];
    
    // Check if the current path is in our public exceptions list
    const isPublicException = publicExceptions.some(route => 
      pathname.startsWith(route)
    );
    
    // If it's a public exception, allow access without auth
    if (isPublicException) {
      console.log(`[Middleware] Path ${pathname} is a public exception, allowing access`);
      return res;
    }

    // Check if the route should be protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );

    // If accessing a protected route without being authenticated
    if (isProtectedRoute && !user) {
      console.log(`[Middleware] Access denied to ${pathname}. Redirecting to login.`);
      
      // Redirect to login page
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If already logged in and trying to access auth pages
    if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      console.log(`[Middleware] User logged in at ${pathname}. Redirecting to /dashboard.`);
      
      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    console.error('[Middleware] Error:', error);
  }

  // Make sure to return the response with the session cookie
  return res;
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    // Protected routes
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/editor',
    '/editor/:path*',
    // Authentication routes
    '/auth/login',
    '/auth/register',
    '/auth/verification',
    '/auth/reset-password',
  ],
}; 