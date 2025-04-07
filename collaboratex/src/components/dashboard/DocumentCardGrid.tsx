"use client";

import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon, MoreVerticalIcon, UsersIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DocumentData } from './types';

interface DocumentCardGridProps {
  document: DocumentData;
  showMenu: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  closeMenu: () => void;
  onEditTitle?: (id: string, newTitle: string) => Promise<{ success: boolean; error?: string }>;
}

export default function DocumentCardGrid({
  document,
  showMenu,
  onMenuToggle,
  onEditClick,
  onDeleteClick,
  closeMenu,
  onEditTitle
}: DocumentCardGridProps) {
  // Formatar a data de edição
  const formattedDate = formatDistanceToNow(new Date(document.updated_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className="h-full flex flex-col rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700">
      {/* Cabeçalho do card com título e menu */}
      <div className="flex justify-between items-start p-3 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {document.title}
        </h3>
        
        {onEditTitle && (
          <div className="relative">
            <button 
              onClick={onMenuToggle}
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
                      onClick={closeMenu}
                    >
                      <ArrowRightIcon className="mr-2 h-4 w-4" />
                      Abrir editor
                    </Link>
                    
                    {/* Opção de editar título */}
                    {onEditTitle && (
                      <button 
                        onClick={onEditClick}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Editar título
                      </button>
                    )}
                    
                    {/* Opção de excluir */}
                    <button 
                      onClick={onDeleteClick}
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
  );
} 