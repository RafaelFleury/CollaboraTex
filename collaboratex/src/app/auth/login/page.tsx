import Link from 'next/link';
import AuthForm from '@/components/auth/auth-form';

export const metadata = {
  title: 'Login - CollaboraTex',
  description: 'Sign in to your CollaboraTex account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          href="/" 
          className="flex justify-center"
        >
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            CollaboraTex
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            href="/auth/register" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm type="login" />
        </div>
        
        <div className="mt-6 text-center text-sm">
          <Link 
            href="/" 
            className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ← Back to home page
          </Link>
        </div>
      </div>
    </div>
  );
} 