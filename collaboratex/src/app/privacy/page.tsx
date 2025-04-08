import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - CollaboraTex',
  description: 'Privacy Policy of CollaboraTex',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>
            Your privacy is important to us. It is CollaboraTex's policy to respect your privacy regarding any information we may collect from you through our website.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect personal information when you:
          </p>
          <ul>
            <li>Create an account (name, email, password)</li>
            <li>Use our services (LaTeX documents created, collaboration information)</li>
            <li>Contact our support</li>
          </ul>
          <p>
            We also automatically collect information such as IP address, browser type, pages visited, and access times.
          </p>
          
          <h2>3. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and manage your account</li>
            <li>Process your transactions</li>
            <li>Communicate with you about updates, features, and offers</li>
            <li>Detect and prevent fraudulent activities</li>
          </ul>
          
          <h2>4. Information Sharing</h2>
          <p>
            We do not sell, rent, or share your personal information with third parties, except:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal requirements</li>
            <li>With service providers working on our behalf</li>
          </ul>
          
          <h2>5. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to remember your preferences, understand how you use our site, and offer a personalized experience.
          </p>
          
          <h2>6. Security</h2>
          <p>
            We implement security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.
          </p>
          
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide the requested services and fulfill our legal obligations.
          </p>
          
          <h2>8. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access, correct, or delete your personal data</li>
            <li>Restrict or object to the processing of your data</li>
            <li>Receive your data in a portable format</li>
            <li>Withdraw consent at any time</li>
          </ul>
          
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy periodically. We recommend checking it regularly to be aware of any changes.
          </p>
          
          <h2>10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: privacy@collaboratex.com
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