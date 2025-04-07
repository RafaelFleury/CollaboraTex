'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { useDocument } from '@/hooks/useDocument';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('id');
  const router = useRouter();
  
  // Estado local para o conteúdo do editor
  const [editorContent, setEditorContent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('Documento sem título');
  
  // Usar o hook para gerenciar o documento
  const {
    document,
    isLoading: isLoadingDoc,
    error,
    isSaving,
    lastSaved,
    saveDocument,
    updateContent
  } = useDocument(documentId || undefined);
  
  // Sincronizar o estado local com o documento carregado
  useEffect(() => {
    if (document) {
      setEditorContent(document.content);
      setDocumentTitle(document.title);
    }
  }, [document]);
  
  // Handler para mudanças no editor
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
      updateContent(value);
    }
  };
  
  // Handler para salvar o documento
  const handleSaveDocument = async () => {
    if (!document) {
      // Criar um novo documento se não existir
      await saveDocument({
        title: documentTitle,
        content: editorContent
      });
    } else {
      // Atualizar documento existente
      await saveDocument({
        ...document,
        content: editorContent
      });
    }
  };
  
  // Formatar a hora do último salvamento
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    return lastSaved.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{documentTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Salvo às {formatLastSaved()}
              </span>
            )}
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              onClick={handleSaveDocument}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
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
            <p>Erro ao carregar documento: {error}</p>
            <button 
              className="mt-2 text-sm underline"
              onClick={() => router.push('/dashboard')}
            >
              Voltar para o dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Código LaTeX</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700 h-96">
                <MonacoEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  height="100%"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Visualização</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700 p-4 h-96 overflow-auto">
                <div className="mb-6 text-center border-b pb-4 border-gray-200 dark:border-gray-600">
                  <h3 className="text-2xl font-bold mb-2">Meu Documento</h3>
                  <p className="text-gray-600 dark:text-gray-400">Seu Nome</p>
                  <p className="text-gray-500 text-sm">Data Atual</p>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h4 className="text-xl font-bold">1 Introdução</h4>
                  <p>Aqui está um exemplo de documento LaTeX.</p>
                  
                  <h4 className="text-xl font-bold mt-4">2 Métodos</h4>
                  <p>Você pode adicionar fórmulas como E = mc<sup>2</sup>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 