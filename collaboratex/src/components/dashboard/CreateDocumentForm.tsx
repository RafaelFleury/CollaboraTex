"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateDocumentFormProps {
  onCancel: () => void;
  onSubmit: (title: string) => Promise<{ success: boolean; documentId?: string; error?: string }>;
}

export default function CreateDocumentForm({ onCancel, onSubmit }: CreateDocumentFormProps) {
  const [newDocTitle, setNewDocTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocTitle.trim()) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const result = await onSubmit(newDocTitle.trim());
        
        if (result.success && result.documentId) {
          // Se for bem-sucedido e tivermos um ID, redirecionar para o editor
          router.push(`/editor?id=${result.documentId}`);
        } else if (!result.success) {
          // Se houver erro, exibir mensagem
          setError(result.error || 'Erro ao criar documento');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao criar documento');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Criar novo documento
      </h3>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
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
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
} 