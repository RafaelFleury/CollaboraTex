"use client";

import { XIcon, AlertTriangleIcon } from 'lucide-react';
import { DeleteModalProps } from './types';

export default function DeleteDocumentModal({ 
  document, 
  isOpen, 
  isDeleting, 
  error, 
  onClose, 
  onConfirm 
}: DeleteModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
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
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
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
  );
} 