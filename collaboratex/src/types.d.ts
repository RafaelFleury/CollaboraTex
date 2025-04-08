/// <reference types="react" />
/// <reference types="react-dom" />

// Solving issues with JSX types
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Declaration of 'next' module
declare module 'next' {
  import React from 'react';
  
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    keywords?: string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    robots?: string;
    canonical?: string;
    openGraph?: any;
    twitter?: any;
    viewport?: string;
    icons?: any;
    metadataBase?: URL;
    alternates?: any;
    other?: Record<string, any>;
  }
}

// Module declarations for geist fonts
declare module 'geist/font/sans' {
  const GeistSans: {
    variable: string;
    style: any;
  };
  export { GeistSans };
}

declare module 'geist/font/mono' {
  const GeistMono: {
    variable: string;
    style: any;
  };
  export { GeistMono };
}

// Module declarations for Next.js
declare module 'next/link' {
  import React from 'react';
  
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
  }
  
  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
  
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  
  export interface ImageProps {
    src: string | object;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    className?: string;
    quality?: number;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
  }
  
  const Image: React.FC<ImageProps>;
  
  export default Image;
}

declare module 'next/navigation' {
  export interface NavigateOptions {
    scroll?: boolean;
  }

  export interface AppRouterInstance {
    back(): void;
    forward(): void;
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
    refresh(): void;
    prefetch(href: string): void;
  }

  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
} 