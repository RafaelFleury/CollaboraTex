"use client";

import { ReactNode, createContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

// Define tipos para o contexto e o provedor
type SupabaseUser = {
  id: string;
  email?: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  [key: string]: any;
};

type AuthContextType = {
  user: SupabaseUser | null;
  isLoggedIn: boolean;
  loading: boolean;
};

// Crie o contexto de autenticação
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para verificar e atualizar o usuário
  const checkUser = async () => {
    try {
      console.log('[AuthProvider checkUser] Verificando usuário...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('[AuthProvider checkUser] Erro:', error.message);
        setUser(null);
        return;
      }

      console.log(
        '[AuthProvider checkUser] Usuário verificado:', 
        user?.email ?? 'Nenhum usuário'
      );
      
      setUser(user ?? null);
      
      if (user) {
        console.log('[AuthProvider checkUser] Estado atualizado: usuário logado');
      } else {
        console.log('[AuthProvider checkUser] Estado atualizado: sem usuário');
      }
    } catch (error: any) {
      console.error('[AuthProvider checkUser] Erro catch:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[AuthProvider useEffect] Inicializando provider de autenticação');
    
    // Verifica o usuário inicial
    checkUser();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log(
          '[AuthProvider onAuthStateChange] Evento:', 
          event, 
          '| Email:', 
          session?.user?.email ?? 'Nenhuma sessão'
        );
        
        if (event === 'SIGNED_IN') {
          console.log('[AuthProvider onAuthStateChange] Usuário fez login');
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider onAuthStateChange] Usuário fez logout');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthProvider onAuthStateChange] Token atualizado, verificando usuário');
          // Atualiza o usuário com os novos dados
          await checkUser();
        }

        setLoading(false);
      }
    );

    // Configura um intervalo para verificar o usuário periodicamente
    const interval = setInterval(() => {
      console.log('[AuthProvider interval] Verificando usuário periodicamente');
      checkUser();
    }, 10 * 60 * 1000); // A cada 10 minutos

    // Limpa a inscrição e o intervalo ao desmontar
    return () => {
      console.log('[AuthProvider cleanup] Limpando inscrição de eventos de autenticação');
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  console.log('[AuthProvider render] Estado atual:', 
    user?.email ?? 'Sem usuário', 
    '| Logado:', !!user, 
    '| Carregando:', loading
  );

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 