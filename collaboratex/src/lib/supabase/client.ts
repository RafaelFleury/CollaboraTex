import { createBrowserClient } from '@supabase/ssr';

// Get the environment variables, ensuring they exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Check your .env.local file.');
}

// Extrair o ID do projeto do URL do Supabase para o nome do cookie
const projectId = supabaseUrl ? supabaseUrl.split('.')[0].split('//')[1] : '';
const cookieName = `sb-${projectId}-auth-token`;

console.log('[Supabase Client] Inicializando cliente com URL:', supabaseUrl);
console.log('[Supabase Client] Usando cookie:', cookieName);

// Função para registrar os cookies atuais
const logCookies = () => {
  if (typeof window !== 'undefined') {
    console.log('[Supabase Client] Cookies atuais:', document.cookie);
  }
};

// Log dos cookies iniciais
if (typeof window !== 'undefined') {
  logCookies();
}

// Initialize the Supabase client with environment variables
export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: true, // Ativa logs detalhados de auth
      // Configurações específicas para cookies
      cookieOptions: {
        // Usamos o nome padrão gerado pelo Supabase baseado no ID do projeto
        name: cookieName,
        // Localhost precisa usar SameSite=Lax
        sameSite: 'lax',
        // Em desenvolvimento, secure deve ser false para localhost
        secure: process.env.NODE_ENV === 'production',
        // Caminho onde o cookie é válido
        path: '/',
        // Aumentamos o tempo de vida do cookie
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      }
    }
  }
);

// Log quando o cliente é inicializado
console.log('[Supabase Client] Cliente inicializado');

// Definir interfaces para a resposta do Supabase
interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: any;
}

interface SupabaseSession {
  user: SupabaseUser;
  [key: string]: any;
}

interface SessionResponse {
  data: {
    session: SupabaseSession | null;
  }
}

// Tipo para eventos de autenticação
type AuthChangeEvent = 
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

// Verificar estado inicial da autenticação
supabase.auth.getSession().then((response: SessionResponse) => {
  console.log('[Supabase Client] Sessão inicial:', response.data.session ? 'Ativa' : 'Inativa');
  if (response.data.session) {
    console.log('[Supabase Client] Usuário logado:', response.data.session.user.email);
  }
  
  // Log dos cookies após verificar a sessão
  logCookies();
});

// Adiciona observador para mudanças na sessão
supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: SupabaseSession | null) => {
  console.log(`[Supabase Client] Evento de autenticação: ${event}`);
  logCookies();
});

// Export a function to get an authenticated client
export const getSupabaseClient = () => {
  return supabase;
}; 