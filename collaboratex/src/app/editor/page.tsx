'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { useDocument } from '@/hooks/useDocument';
import AnonymousLinkDialog from '@/components/editor/AnonymousLinkDialog';
import { useAuth } from '@/hooks/use-auth';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('id');
  const router = useRouter();
  const { user } = useAuth();
  
  // Local state for editor content
  const [editorContent, setEditorContent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('Untitled Document');
  
  // Use the hook to manage the document
  const {
    document,
    isLoading: isLoadingDoc,
    error,
    isSaving,
    lastSaved,
    saveDocument,
    updateContent
  } = useDocument(documentId || undefined);
  
  // Check if current user is the owner
  const isOwner = document?.owner_id === user?.id;
  
  // Synchronize the local state with the loaded document
  useEffect(() => {
    if (document) {
      setEditorContent(document.content);
      setDocumentTitle(document.title);
    }
  }, [document]);
  
  // Handler for editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
      updateContent(value);
    }
  };
  
  // Handler to save the document
  const handleSaveDocument = async () => {
    if (!document) {
      // Create a new document if it doesn't exist
      await saveDocument({
        title: documentTitle,
        content: editorContent
      });
    } else {
      // Update existing document
      await saveDocument({
        ...document,
        content: editorContent
      });
    }
  };
  
  // Format the last saved time
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {documentTitle}
              </h1>
              
              {isSaving && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Saving...
                </span>
              )}
              {lastSaved && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last saved: {formatDate(lastSaved)}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <AnonymousLinkDialog documentId={documentId} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoadingDoc ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-300">
            <p>Error loading document: {error}</p>
            <button 
              className="mt-2 text-sm underline"
              onClick={() => router.push('/dashboard')}
            >
              Back to dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">LaTeX Code</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700 h-96">
                <MonacoEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  height="100%"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700 p-4 h-96 overflow-auto">
                <div className="mb-6 text-center border-b pb-4 border-gray-200 dark:border-gray-600">
                  <h3 className="text-2xl font-bold mb-2">My Document</h3>
                  <p className="text-gray-600 dark:text-gray-400">Your Name</p>
                  <p className="text-gray-500 text-sm">Current Date</p>
                </div>
                
                <div className="prose dark:prose-dark prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none">
                  <h4 className="text-xl font-bold">1 Introduction</h4>
                  <p>Here is an example of a LaTeX document.</p>
                  
                  <h4 className="text-xl font-bold mt-4">2 Methods</h4>
                  <p>You can add formulas like E = mc<sup>2</sup>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 