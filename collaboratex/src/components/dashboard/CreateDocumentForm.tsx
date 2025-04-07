"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDocumentSchema, CreateDocumentFormValues } from '@/lib/schemas/document';

interface CreateDocumentFormProps {
  onCancel: () => void;
  onSubmit: (title: string) => Promise<{ success: boolean; documentId?: string; error?: string }>;
}

export default function CreateDocumentForm({ onCancel, onSubmit }: CreateDocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Usando react-hook-form com validação zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDocumentFormValues>({
    resolver: zodResolver(createDocumentSchema),
    mode: 'onBlur',
  });

  const onFormSubmit = async (data: CreateDocumentFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await onSubmit(data.title.trim());
      
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Título do documento
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`block w-full rounded-md border ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} px-3 py-2 shadow-sm focus:outline-none focus:ring-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              placeholder="Digite o título do seu documento"
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="title-error">
              {errors.title.message}
            </p>
          )}
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