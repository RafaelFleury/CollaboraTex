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

// Ignore warnings from globals.css with @tailwind directives
declare module 'globals.css';

// Libraries with typing issues
declare module 'estree';
declare module 'json-schema';
declare module 'json5';
declare module 'phoenix';
declare module 'ws'; 