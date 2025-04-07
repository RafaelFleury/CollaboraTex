import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  try {
    // Log de cookies existentes
    console.log('[Middleware] Cookies existentes:', 
      Array.from(req.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = req.cookies.get(name);
            console.log(`[Middleware] Cookie get: ${name} => ${cookie ? 'existe' : 'não existe'}`);
            return cookie?.value;
          },
          set(name: string, value: string, options: { expires?: Date; maxAge?: number; domain?: string; path?: string; sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean }) {
            console.log(`[Middleware] Cookie set: ${name} = ${value.substring(0, 20)}...`);
            res.cookies.set({
              name,
              value,
              ...options,
              // Garantindo que estas opções estejam configuradas corretamente para desenvolvimento
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

    // Refresh session using getUser() - recomendado pela documentação
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Middleware] Erro ao verificar usuário:', error.message);
    }
    
    console.log('[Middleware] Verificando sessão para:', pathname, '| Email:', user?.email ?? 'Nenhuma sessão');
    
    // Log de cookies após a verificação
    console.log('[Middleware] Cookies após auth.getUser:', 
      Array.from(res.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, 20)}...`));

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/editor'];

    // Check if the route should be protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );

    // If accessing a protected route without being authenticated
    if (isProtectedRoute && !user) {
      console.log(`[Middleware] Acesso negado a ${pathname}. Redirecionando para login.`);
      
      // Redirect to login page
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If already logged in and trying to access auth pages
    if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      console.log(`[Middleware] Usuário logado em ${pathname}. Redirecionando para /dashboard.`);
      
      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    console.error('[Middleware] Erro:', error);
  }

  // Make sure to return the response with the session cookie
  return res;
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    // Rotas protegidas
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/editor',
    '/editor/:path*',
    // Rotas de autenticação
    '/auth/login',
    '/auth/register',
    '/auth/verification',
    '/auth/reset-password',
  ],
}; 