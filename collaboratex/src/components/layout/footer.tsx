"use client";

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="flex flex-col space-y-4">
            <Logo />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Collaborative platform for real-time LaTeX document editing.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Templates
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CollaboraTex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}