"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PlusIcon, AlertCircleIcon, GridIcon, ListIcon } from 'lucide-react';
import DocumentsGrid from '@/components/dashboard/DocumentsGrid';
import CreateDocumentForm from '@/components/dashboard/CreateDocumentForm';
import { DocumentData } from '@/components/dashboard/DocumentCard';
import { useDocumentsList } from '@/hooks/useDocumentsList';
import { supabase } from '@/lib/supabase/client';

// Define view mode type
type ViewMode = 'grid' | 'list';

export default function DashboardPage() {
  const { user, loading: authLoading, isLoggedIn, signOut } = useAuth();
  const router = useRouter();
  const { 
    documents, 
    isLoading: docsLoading, 
    error, 
    createDocument, 
    deleteDocument, 
    fetchDocuments 
  } = useDocumentsList();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [authRedirectAttempted, setAuthRedirectAttempted] = useState(false);
  // State to control view mode
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if authentication has been verified
    // and user is not logged in and we haven't tried redirecting yet
    if (!authLoading && !isLoggedIn && !authRedirectAttempted) {
      setAuthRedirectAttempted(true);
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/login');
    }
  }, [authLoading, isLoggedIn, router, authRedirectAttempted]);

  // Convert documents from Supabase format to DocumentCard format
  const formattedDocuments: DocumentData[] = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    updated_at: doc.updated_at,
    collaborators_count: doc.collaborators_count || 0
  }));

  // Handler to create a new document
  const handleCreateDocument = async (title: string) => {
    if (!isLoggedIn) {
      return { success: false, error: 'User not authenticated' };
    }
    return await createDocument(title);
  };
  
  // Handler to delete a document
  const handleDeleteDocument = async (id: string) => {
    if (!isLoggedIn) {
      return { success: false, error: 'User not authenticated' };
    }
    return await deleteDocument(id);
  };
  
  // Handler to edit document title
  const handleEditDocumentTitle = async (id: string, newTitle: string) => {
    if (!isLoggedIn || !user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      // Check current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Authentication session not found');
      }
      
      // Check if user owns the document
      const { data: docCheck, error: docCheckError } = await supabase
        .from('documents')
        .select('owner_id')
        .eq('id', id)
        .single();
      
      if (docCheckError) {
        throw new Error(docCheckError.message);
      }
      
      if (!docCheck) {
        throw new Error('Document not found');
      }
      
      if (docCheck.owner_id !== user.id) {
        throw new Error('You do not have permission to edit this document');
      }
      
      // Update document title
      const { error: updateError } = await supabase
        .from('documents')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Reload document list
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Error editing document title:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error editing document title' 
      };
    }
  };

  // Toggle between view modes
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // If authentication is still loading, show a spinner
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect (via useEffect)
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircleIcon className="h-12 w-12 text-yellow-500" />
          <p className="text-lg text-gray-700 dark:text-gray-300">Session expired or user not authenticated</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log in
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
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Documents
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your LaTeX documents and collaborations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Toggle buttons for view mode */}
            <div className="mr-2 bg-gray-100 rounded-lg p-1 dark:bg-gray-700 flex items-center">
              <button
                onClick={() => toggleViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => toggleViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                aria-label="List view"
                title="List view"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Document
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Error loading documents: {error}
              </p>
            </div>
            {error.includes('authentication') || error.includes('session') ? (
              <div className="mt-3">
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="text-sm text-red-700 dark:text-red-300 underline"
                >
                  Go to login
                </button>
              </div>
            ) : null}
          </div>
        )}

        <DocumentsGrid 
          documents={formattedDocuments}
          isLoading={docsLoading}
          onNewDocument={() => setIsCreatingNew(true)}
          onDeleteDocument={handleDeleteDocument}
          onEditDocumentTitle={handleEditDocumentTitle}
          viewMode={viewMode}
        />

        {isCreatingNew && (
          <CreateDocumentForm
            onSubmit={handleCreateDocument}
            onCancel={() => setIsCreatingNew(false)}
          />
        )}
      </main>
    </div>
  );
} 