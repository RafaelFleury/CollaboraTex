import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export function Logo({ className, size = 'md', withText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className={cn('text-primary-600 dark:text-primary-400', sizeClasses[size])}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6L8 4M8 4L10 6M8 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 6L16 4M16 4L14 6M16 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 15V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11H19C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      {withText && (
        <span className="font-semibold text-gray-900 dark:text-white text-lg">
          Collabora<span className="text-primary-600 dark:text-primary-400">Tex</span>
        </span>
      )}
    </Link>
  );
} 