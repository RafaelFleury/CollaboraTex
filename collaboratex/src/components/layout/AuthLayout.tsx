import React from 'react';
import { Logo } from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        {(title || subtitle) && (
          <div className="text-center">
            {title && (
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-2 text-gray-600 dark:text-gray-300">{subtitle}</p>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
} 