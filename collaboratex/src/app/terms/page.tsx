import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - CollaboraTex',
  description: 'Terms of Service of CollaboraTex',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            CollaboraTex
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Back to Home
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>
        
        <div className="prose dark:prose-dark prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Terms</h2>
          <p>
            By accessing the CollaboraTex website, you agree to comply with these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use CollaboraTex for personal, non-commercial or commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for public display;</li>
            <li>attempt to decompile or reverse engineer any software contained in CollaboraTex;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2>3. Disclaimer</h2>
          <p>
            The materials on CollaboraTex are provided "as is". CollaboraTex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
          </p>
          
          <h2>4. Limitations</h2>
          <p>
            In no event shall CollaboraTex or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CollaboraTex, even if CollaboraTex or a CollaboraTex authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2>5. Revisions and Errata</h2>
          <p>
            The materials appearing on CollaboraTex's website may include technical, typographical, or photographic errors. CollaboraTex does not warrant that any of the materials on its website are accurate, complete, or current. CollaboraTex may make changes to the materials contained on its website at any time without notice.
          </p>
          
          <h2>6. Links</h2>
          <p>
            CollaboraTex has not reviewed all of the sites linked to its website and is not responsible for the contents of any linked site. The inclusion of any link does not imply endorsement by CollaboraTex of the site. Use of any linked website is at the user's own risk.
          </p>
          
          <h2>7. Modifications to Terms of Service</h2>
          <p>
            CollaboraTex may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
          
          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Brazil and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </p>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CollaboraTex. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 