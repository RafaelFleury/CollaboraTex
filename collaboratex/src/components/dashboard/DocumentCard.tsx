"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon, Trash2Icon, XIcon, AlertTriangleIcon, MoreVerticalIcon, UsersIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para definir a estrutura dos dados do documento
export interface DocumentData {
  id: string;
  title: string;
  updated_at: string;
  collaborators_count: number;
}

interface DocumentCardProps {
  document: DocumentData;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  listMode?: boolean;
}

export default function DocumentCard({ document, onDelete, listMode = false }: DocumentCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Formatar a data de edição de forma mais amigável
  const formattedDate = formatDistanceToNow(new Date(document.updated_at), {
    addSuffix: true,
    locale: ptBR
  });

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(false);
    setError(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await onDelete(document.id);
      
      if (!result.success && result.error) {
        setError(result.error);
        setIsDeleting(false);
      } else {
        // Fechar o modal será automático, pois o componente será desmontado após a exclusão
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir documento');
      setIsDeleting(false);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  // Renderização no modo lista
  if (listMode) {
    return (
      <div className="relative group">
        <div className="flex items-center rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700">
          <Link 
            href={`/editor?id=${document.id}`}
            className="flex-grow p-3 flex items-center"
          >
            <div className="min-w-0 flex-grow">
              <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {document.title}
              </h3>
              <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <UsersIcon className="mr-1 h-3.5 w-3.5" />
                  <span>
                    {document.collaborators_count > 0 
                      ? `${document.collaborators_count} colaborador${document.collaborators_count > 1 ? 'es' : ''}` 
                      : 'Somente você'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center ml-4 text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
              Abrir
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </span>
          </Link>
          
          {onDelete && (
            <div className="relative px-3 border-l border-gray-200 dark:border-gray-700 flex items-center">
              <button 
                onClick={handleMenuToggle}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Opções do documento"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </button>
              
              {/* Menu dropdown - A posição absoluta precisa de um pai relativo. O pai px-3 agora é relativo */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={closeMenu}
                  />
                  {/* Adicionado right-0 para alinhar à direita do botão */}
                  <div className="absolute right-0 top-full mt-1 mr-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-20">
                    <div className="py-1">
                      <Link 
                        href={`/editor?id=${document.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <ArrowRightIcon className="mr-2 h-4 w-4" />
                        Abrir editor
                      </Link>
                      <button 
                        onClick={handleDeleteClick}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Excluir documento
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal de confirmação de exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCancelDelete}>
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
              <button
                onClick={handleCancelDelete}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <XIcon className="h-5 w-5" />
              </button>
              
              <div className="mb-5 flex items-center justify-center text-red-500">
                <AlertTriangleIcon className="h-10 w-10" />
              </div>
              
              <h3 className="mb-2 text-center text-lg font-medium text-gray-900 dark:text-white">
                Excluir documento
              </h3>
              
              <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
                Tem certeza que deseja excluir <span className="font-medium">{document.title}</span>? Esta ação não pode ser desfeita.
              </p>
              
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Excluindo...
                    </>
                  ) : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Renderização no modo grid (padrão)
  return (
    <div className="relative group h-full">
      <div className="h-full flex flex-col rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cabeçalho do card com título e menu */}
        <div className="flex justify-between items-start p-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {document.title}
          </h3>
          
          {onDelete && (
            <div className="relative">
              <button 
                onClick={handleMenuToggle}
                className="ml-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Opções do documento"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </button>
              
              {/* Menu dropdown */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={closeMenu}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-20">
                    <div className="py-1">
                      <Link 
                        href={`/editor?id=${document.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <ArrowRightIcon className="mr-2 h-4 w-4" />
                        Abrir editor
                      </Link>
                      <button 
                        onClick={handleDeleteClick}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Excluir documento
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Corpo do card - clicável para abrir o editor */}
        <Link 
          href={`/editor?id=${document.id}`}
          className="flex-grow flex flex-col p-3"
        >
          {/* Informações em linha: colaboradores e data */}
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <UsersIcon className="mr-1 h-3.5 w-3.5" />
              <span>
                {document.collaborators_count > 0 
                  ? `${document.collaborators_count} colaborador${document.collaborators_count > 1 ? 'es' : ''}` 
                  : 'Somente você'}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Botão de abrir na parte inferior */}
          <div className="mt-3 flex justify-end">
            <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
              Abrir
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCancelDelete}>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <XIcon className="h-5 w-5" />
            </button>
            
            <div className="mb-5 flex items-center justify-center text-red-500">
              <AlertTriangleIcon className="h-10 w-10" />
            </div>
            
            <h3 className="mb-2 text-center text-lg font-medium text-gray-900 dark:text-white">
              Excluir documento
            </h3>
            
            <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
              Tem certeza que deseja excluir <span className="font-medium">{document.title}</span>? Esta ação não pode ser desfeita.
            </p>
            
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Excluindo...
                  </>
                ) : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 