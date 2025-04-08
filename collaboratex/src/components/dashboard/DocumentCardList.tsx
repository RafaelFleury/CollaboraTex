"use client";

import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon, MoreVerticalIcon, UsersIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { DocumentData } from './types';
import { t, defaultLanguage } from '@/lib/i18n';

interface DocumentCardListProps {
  document: DocumentData;
  showMenu: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  closeMenu: () => void;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onEditTitle?: (id: string, newTitle: string) => Promise<{ success: boolean; error?: string }>;
}

export default function DocumentCardList({
  document,
  showMenu,
  onMenuToggle,
  onEditClick,
  onDeleteClick,
  closeMenu,
  onDelete,
  onEditTitle
}: DocumentCardListProps) {
  // Format the edit date
  const locale = defaultLanguage.startsWith('pt') ? ptBR : enUS;
  const formattedDate = formatDistanceToNow(new Date(document.updated_at), {
    addSuffix: true,
    locale: locale
  });

  return (
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
                  ? `${document.collaborators_count} ${document.collaborators_count > 1 
                      ? t.documents.collaborators.multiplePlural 
                      : t.documents.collaborators.multiple}` 
                  : t.documents.collaborators.onlyYou}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        <span className="inline-flex items-center ml-4 text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
          {t.documents.actions.open}
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </span>
      </Link>
      
      {(onDelete || onEditTitle) && (
        <div className="relative px-3 border-l border-gray-200 dark:border-gray-700 flex items-center">
          <button 
            onClick={onMenuToggle}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label={t.documents.actions.open}
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
              <div className="absolute right-0 top-full mt-1 mr-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-20">
                <div className="py-1">
                  <Link 
                    href={`/editor?id=${document.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    {t.documents.actions.openEditor}
                  </Link>
                  
                  {/* Edit title option */}
                  {onEditTitle && (
                    <button 
                      onClick={onEditClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <PencilIcon className="mr-2 h-4 w-4" />
                      {t.documents.actions.editTitle}
                    </button>
                  )}
                  
                  {/* Delete option */}
                  {onDelete && (
                    <button 
                      onClick={onDeleteClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      {t.documents.actions.delete}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 