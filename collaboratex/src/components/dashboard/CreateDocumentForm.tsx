"use client";

import { useState } from 'react';
import { DocumentData } from './DocumentCard';

interface CreateDocumentFormProps {
  onCancel: () => void;
  onSubmit: (newDocument: Omit<DocumentData, 'id'>) => void;
}

export default function CreateDocumentForm({ onCancel, onSubmit }: CreateDocumentFormProps) {
  const [newDocTitle, setNewDocTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocTitle.trim()) {
      onSubmit({
        title: newDocTitle.trim(),
        lastEdited: new Date().toISOString().split('T')[0],
        collaborators: 0,
      });
      setNewDocTitle('');
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Criar novo documento
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Título do documento
          </label>
          <input
            type="text"
            id="title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Digite o título do seu documento"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Criar
          </button>
        </div>
      </form>
    </div>
  );
} 