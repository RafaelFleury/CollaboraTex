"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import DocumentsGrid from '@/components/dashboard/DocumentsGrid';
import CreateDocumentForm from '@/components/dashboard/CreateDocumentForm';
import { DocumentData } from '@/components/dashboard/DocumentCard';

// Mock data for documents (will be replaced with actual Supabase data)
const mockDocuments = [
  { id: '1', title: 'Artigo de Pesquisa sobre IA', lastEdited: '2023-07-15', collaborators: 2 },
  { id: '2', title: 'Dissertação de Mestrado', lastEdited: '2023-07-10', collaborators: 0 },
  { id: '3', title: 'Notas de Matemática Avançada', lastEdited: '2023-07-05', collaborators: 1 },
];

export default function DashboardPage() {
  const { user, loading, isLoggedIn, signOut } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentData[]>(mockDocuments);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [loading, isLoggedIn, router]);

  const handleCreateDocument = (newDocument: Omit<DocumentData, 'id'>) => {
    const newDoc = {
      ...newDocument,
      id: Date.now().toString(),
    };
    setDocuments([newDoc, ...documents]);
    setIsCreatingNew(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white shadow-sm dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                CollaboraTex
              </span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
              {user?.email}
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Seus Documentos
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Gerencie seus documentos LaTeX e colaborações
            </p>
          </div>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Novo Documento
          </button>
        </div>

        {isCreatingNew && (
          <CreateDocumentForm 
            onCancel={() => setIsCreatingNew(false)}
            onSubmit={handleCreateDocument}
          />
        )}

        <DocumentsGrid 
          documents={documents}
          onNewDocument={() => setIsCreatingNew(true)}
        />
      </main>
    </div>
  );
} 