import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  try {
    // Log da requisição
    console.log(`[Middleware] Verificando rota: ${pathname}`);
    
    // Extrair o ID do projeto do URL do Supabase para o nome do cookie
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectId = supabaseUrl ? supabaseUrl.split('.')[0].split('//')[1] : '';
    const cookieName = `sb-${projectId}-auth-token`;
    
    // Log de cookies existentes
    const cookies = Array.from(req.cookies.getAll());
    console.log('[Middleware] Todos os cookies:', 
      cookies.map(c => `${c.name}`).join(', '));
    
    // Verificar especificamente o cookie de autenticação
    const authCookie = req.cookies.get(cookieName);
    console.log(`[Middleware] Cookie de auth (${cookieName}):`, 
      authCookie ? 'Presente' : 'Ausente');
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = req.cookies.get(name);
            console.log(`[Middleware] Cookie get: ${name} => ${cookie ? 'existe' : 'não existe'}`);
            return cookie?.value;
          },
          set(name: string, value: string, options: { expires?: Date; maxAge?: number; domain?: string; path?: string; sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean }) {
            console.log(`[Middleware] Cookie set: ${name}`);
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
    
    // Primeiro, verificar se há uma sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('[Middleware] Erro ao verificar sessão:', sessionError.message);
    }
    
    // Em seguida, obter o usuário atual
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Middleware] Erro ao verificar usuário:', error.message);
    }
    
    console.log(
      '[Middleware] Status da sessão:',
      sessionData?.session ? 'Presente' : 'Ausente',
      '| Usuário:',
      user?.email ?? 'Não autenticado'
    );
    
    // Log de cookies após a verificação
    console.log('[Middleware] Cookies definidos na resposta:', 
      Array.from(res.cookies.getAll()).map(c => `${c.name}`).join(', '));

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