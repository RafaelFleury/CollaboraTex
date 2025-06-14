import Link from 'next/link';

export default function Hero() {
  return (
    <section className="flex-grow flex flex-col items-center justify-center p-8 md:p-12 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
        Collaborate on <span className="text-blue-600 dark:text-blue-400">LaTeX</span> documents in real-time
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
        CollaboraTex is a free online LaTeX editor that enables real-time collaboration,
        instant preview, and much more.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/auth/register" 
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
        >
          Get started
        </Link>
        <Link 
          href="#features" 
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-colors"
        >
          Learn more
        </Link>
      </div>
    </section>
  );
} 