# Schema do Banco de Dados - CollaboraTex

Este documento detalha o esquema do banco de dados do CollaboraTex, uma aplicação web para edição colaborativa de documentos LaTeX em tempo real. O esquema foi atualizado para incluir otimizações de segurança e performance.

## Tabelas Principais

### 1. `documents`

Armazena os documentos LaTeX criados pelos usuários.

| Coluna | Tipo | Descrição | Constraints | Índice |
|--------|------|-----------|-------------|--------|
| `id` | UUID | Chave primária | PRIMARY KEY | - |
| `owner_id` | UUID | ID do proprietário do documento (referência a `auth.users.id`) | FOREIGN KEY | `idx_documents_owner_id` |
| `title` | TEXT | Nome (Título) do documento | NOT NULL | - |
| `content` | TEXT | Conteúdo do arquivo LaTeX | - | - |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT now() | - |
| `updated_at` | TIMESTAMPTZ | Data da última atualização | DEFAULT now() | - |

### 2. `document_collaborators`

Gerencia o compartilhamento e as permissões de colaboradores.

| Coluna | Tipo | Descrição | Constraints | Índice |
|--------|------|-----------|-------------|--------|
| `id` | UUID | Chave primária | PRIMARY KEY | - |
| `document_id` | UUID | ID do documento (referência a `documents.id`) | FOREIGN KEY (ON DELETE CASCADE) | `idx_doc_collab_doc_id` |
| `user_id` | UUID | ID do usuário colaborador (referência a `auth.users.id`) | FOREIGN KEY | `idx_doc_collab_user_id` |
| `permission` | TEXT | Tipo de permissão ('edit' por padrão) | DEFAULT 'edit' | - |
| `shared_at` | TIMESTAMPTZ | Data do compartilhamento | DEFAULT now() | - |
| `can_share_anonymous` | BOOLEAN | Se o colaborador pode criar links anônimos | DEFAULT false | - |
| `can_share_with_users` | BOOLEAN | Se o colaborador pode compartilhar com outros usuários | DEFAULT false | - |

### 3. `project_files`

Armazena metadados de arquivos auxiliares (imagens, bibliografias, etc.).

| Coluna | Tipo | Descrição | Constraints | Índice |
|--------|------|-----------|-------------|--------|
| `id` | UUID | Chave primária | PRIMARY KEY | - |
| `document_id` | UUID | ID do documento (referência a `documents.id`) | FOREIGN KEY (ON DELETE CASCADE) | `idx_project_files_doc_id` |
| `file_name` | TEXT | Nome do arquivo (ex: logo.png, referencias.bib) | NOT NULL | - |
| `storage_path` | TEXT | Caminho do arquivo no Supabase Storage | NOT NULL | - |
| `uploaded_at` | TIMESTAMPTZ | Data do upload | DEFAULT now() | - |
| `uploader_id` | UUID | ID do usuário que fez o upload (referência a `auth.users.id`) | FOREIGN KEY | - |

### 4. `anonymous_links`

Gerencia links anônimos para acesso sem autenticação.

| Coluna | Tipo | Descrição | Constraints | Índice |
|--------|------|-----------|-------------|--------|
| `id` | UUID | Chave primária | PRIMARY KEY | - |
| `document_id` | UUID | ID do documento (referência a `documents.id`) | FOREIGN KEY (ON DELETE CASCADE) | `idx_anon_links_doc_id` |
| `created_by` | UUID | ID do usuário que criou o link (referência a `auth.users.id`) | FOREIGN KEY | - |
| `permission` | TEXT | Tipo de permissão ('view' ou 'edit') | NOT NULL | - |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT now() | - |
| `expires_at` | TIMESTAMPTZ | Data de expiração (opcional) | - | - |
| `is_active` | BOOLEAN | Se o link está ativo ou foi revogado | DEFAULT true | - |
| `access_token` | TEXT | Token de acesso único | NOT NULL | `idx_anon_links_access_token` (UNIQUE) |

## Políticas de Segurança (RLS) - Revisado

As políticas de Row Level Security (RLS) garantem que os usuários só acessem os dados permitidos.

### Para a tabela `documents`:

- **Document owners have full access**: Proprietários têm controle total sobre seus documentos (`owner_id = auth.uid()`).
- **Users can read owned or shared documents**: Usuários autenticados podem ler documentos se forem proprietários ou colaboradores (verificado via função `public.is_collaborator(id)`).
- **Collaborators can update documents**: Colaboradores podem modificar documentos compartilhados (necessário verificar a permissão específica, não apenas a existência de colaboração - *Ponto a melhorar/detalhar*).

### Para a tabela `document_collaborators`:

- **Document owners can manage collaborators**: Proprietários podem gerenciar (SELECT, INSERT, UPDATE, DELETE) todas as entradas de colaboração para seus documentos (`EXISTS (SELECT 1 FROM documents d WHERE d.id = document_id AND d.owner_id = auth.uid())`).
- **Users see own collaborations, owners see all for their docs**: Usuários autenticados podem ler (SELECT) suas próprias entradas de colaboração ou todas as entradas dos documentos que possuem (`user_id = auth.uid() OR document_id IN (SELECT id FROM documents WHERE owner_id = auth.uid())`).
- **Collaborators with permission can add other users**: Colaboradores com `can_share_with_users = true` podem inserir novas entradas de colaboração (requer política INSERT/UPDATE específica - *Ponto a melhorar/detalhar*).

### Para a tabela `project_files`:

- **Document owners have full access**: Proprietários têm controle total.
- **Collaborators can view/upload files**: Colaboradores podem visualizar e fazer upload (requer políticas específicas verificando colaboração).

### Para a tabela `anonymous_links`:

- **Document owners can manage anonymous links**: Proprietários podem gerenciar todos os links anônimos dos seus documentos.
- **Collaborators with permission can manage anonymous links**: Colaboradores com `can_share_anonymous = true` podem criar/ver/revogar links (requer políticas específicas).

**Nota:** Algumas políticas de escrita (UPDATE, INSERT, DELETE) e compartilhamento granular precisam ser detalhadas e implementadas conforme a evolução das funcionalidades.

## Funções Auxiliares (SECURITY DEFINER, search_path = public)

Funções otimizadas e seguras são usadas para lógica comum e verificações de RLS.

- **`public.is_collaborator(doc_id uuid) RETURNS boolean`**: Verifica se o usuário autenticado (`auth.uid()`) é um colaborador ativo do documento `doc_id`. Usada na RLS de `documents`.
- **`public.validate_anonymous_link(p_access_token text) RETURNS TABLE(...)`**: Valida um token de acesso anônimo, retornando `document_id`, `permission` e `is_valid`. Usada para verificar acesso via link.
- **`public.get_document_by_token(token text) RETURNS TABLE(...)`**: Recupera detalhes do documento (`id`, `name`, `content`), `permission` e `is_valid` com base em um token anônimo válido. Usada pela API para acesso anônimo.

## Relacionamentos e Integridade

As tabelas estão relacionadas através de chaves estrangeiras:

- `documents.owner_id` → `auth.users.id`
- `document_collaborators.document_id` → `documents.id` (**ON DELETE CASCADE**)
- `document_collaborators.user_id` → `auth.users.id`
- `project_files.document_id` → `documents.id` (**ON DELETE CASCADE**)
- `project_files.uploader_id` → `auth.users.id`
- `anonymous_links.document_id` → `documents.id` (**ON DELETE CASCADE**)
- `anonymous_links.created_by` → `auth.users.id`

A opção `ON DELETE CASCADE` garante que ao excluir um documento, todas as suas colaborações, arquivos e links anônimos relacionados são automaticamente removidos.

## Índices para Performance

- `idx_documents_owner_id` em `documents(owner_id)`
- `idx_doc_collab_doc_id` em `document_collaborators(document_id)`
- `idx_doc_collab_user_id` em `document_collaborators(user_id)`
- `idx_project_files_doc_id` em `project_files(document_id)`
- `idx_anon_links_doc_id` em `anonymous_links(document_id)`
- `idx_anon_links_access_token` (UNIQUE) em `anonymous_links(access_token)`

Estes índices aceleram consultas comuns baseadas em IDs de usuário, documento e tokens. 