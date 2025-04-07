'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditorPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Editor LaTeX</h1>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Código LaTeX</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700">
                <textarea
                  className="block w-full h-96 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md resize-none border-0 focus:ring-0 font-mono text-sm"
                  defaultValue={`\\documentclass{article}
\\title{Meu Documento}
\\author{Seu Nome}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introdução}
Aqui está um exemplo de documento LaTeX.

\\section{Métodos}
Você pode adicionar fórmulas como $E = mc^2$.

\\end{document}`}
                ></textarea>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Visualização</h2>
              <div className="border rounded-md border-gray-300 dark:border-gray-700 p-4 h-96 overflow-auto">
                <div className="mb-6 text-center border-b pb-4 border-gray-200 dark:border-gray-600">
                  <h3 className="text-2xl font-bold mb-2">Meu Documento</h3>
                  <p className="text-gray-600 dark:text-gray-400">Seu Nome</p>
                  <p className="text-gray-500 text-sm">Data Atual</p>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h4 className="text-xl font-bold">1 Introdução</h4>
                  <p>Aqui está um exemplo de documento LaTeX.</p>
                  
                  <h4 className="text-xl font-bold mt-4">2 Métodos</h4>
                  <p>Você pode adicionar fórmulas como E = mc<sup>2</sup>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 