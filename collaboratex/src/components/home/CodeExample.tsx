export default function CodeExample() {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          LaTeX simples e poderoso
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-lg bg-gray-900 p-4 shadow-xl">
            <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
              <code>
{`\\documentclass{article}
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
              </code>
            </pre>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8">
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
    </section>
  );
} 