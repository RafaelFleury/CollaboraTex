import Link from 'next/link';

export const metadata = {
  title: 'Termos de Serviço - CollaboraTex',
  description: 'Termos de Serviço do CollaboraTex',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            CollaboraTex
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Voltar ao Início
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Termos de Serviço
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Termos</h2>
          <p>
            Ao acessar o site CollaboraTex, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
          </p>
          
          <h2>2. Uso da Licença</h2>
          <p>
            É concedida permissão para usar temporariamente o CollaboraTex para uso pessoal, não comercial ou comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:
          </p>
          <ul>
            <li>modificar ou copiar os materiais;</li>
            <li>usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
            <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no CollaboraTex;</li>
            <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
            <li>transferir os materiais para outra pessoa ou "espelhar" os materiais em qualquer outro servidor.</li>
          </ul>
          
          <h2>3. Isenção de responsabilidade</h2>
          <p>
            Os materiais no CollaboraTex são fornecidos "como estão". CollaboraTex não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.
          </p>
          
          <h2>4. Limitações</h2>
          <p>
            Em nenhum caso o CollaboraTex ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no CollaboraTex, mesmo que CollaboraTex ou um representante autorizado da CollaboraTex tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
          </p>
          
          <h2>5. Revisões e erros</h2>
          <p>
            Os materiais exibidos no site da CollaboraTex podem incluir erros técnicos, tipográficos ou fotográficos. CollaboraTex não garante que qualquer material em seu site seja preciso, completo ou atual. CollaboraTex pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
          </p>
          
          <h2>6. Links</h2>
          <p>
            O CollaboraTex não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por CollaboraTex do site. O uso de qualquer site vinculado é por conta e risco do usuário.
          </p>
          
          <h2>7. Modificações dos Termos de Serviço</h2>
          <p>
            O CollaboraTex pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
          </p>
          
          <h2>8. Lei aplicável</h2>
          <p>
            Estes termos e condições são regidos e interpretados de acordo com as leis brasileiras e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
          </p>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CollaboraTex. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
} 