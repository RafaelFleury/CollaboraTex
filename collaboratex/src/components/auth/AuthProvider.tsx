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
      console.log('[AuthProvider checkUser] Verifying user...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('[AuthProvider checkUser] Error:', error.message);
        setUser(null);
        return;
      }

      console.log(
        '[AuthProvider checkUser] User verified:', 
        user?.email ?? 'No user'
      );
      
      setUser(user ?? null);
      
      if (user) {
        console.log('[AuthProvider checkUser] State updated: user logged in');
      } else {
        console.log('[AuthProvider checkUser] State updated: no user');
      }
    } catch (error: any) {
      console.error('[AuthProvider checkUser] Error catch:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[AuthProvider useEffect] Initializing authentication provider');
    
    // Check initial user
    checkUser();

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log(
          '[AuthProvider onAuthStateChange] Event:', 
          event, 
          '| Email:', 
          session?.user?.email ?? 'No session'
        );
        
        if (event === 'SIGNED_IN') {
          console.log('[AuthProvider onAuthStateChange] User logged in');
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider onAuthStateChange] User logged out');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthProvider onAuthStateChange] Token updated, verifying user');
          // Update user with new data
          await checkUser();
        }

        setLoading(false);
      }
    );

    // Set up an interval to check the user periodically
    const interval = setInterval(() => {
      console.log('[AuthProvider interval] Checking user periodically');
      checkUser();
    }, 10 * 60 * 1000); // Every 10 minutes

    // Clean up subscription and interval when unmounting
    return () => {
      console.log('[AuthProvider cleanup] Cleaning up authentication event subscription');
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  console.log('[AuthProvider render] Current state:', 
    user?.email ?? 'No user', 
    '| Logged in:', !!user, 
    '| Loading:', loading
  );

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 