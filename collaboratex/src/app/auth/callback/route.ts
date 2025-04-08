import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    
    console.log("[auth/callback] Received OAuth authorization code:", code ? "Present" : "Absent");
    
    if (code) {
      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables not configured");
      }
      
      // Creates a response that will be used to set cookies
      // It's important to use Next.js response to handle cookies
      const response = NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
      
      // Create Supabase client with cookieStore based on request/response
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({
                name,
                value,
                ...options
              });
            },
            remove(name: string, options: any) {
              response.cookies.delete({
                name,
                ...options
              });
            },
          },
        }
      );
      
      // Exchange code for a session
      console.log("[auth/callback] Exchanging code for session");
      await supabase.auth.exchangeCodeForSession(code);
      console.log("[auth/callback] Exchange completed successfully");
      
      // Redirect to dashboard after authentication process
      console.log("[auth/callback] Redirecting to dashboard");
      return response;
    }
    
    // Redirect to dashboard after authentication process (if no code)
    console.log("[auth/callback] Redirecting to dashboard (no code)");
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (error) {
    console.error("[auth/callback] Error processing callback:", error);
    // In case of error, redirect to login page
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("error", "auth_callback_error");
    return NextResponse.redirect(redirectUrl);
  }
} 