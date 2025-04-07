"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { AuthContext } from '@/components/auth/AuthProvider';

// Define tipos localmente para evitar problemas de namespace
type SupabaseUser = {
  id: string;
  email?: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  [key: string]: any;
};

type AuthChangeEventType = 
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

type SessionType = {
  user: SupabaseUser;
  access_token: string;
  refresh_token: string;
  [key: string]: any;
};

export function useAuth() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useContext(AuthContext);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('[useAuth signIn] Iniciando login com:', email);
      
      // Log dos cookies antes do login
      const cookiesBefore = document.cookie;
      console.log('[useAuth signIn] Cookies antes do login:', cookiesBefore);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth signIn] Erro de autenticação:', error.message);
        throw error;
      }

      // Log dos cookies após o login
      const cookiesAfter = document.cookie;
      console.log('[useAuth signIn] Cookies após o login:', cookiesAfter);
      
      // Verifica se o login foi bem-sucedido
      if (data?.session) {
        console.log('[useAuth signIn] Login bem-sucedido, sessão obtida:', data.session.user.email);
        console.log('[useAuth signIn] Token de acesso:', data.session.access_token.substring(0, 20) + '...');
        
        // Força uma atualização da sessão
        const { data: userData } = await supabase.auth.getUser();
        console.log('[useAuth signIn] Usuário verificado ANTES do push:', 
          userData.user?.email ?? 'Nenhum usuário');
        
        // Pequeno atraso antes de redirecionar para garantir que o cookie seja definido
        console.log('[useAuth signIn] Aguardando 800ms antes de redirecionar...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Log dos cookies após o delay
        const cookiesAfterDelay = document.cookie;
        console.log('[useAuth signIn] Cookies após delay:', cookiesAfterDelay);
        
        // Redireciona para o dashboard
        console.log('[useAuth signIn] Redirecionando para /dashboard');
        router.push('/dashboard');
        
        // Força uma nova renderização do componente
        console.log('[useAuth signIn] Atualizando router');
        router.refresh();
        
        return { success: true };
      } else {
        console.error('[useAuth signIn] Login falhou: Sessão não encontrada nos dados retornados');
        throw new Error('Falha ao fazer login. Tente novamente.');
      }
    } catch (error: any) {
      console.error('[useAuth signIn] Erro catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      console.log('[useAuth signInWithGoogle] Iniciando login com Google');
      
      // Log dos cookies antes do login
      const cookiesBefore = document.cookie;
      console.log('[useAuth signInWithGoogle] Cookies antes do login:', cookiesBefore);
      
      // Redirecionar para o fluxo de autenticação do Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[useAuth signInWithGoogle] Erro ao iniciar autenticação com Google:', error.message);
        throw error;
      }

      // Se chegou aqui, o redirecionamento para o Google está sendo feito
      console.log('[useAuth signInWithGoogle] Redirecionando para autenticação do Google:', data?.url);
      return { success: true };
      
    } catch (error: any) {
      console.error('[useAuth signInWithGoogle] Erro catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      console.log('[useAuth signUp] Iniciando registro com:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth signUp] Erro de registro:', error.message);
        throw error;
      }

      // Verifica se o registro foi bem-sucedido
      if (data?.user) {
        console.log('[useAuth signUp] Registro bem-sucedido, redirecionando para verificação');
        router.push('/auth/verification');
        return { success: true };
      } else {
        console.error('[useAuth signUp] Registro falhou: Usuário não encontrado nos dados retornados');
        throw new Error('Falha ao criar conta. Tente novamente.');
      }
    } catch (error: any) {
      console.error('[useAuth signUp] Erro catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('[useAuth signOut] Iniciando logout');
      
      // Log dos cookies antes do logout
      const cookiesBefore = document.cookie;
      console.log('[useAuth signOut] Cookies antes do logout:', cookiesBefore);
      
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Desloga apenas do dispositivo atual
      });
      
      if (error) {
        console.error('[useAuth signOut] Erro de logout:', error.message);
        throw error;
      }

      console.log('[useAuth signOut] Logout bem-sucedido');
      
      // Log dos cookies após o logout
      const cookiesAfter = document.cookie;
      console.log('[useAuth signOut] Cookies após o logout:', cookiesAfter);
      
      // Força uma atualização da sessão após o logout
      const { data } = await supabase.auth.getUser();
      console.log('[useAuth signOut] Usuário após logout:', 
        data.user?.email ?? 'Nenhum usuário (esperado)');
      
      // Não fazemos o redirecionamento aqui, deixamos para o componente que chamou
      return { success: true };
    } catch (error: any) {
      console.error('[useAuth signOut] Erro catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    isLoggedIn,
  };
} 