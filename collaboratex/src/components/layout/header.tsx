"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/DropdownMenu';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  const router = useRouter();
  const { user, signOut, isLoggedIn } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      console.log('[Header handleSignOut] Starting logout');
      const { success } = await signOut();
      if (success) {
        console.log('[Header handleSignOut] Logout successful, redirecting to home');
        router.push('/');
        router.refresh();
      } else {
        console.error('[Header handleSignOut] Logout failed');
      }
    } catch (error: any) {
      console.error('[Header handleSignOut] Error:', error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateToDashboard = () => {
    console.log('[Header navigateToDashboard] Navigating to dashboard');
    router.push('/dashboard');
  };

  const navigateToProfile = () => {
    console.log('[Header navigateToProfile] Navigating to profile');
    router.push('/profile');
  };

  const getInitials = (email?: string): string => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/features" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {showAuthButtons && (
              <div className="flex items-center space-x-2">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={navigateToDashboard}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={navigateToProfile}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button 
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href="/auth/login">
                        Log in
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                    >
                      <Link href="/auth/register">
                        Sign up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 