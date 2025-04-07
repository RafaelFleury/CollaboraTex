# PRD: Editor Colaborativo de LaTeX Online ("CollaboraTeX")

## 1. Visão Geral

Este documento descreve os requisitos para o "CollaboraTeX", uma aplicação web projetada para ser uma alternativa simplificada e gratuita ao Overleaf, focada na colaboração em tempo real para edição de documentos LaTeX.

**Problema:** Plataformas existentes como o Overleaf limitam o número de colaboradores em seus planos gratuitos. Isso cria uma barreira para estudantes, pesquisadores e pequenas equipes que precisam colaborar em documentos LaTeX sem incorrer em custos.

**Solução Proposta:** Uma aplicação web que permite a múltiplos usuários registrados editar o mesmo documento `.tex` simultaneamente, com uma visualização do PDF compilado quase em tempo real. A aplicação utiliza Next.js para o frontend, Supabase para backend (autenticação, banco de dados) e um serviço Dockerizado separado para a compilação segura de LaTeX. Um requisito chave é permitir que os usuários copiem facilmente o código fonte LaTeX para colar em outras plataformas como o Overleaf, garantindo compatibilidade básica.

**Público Alvo:** Estudantes, pesquisadores, pequenas equipes e qualquer pessoa que precise de uma ferramenta de colaboração LaTeX gratuita e simples.

## 2. Objetivos (Goals)

* [x] Fornecer uma plataforma gratuita para edição colaborativa de documentos LaTeX.
* [ ] Permitir edição simultânea do mesmo arquivo `.tex` por múltiplos usuários.
* [ ] Exibir uma pré-visualização do PDF compilado que atualiza rapidamente após a compilação.
* [ ] Facilitar a portabilidade do código fonte LaTeX (copiar/colar) para outras plataformas (ex: Overleaf).
* [x] Implementar um sistema seguro de contas de usuário e gerenciamento de documentos/permissões.
* [x] Utilizar uma stack tecnológica moderna e escalável (Next.js, Supabase, Docker).

## 3. Não-Objetivos (Non-Goals)

* [ ] Atingir paridade total de funcionalidades com o Overleaf (ex: histórico detalhado, templates complexos, integração Git nativa, múltiplos arquivos por projeto na v1).
* [ ] Gerenciador visual de pacotes LaTeX dentro da aplicação.
* [ ] Funcionalidades avançadas de controle de versão além do salvamento e colaboração básica.
* [ ] Suporte para compilação de formatos além de PDF (ex: DVI).

## 4. Personas de Usuário

* **Estudante:** Precisa trabalhar em grupo em relatórios ou trabalhos acadêmicos em LaTeX, sem custo.
* **Pesquisador Jovem:** Co-autorando artigos científicos com colegas, precisa de um ambiente compartilhado simples.
* **Pequena Equipe:** Necessita colaborar ocasionalmente em documentação técnica em LaTeX.

## 5. Requisitos Funcionais

### 5.1. Autenticação e Gerenciamento de Usuários (Supabase)

* [x] **RF01:** Permitir que novos usuários se registrem usando Email e Senha.
* [x] **RF02:** Permitir que usuários existentes façam login com Email e Senha.
* [ ] **RF03:** Permitir que usuários façam login/registro usando conta Google (OAuth).
* [x] **RF04:** Permitir que usuários façam logout da aplicação.
* [x] **RF05:** Manter a sessão do usuário ativa (lembrar login).
* [ ] **RF06:** (Opcional v1) Funcionalidade de "Esqueci minha senha".

### 5.2. Gerenciamento de Documentos (Supabase + Next.js)

* [ ] **RF07:** Permitir que usuários criem novos documentos/projetos LaTeX (inicialmente, pode ser um único arquivo `.tex` por projeto).
* [~] **RF08:** Listar os documentos que pertencem ao usuário logado em um dashboard.
* [ ] **RF09:** Permitir renomear um documento.
* [ ] **RF10:** Permitir excluir um documento (com confirmação).
* [ ] **RF11:** Permitir que o dono de um documento o compartilhe com outros usuários registrados (por email).
* [ ] **RF12:** Definir permissão de "Edição" ao compartilhar (inicialmente, todos compartilhados podem editar).
* [ ] **RF13:** Listar documentos compartilhados com o usuário no dashboard.

### 5.3. Edição de LaTeX (Next.js + Monaco)

* [ ] **RF14:** Apresentar uma área de edição de texto rica para código LaTeX.
* [ ] **RF15:** Implementar Syntax Highlighting (coloração de sintaxe) para LaTeX.
* [ ] **RF16:** Salvar automaticamente ou manualmente o conteúdo do editor no banco de dados (Supabase).
* [ ] **RF17:** Carregar o conteúdo do documento `.tex` do banco de dados ao abri-lo.
* [ ] **RF18:** Botão/Funcionalidade para copiar facilmente todo o conteúdo do `.tex` para a área de transferência.

### 5.4. Compilação e Visualização de PDF (Next.js + Serviço Docker + PDF.js)

* [ ] **RF19:** Botão "Compilar" visível na interface de edição.
* [ ] **RF20:** Ao clicar em "Compilar", enviar o conteúdo atual do `.tex` para um serviço backend de compilação.
* [ ] **RF21:** Serviço de compilação (rodando em Docker) deve usar `pdflatex` para gerar um PDF a partir do `.tex` recebido.
* [ ] **RF22:** O serviço de compilação deve retornar o arquivo PDF gerado ou uma lista de erros/logs de compilação.
* [ ] **RF23:** Exibir o PDF resultante em um painel adjacente ao editor de código.
* [ ] **RF24:** Se a compilação falhar, exibir os erros/logs de forma clara para o usuário no frontend.
* [ ] **RF25:** Permitir upload de arquivos adicionais (`.png`, `.jpg`, `.bib`) associados ao projeto e armazená-los no Supabase Storage.
* [ ] **RF26:** Durante a compilação, rodar automaticamente `bibtex` se o projeto possuir um arquivo `.bib`, garantindo suporte a bibliografias.

### 5.5. Colaboração em Tempo Real (Next.js + Supabase/WebSockets + Yjs)

* [ ] **RF27:** Permitir que múltiplos usuários (com permissão) abram o mesmo documento simultaneamente.
* [ ] **RF28:** Modificações feitas por um usuário no editor de `.tex` devem ser refletidas nas telas dos outros colaboradores em tempo real (ou quase).
* [ ] **RF29:** Garantir a sincronização e a consistência do documento entre todos os colaboradores ativos.
* [ ] **RF30:** (Opcional v1, Nice-to-have) Mostrar cursores ou seleções de texto dos outros colaboradores ativos.

### **5.6. Acesso Anônimo (Nice-to-have para MVP)**

* [ ] **RF31:** Permitir que o dono de um documento gere um link de acesso anônimo (sem login).
* [ ] **RF32:** Usuários com link anônimo podem visualizar e/ou editar o documento, conforme a permissão atribuída.
* [ ] **RF33:** Permitir ao dono do documento revogar ou expirar manualmente esses links.

## 6. Requisitos Não-Funcionais

* [ ] **RNF01 (Segurança):** 
  * **Compilação Isolada**: A compilação LaTeX deve ocorrer em ambiente Docker altamente restrito e isolado, seguindo o princípio de defesa em profundidade. 
  * **Proteção contra execução de código malicioso**: Desativação de `\write18` e shell escape, execução com usuário não-privilegiado, e sistema de arquivos montado como somente leitura.
  * **Limites de recursos**: Impor limites rigorosos de CPU, memória e tempo de execução para evitar ataques de negação de serviço.
  * **Isolamento de rede**: Containers sem acesso à rede externa.
  * **Containeres efêmeros**: Cada compilação deve ocorrer em uma instância isolada e descartável.
  * **Segurança de dados**: Implementar Row Level Security (RLS) no Supabase para garantir que usuários só acessem seus próprios dados/documentos permitidos.
  * **Comunicação segura**: Usar HTTPS em toda a comunicação cliente-servidor.
  * Documentação detalhada sobre a implementação de segurança em `docs/docker_security.md`.

* [x] **RNF02 (Usabilidade):** A interface deve ser limpa, intuitiva e seguir padrões conhecidos de editores online (layout de dois painéis).
* [ ] **RNF03 (Desempenho):** A edição colaborativa deve ser fluida. A compilação de documentos simples/médios deve ocorrer em poucos segundos. O carregamento inicial da aplicação deve ser rápido.
* [ ] **RNF04 (Confiabilidade):** O sistema deve salvar o trabalho do usuário de forma confiável. A sincronização em tempo real deve minimizar a chance de conflitos ou perda de dados.
* [ ] **RNF05 (Escalabilidade):** A arquitetura (especialmente o serviço de compilação) deve ser pensada para permitir escalar horizontalmente se necessário (rodar múltiplas instâncias do container Docker).

## 7. Design e UX

* [x] Layout moderno e responsivo usando Tailwind CSS
* [x] Tema claro/escuro com alternância automática
* [x] Dashboard intuitivo para gerenciamento de documentos
* [ ] Layout principal com editor de código à esquerda e visualizador de PDF à direita
* [ ] Barra de ferramentas superior com ações: Salvar, Compilar, Compartilhar, Copiar Fonte
* [ ] Feedback visual claro sobre o estado da compilação (em andamento, sucesso, erro)

## 8. Status Atual do Projeto

### Implementado (Fase 1 - Concluída):
* [x] **Sistema de Autenticação**: Registro, login e logout usando Supabase
* [~] **Gerenciamento de Usuários**: Sessão persistente, autenticação por email/senha e OAuth
* [x] **Interface Principal**: Dashboard, navegação responsiva, tema claro/escuro
* [~] **Criação de Documentos**: Formulário para criar novos documentos
* [x] **Estrutura Modular**: Componentes React organizados e reutilizáveis

### Em Desenvolvimento (Fase 2):
* [ ] **Editor LaTeX**: Implementação do Monaco Editor com syntax highlighting
* [ ] **Salvamento de Documentos**: Persistência de dados no Supabase

### Próximas Etapas:
* [ ] **Compilação LaTeX**: Serviço Docker seguro para compilação de LaTeX em PDF
* [ ] **Visualização de PDF**: Exibição do PDF compilado
* [ ] **Colaboração em Tempo Real**: Edição simultânea usando Yjs

## 9. Roadmap Atualizado

### 🔹 Fase 1: Fundamentos (Autenticação + Dashboard) - ✅ CONCLUÍDO
- [x] Setup do projeto (Next.js + Tailwind + Supabase SDK)
- [x] RF01 a RF05: Autenticação (Email/Senha + Google OAuth)
- [x] Estrutura de navegação e layout principal
- [x] RF07 a RF08: Criação de documentos e dashboard

### 🔹 Fase 2: Edição de Texto (.tex) - 🔄 EM PROGRESSO
- [ ] Integração do Monaco Editor
- [ ] Configuração de syntax highlighting para LaTeX
- [ ] RF14 a RF17: Editor funcional com salvamento no Supabase

### 🔹 Fase 3: Gerenciamento de Documentos - ⏳ PENDENTE
- [ ] RF09 a RF10: Renomear e excluir documentos
- [ ] RF11 a RF13: Compartilhamento e permissões

### 🔹 Fase 4: Compilação LaTeX - ⏳ PENDENTE
- [ ] Implementar arquitetura de compilação segura com Docker
- [ ] API para comunicação com o serviço de compilação
- [ ] RF19 a RF24: Interface para compilação e visualização de PDF

### 🔹 Fase 5: Colaboração em Tempo Real - ⏳ PENDENTE
- [ ] Integração do Yjs com Monaco Editor
- [ ] RF27 a RF29: Sincronização em tempo real

### 🔹 Fase 6: Funcionalidades Complementares - ⏳ PENDENTE
- [ ] RF18: Botão "Copiar Fonte"
- [ ] RF25 e RF26: Upload de arquivos adicionais
- [ ] RF31 a RF33: Acesso anônimo via link compartilhável

### 🔹 Fase 7: Otimização e Segurança - ⏳ PENDENTE
- [ ] RNF01: Segurança da sandbox Docker e RLS no Supabase
- [ ] RNF03 a RNF05: Otimizações de performance e escalabilidade

## 10. Considerações Futuras

* Histórico de versões e capacidade de reverter alterações
* Suporte a projetos com múltiplos arquivos (`.tex`, `.cls`, imagens, etc.)
* Templates de documentos
* Chat integrado para colaboradores
* Suporte a outros compiladores (XeLaTeX, LuaLaTeX)
* Melhorias na gestão de erros de compilação
* Integração Git (opcional)
