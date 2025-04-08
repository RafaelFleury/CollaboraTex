import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 px-6 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to start?
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Create a free account today and start collaborating on LaTeX documents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/register" 
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-blue-600 bg-white hover:bg-gray-100 shadow-md transition-colors"
          >
            Create free account
          </Link>
          <Link 
            href="/auth/login" 
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white border border-white hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
} 