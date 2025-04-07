"use client";

import { PlusIcon, FilePlusIcon } from 'lucide-react';
import DocumentCard, { DocumentData } from './DocumentCard';

type ViewMode = 'grid' | 'list';

interface DocumentsGridProps {
  documents: DocumentData[];
  onNewDocument: () => void;
  onDeleteDocument?: (id: string) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  viewMode?: ViewMode;
}

export default function DocumentsGrid({ 
  documents, 
  onNewDocument,
  onDeleteDocument,
  isLoading = false,
  viewMode = 'grid'
}: DocumentsGridProps) {
  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Carregando seus documentos...
        </p>
      </div>
    );
  }

  // Estado vazio - sem documentos
  if (documents.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <FilePlusIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          Nenhum documento
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comece criando um novo documento.
        </p>
        <div className="mt-6">
          <button
            onClick={onNewDocument}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Novo Documento
          </button>
        </div>
      </div>
    );
  }

  // Estado com documentos - renderizar como grid ou lista baseado no viewMode
  return viewMode === 'grid' ? (
    // Visualização em grid
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onDelete={onDeleteDocument}
        />
      ))}
    </div>
  ) : (
    // Visualização em lista
    <div className="flex flex-col space-y-3">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onDelete={onDeleteDocument}
          listMode
        />
      ))}
    </div>
  );
} 