'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { MonacoEditor } from '@/components/editor/MonacoEditor';

interface DocumentData {
  document_id: string;
  title: string;
  content: string;
  permission: string;
  is_valid: boolean;
}

export default function AnonEditorPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string>('');
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Suprimir os erros de console para a página anônima
  useEffect(() => {
    const originalConsoleError = console.error;
    
    // Substituir console.error por uma função que filtra erros específicos
    console.error = (...args) => {
      // Verificar se a mensagem de erro contém strings relacionadas à autenticação
      const errorMessage = args.join(' ');
      if (
        errorMessage.includes('AuthProvider') || 
        errorMessage.includes('auth.getUser') ||
        errorMessage.includes('checkUser')
      ) {
        // Suprimir erros de autenticação para a página anônima
        return;
      }
      
      // Permitir que outros erros sejam registrados normalmente
      originalConsoleError(...args);
    };
    
    // Restaurar o console.error original quando o componente é desmontado
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  
  // Extrair o token da URL usando o pathname
  useEffect(() => {
    if (pathname) {
      // Formato do pathname: /editor/anon/[token]
      const segments = pathname.split('/');
      if (segments.length >= 4) {
        setToken(segments[3]); // O token é o último segmento
      }
    }
  }, [pathname]);
  
  // Buscar o documento quando o token estiver disponível
  useEffect(() => {
    // Só executar quando o token estiver definido
    if (!token) return;
    
    const fetchDocumentByToken = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .rpc('get_document_by_token', { token });
        
        if (error) throw error;
        
        if (!data || data.length === 0 || !data[0].is_valid) {
          throw new Error('Invalid or expired link');
        }
        
        setDocument(data[0]);
        setCurrentContent(data[0].content);
      } catch (err: any) {
        console.error('Error fetching document:', err);
        setError(err.message || 'Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocumentByToken();
  }, [token]);
  
  // Função para salvar o documento com o token anônimo
  const saveDocument = async () => {
    if (!token || !document) return;
    
    try {
      setIsSaving(true);
      setSaveMessage(null);
      
      const { data, error } = await supabase
        .rpc('save_document_anonymous', {
          p_token: token,
          p_content: currentContent
        });
      
      if (error) throw error;
      
      setLastSaved(new Date());
      setSaveMessage('Document saved successfully');
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error saving document:', err);
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler para mudanças no editor
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentContent(value);
    }
  };
  
  // Formatar a hora do último salvamento
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    return lastSaved.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-300 max-w-md">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error || 'Document not found'}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  const isReadOnly = document.permission !== 'edit';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{document.title}</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {isReadOnly ? 'View Only' : 'Anonymous Editor'}
              </span>
            </div>
            
            {!isReadOnly && (
              <div className="flex items-center space-x-4">
                {lastSaved && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Saved at {formatLastSaved()}
                  </span>
                )}
                
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  onClick={saveDocument}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          {saveMessage && (
            <div className={`mt-2 p-2 text-sm rounded ${
              saveMessage.startsWith('Error') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">LaTeX Code</h2>
            <div className="border rounded-md border-gray-300 dark:border-gray-700 h-96">
              <MonacoEditor
                value={currentContent}
                onChange={handleEditorChange}
                height="100%"
                readOnly={isReadOnly}
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h2>
            <div className="border rounded-md border-gray-300 dark:border-gray-700 p-4 h-96 overflow-auto">
              {/* Aqui iria o componente de visualização do PDF */}
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">PDF Preview would appear here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 