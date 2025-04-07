"use client";

import { XIcon } from 'lucide-react';
import { EditTitleModalProps } from './types';

export default function EditTitleModal({ 
  document, 
  isOpen, 
  isEditing, 
  newTitle, 
  error, 
  onClose, 
  onConfirm,
  onTitleChange
}: EditTitleModalProps) {
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
        
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Editar Título do Documento
        </h3>
        
        <form onSubmit={onConfirm}>
          <div className="mb-4">
            <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Novo título
            </label>
            <input
              type="text"
              id="documentTitle"
              name="documentTitle"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isEditing}
            />
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isEditing}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isEditing || !newTitle.trim() || newTitle.trim() === document.title}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex items-center"
            >
              {isEditing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 