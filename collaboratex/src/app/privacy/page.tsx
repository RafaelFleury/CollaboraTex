import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade - CollaboraTex',
  description: 'Política de Privacidade do CollaboraTex',
};

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introdução</h2>
          <p>
            A sua privacidade é importante para nós. É política do CollaboraTex respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar neste site.
          </p>
          
          <h2>2. Informações que coletamos</h2>
          <p>
            Coletamos informações pessoais quando você:
          </p>
          <ul>
            <li>Cria uma conta (nome, e-mail, senha)</li>
            <li>Utiliza nossos serviços (documentos LaTeX criados, informações de colaboração)</li>
            <li>Entra em contato com nosso suporte</li>
          </ul>
          <p>
            Também coletamos automaticamente informações como endereço IP, tipo de navegador, páginas visitadas e horários de acesso.
          </p>
          
          <h2>3. Como usamos suas informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer, manter e melhorar nossos serviços</li>
            <li>Criar e gerenciar sua conta</li>
            <li>Processar suas transações</li>
            <li>Comunicar-nos com você sobre atualizações, recursos e ofertas</li>
            <li>Detectar e prevenir atividades fraudulentas</li>
          </ul>
          
          <h2>4. Compartilhamento de informações</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
          </p>
          <ul>
            <li>Com seu consentimento explícito</li>
            <li>Para cumprir requisitos legais</li>
            <li>Com prestadores de serviços que trabalham em nosso nome</li>
          </ul>
          
          <h2>5. Cookies e tecnologias semelhantes</h2>
          <p>
            Usamos cookies e tecnologias semelhantes para lembrar suas preferências, entender como você usa nosso site e oferecer uma experiência personalizada.
          </p>
          
          <h2>6. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações pessoais. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir sua segurança absoluta.
          </p>
          
          <h2>7. Retenção de dados</h2>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para fornecer os serviços solicitados e cumprir nossas obrigações legais.
          </p>
          
          <h2>8. Seus direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar, corrigir ou excluir seus dados pessoais</li>
            <li>Restringir ou opor-se ao processamento de seus dados</li>
            <li>Receber seus dados em formato portátil</li>
            <li>Retirar o consentimento a qualquer momento</li>
          </ul>
          
          <h2>9. Alterações nesta política</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente. Recomendamos verificá-la regularmente para estar ciente de quaisquer mudanças.
          </p>
          
          <h2>10. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: privacy@collaboratex.com
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