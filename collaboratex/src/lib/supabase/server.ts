import { createServerClient } from '@supabase/ssr';

// Get the environment variables, ensuring they exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Check your .env.local file.');
}

/**
 * Create a Supabase client for server-side use
 * This should be used with the cookies object from a Request context
 */
export const createServerSupabaseClient = (cookieGetter: {
  get: (name: string) => string | undefined
}) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          try {
            // Uses the cookie getter provided as parameter
            return cookieGetter.get(name);
          } catch (error) {
            console.error('[ServerClient] Error reading cookie:', error);
            return undefined;
          }
        },
        set() {
          // Server Components cannot modify cookies
          console.warn('[ServerClient] Cannot set cookies in Server Components');
        },
        remove() {
          // Server Components cannot modify cookies
          console.warn('[ServerClient] Cannot remove cookies in Server Components');
        },
      },
    }
  );
};

/**
 * Wrapper function to be used in Server Components
 * Usage example:
 * 
 * import { cookies } from 'next/headers';
 * import { getServerSupabaseClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const cookieStore = cookies();
 *   const cookieGetter = {
 *     get: (name: string) => cookieStore.get(name)?.value
 *   };
 *   const supabase = getServerSupabaseClient(cookieGetter);
 *   // ...
 * }
 */
export const getServerSupabaseClient = (cookieGetter: {
  get: (name: string) => string | undefined
}) => {
  return createServerSupabaseClient(cookieGetter);
};

/**
 * For operations that require admin privileges
 * WARNING: This bypasses RLS and should ONLY be used on the server
 */
export const createServerAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  }
  
  // Use regular createClient from supabase-js if needed with service role key
  // This is out of scope for now but should be implemented if admin operations are required
}