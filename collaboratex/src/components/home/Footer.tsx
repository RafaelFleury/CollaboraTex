import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              CollaboraTex
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
            <a href="https://github.com/yourusername/collaboratex" className="hover:text-blue-600 dark:hover:text-blue-400">GitHub</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} CollaboraTex. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 