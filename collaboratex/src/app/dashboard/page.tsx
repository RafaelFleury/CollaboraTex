"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PlusIcon, AlertCircleIcon } from 'lucide-react';
import DocumentsGrid from '@/components/dashboard/DocumentsGrid';
import CreateDocumentForm from '@/components/dashboard/CreateDocumentForm';
import { DocumentData } from '@/components/dashboard/DocumentCard';
import { useDocumentsList } from '@/hooks/useDocumentsList';

export default function DashboardPage() {
  const { user, loading: authLoading, isLoggedIn, signOut } = useAuth();
  const router = useRouter();
  const { documents, isLoading: docsLoading, error, createDocument, deleteDocument } = useDocumentsList();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [authRedirectAttempted, setAuthRedirectAttempted] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    // Apenas redirecionamos se a autenticação já estiver verificada 
    // e o usuário não estiver logado e ainda não tentamos redirecionar
    if (!authLoading && !isLoggedIn && !authRedirectAttempted) {
      setAuthRedirectAttempted(true);
      console.log('Usuário não autenticado, redirecionando para login');
      router.push('/auth/login');
    }
  }, [authLoading, isLoggedIn, router, authRedirectAttempted]);

  // Converter os documentos do formato Supabase para o formato do DocumentCard
  const formattedDocuments: DocumentData[] = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    updated_at: doc.updated_at,
    collaborators_count: doc.collaborators_count || 0
  }));

  // Manipulador para criar um novo documento
  const handleCreateDocument = async (title: string) => {
    if (!isLoggedIn) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    return await createDocument(title);
  };
  
  // Manipulador para excluir um documento
  const handleDeleteDocument = async (id: string) => {
    if (!isLoggedIn) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    return await deleteDocument(id);
  };

  // Se a autenticação ainda está carregando, mostramos um spinner
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não está logado, redirecionamos (via useEffect)
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircleIcon className="h-12 w-12 text-yellow-500" />
          <p className="text-lg text-gray-700 dark:text-gray-300">Sessão expirada ou usuário não autenticado</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fazer login
          </button>
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
              onClick={() => {
                signOut().then(() => router.push('/auth/login'));
              }}
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

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Erro ao carregar documentos: {error}
              </p>
            </div>
            {error.includes('autenticação') || error.includes('sessão') ? (
              <div className="mt-3">
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="text-sm text-red-700 dark:text-red-300 underline"
                >
                  Fazer login novamente
                </button>
              </div>
            ) : null}
          </div>
        )}

        {isCreatingNew && (
          <CreateDocumentForm 
            onCancel={() => setIsCreatingNew(false)}
            onSubmit={handleCreateDocument}
          />
        )}

        <DocumentsGrid 
          documents={formattedDocuments}
          onNewDocument={() => setIsCreatingNew(true)}
          onDeleteDocument={handleDeleteDocument}
          isLoading={docsLoading}
        />
      </main>
    </div>
  );
} 