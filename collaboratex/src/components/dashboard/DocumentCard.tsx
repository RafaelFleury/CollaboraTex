"use client";

import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';

// Interface para definir a estrutura dos dados do documento
export interface DocumentData {
  id: string;
  title: string;
  lastEdited: string;
  collaborators: number;
}

interface DocumentCardProps {
  document: DocumentData;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link 
      href={`/editor/${document.id}`} 
      className="group flex flex-col h-full rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {document.title}
        </h3>
        <div className="ml-2 flex-shrink-0">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {document.collaborators > 0 
              ? `${document.collaborators} colaborador${document.collaborators > 1 ? 'es' : ''}` 
              : 'Somente você'}
          </span>
        </div>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <CalendarIcon className="mr-1.5 h-4 w-4" />
          Última edição: {document.lastEdited}
        </div>
        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 group-hover:underline">
          Abrir
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
} 