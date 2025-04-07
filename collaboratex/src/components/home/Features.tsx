export default function Features() {
  return (
    <section id="features" className="py-16 px-6 md:px-12 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Recursos incríveis para sua produtividade acadêmica
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Colaboração em tempo real
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Trabalhe simultaneamente com colegas em um único documento, visualizando as alterações enquanto elas acontecem.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Visualização de PDF em tempo real
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize o resultado final em PDF enquanto edita seu código LaTeX, com atualizações instantâneas.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Editor inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete código LaTeX automaticamente, detecte erros de sintaxe e obtenha sugestões inteligentes enquanto digita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 