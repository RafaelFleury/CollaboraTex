"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { AuthContext } from '@/components/auth/AuthProvider';

// Define types locally to avoid namespace issues
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
      console.log('[useAuth signIn] Starting login with:', email);
      
      // Log cookies before login
      const cookiesBefore = document.cookie;
      console.log('[useAuth signIn] Cookies before login:', cookiesBefore);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth signIn] Authentication error:', error.message);
        throw error;
      }

      // Log cookies after login
      const cookiesAfter = document.cookie;
      console.log('[useAuth signIn] Cookies after login:', cookiesAfter);
      
      // Check if login was successful
      if (data?.session) {
        console.log('[useAuth signIn] Login successful, session obtained:', data.session.user.email);
        console.log('[useAuth signIn] Access token:', data.session.access_token.substring(0, 20) + '...');
        
        // Force a session update
        const { data: userData } = await supabase.auth.getUser();
        console.log('[useAuth signIn] User verified BEFORE push:', 
          userData.user?.email ?? 'No user');
        
        // Small delay before redirecting to ensure the cookie is set
        console.log('[useAuth signIn] Waiting 800ms before redirecting...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Log cookies after delay
        const cookiesAfterDelay = document.cookie;
        console.log('[useAuth signIn] Cookies after delay:', cookiesAfterDelay);
        
        // Redirect to dashboard
        console.log('[useAuth signIn] Redirecting to /dashboard');
        router.push('/dashboard');
        
        // Force component re-rendering
        console.log('[useAuth signIn] Updating router');
        router.refresh();
        
        return { success: true };
      } else {
        console.error('[useAuth signIn] Login failed: Session not found in returned data');
        throw new Error('Failed to login. Please try again.');
      }
    } catch (error: any) {
      console.error('[useAuth signIn] Error catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      console.log('[useAuth signInWithGoogle] Starting login with Google');
      
      // Log cookies before login
      const cookiesBefore = document.cookie;
      console.log('[useAuth signInWithGoogle] Cookies before login:', cookiesBefore);
      
      // Redirect to Google authentication flow
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
        console.error('[useAuth signInWithGoogle] Error starting Google authentication:', error.message);
        throw error;
      }

      // If we got here, the redirect to Google is happening
      console.log('[useAuth signInWithGoogle] Redirecting to Google authentication:', data?.url);
      return { success: true };
      
    } catch (error: any) {
      console.error('[useAuth signInWithGoogle] Error catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      console.log('[useAuth signUp] Starting registration with:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth signUp] Registration error:', error.message);
        throw error;
      }

      // Check if registration was successful
      if (data?.user) {
        console.log('[useAuth signUp] Registration successful, redirecting to verification');
        router.push('/auth/verification');
        return { success: true };
      } else {
        console.error('[useAuth signUp] Registration failed: User not found in returned data');
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (error: any) {
      console.error('[useAuth signUp] Error catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('[useAuth signOut] Starting logout');
      
      // Log cookies before logout
      const cookiesBefore = document.cookie;
      console.log('[useAuth signOut] Cookies before logout:', cookiesBefore);
      
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Logs out only from the current device
      });
      
      if (error) {
        console.error('[useAuth signOut] Logout error:', error.message);
        throw error;
      }

      console.log('[useAuth signOut] Logout successful');
      
      // Log cookies after logout
      const cookiesAfter = document.cookie;
      console.log('[useAuth signOut] Cookies after logout:', cookiesAfter);
      
      // Force session update after logout
      const { data } = await supabase.auth.getUser();
      console.log('[useAuth signOut] User after logout:', 
        data.user?.email ?? 'No user (expected)');
      
      // We don't redirect here, we leave it to the component that called
      return { success: true };
    } catch (error: any) {
      console.error('[useAuth signOut] Error catch:', error.message);
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