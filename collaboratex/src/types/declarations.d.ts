/**
 * Module declarations to help TypeScript find external modules
 */

// Supabase modules
declare module '@supabase/auth-helpers-nextjs';
declare module '@supabase/ssr';
declare module '@supabase/supabase-js';

// CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Ignorar avisos de globals.css com @tailwind directives
declare module 'globals.css';

// Bibliotecas com problemas de tipos
declare module 'estree';
declare module 'json-schema';
declare module 'json5';
declare module 'phoenix';
declare module 'ws'; 