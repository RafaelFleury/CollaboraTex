import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    
    console.log("[auth/callback] Recebido código de autorização OAuth:", code ? "Presente" : "Ausente");
    
    if (code) {
      // Inicializar cliente Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Variáveis de ambiente do Supabase não configuradas");
      }
      
      // Cria uma resposta que será usada para definir cookies
      // É importante usar a resposta do Next.js para manipular os cookies
      const response = NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
      
      // Criar o cliente Supabase com cookieStore baseado na request/response
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
      
      // Trocar o código por uma sessão
      console.log("[auth/callback] Trocando código por sessão");
      await supabase.auth.exchangeCodeForSession(code);
      console.log("[auth/callback] Troca concluída com sucesso");
      
      // Redireciona para o dashboard após o processo de autenticação
      console.log("[auth/callback] Redirecionando para dashboard");
      return response;
    }
    
    // Redireciona para o dashboard após o processo de autenticação (caso não tenha código)
    console.log("[auth/callback] Redirecionando para dashboard (sem código)");
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (error) {
    console.error("[auth/callback] Erro ao processar callback:", error);
    // Em caso de erro, redireciona para página de login
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("error", "auth_callback_error");
    return NextResponse.redirect(redirectUrl);
  }
} 