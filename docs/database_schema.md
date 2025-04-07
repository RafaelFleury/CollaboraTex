# Schema do Banco de Dados - CollaboraTex

Este documento detalha o esquema do banco de dados do CollaboraTex, uma aplicação web para edição colaborativa de documentos LaTeX em tempo real.

## Tabelas Principais

### 1. `documents`

Armazena os documentos LaTeX criados pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `owner_id` | UUID | ID do proprietário do documento (referência a `auth.users.id`) |
| `name` | TEXT | Nome do documento |
| `content` | TEXT | Conteúdo do arquivo LaTeX |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data da última atualização |

### 2. `document_collaborators`

Gerencia o compartilhamento e as permissões de colaboradores.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `document_id` | UUID | ID do documento (referência a `documents.id`) |
| `user_id` | UUID | ID do usuário colaborador (referência a `auth.users.id`) |
| `permission` | TEXT | Tipo de permissão ('edit' por padrão) |
| `shared_at` | TIMESTAMPTZ | Data do compartilhamento |
| `can_share_anonymous` | BOOLEAN | Se o colaborador pode criar links anônimos |
| `can_share_with_users` | BOOLEAN | Se o colaborador pode compartilhar com outros usuários |

### 3. `project_files`

Armazena metadados de arquivos auxiliares (imagens, bibliografias, etc.).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `document_id` | UUID | ID do documento (referência a `documents.id`) |
| `file_name` | TEXT | Nome do arquivo (ex: logo.png, referencias.bib) |
| `storage_path` | TEXT | Caminho do arquivo no Supabase Storage |
| `uploaded_at` | TIMESTAMPTZ | Data do upload |
| `uploader_id` | UUID | ID do usuário que fez o upload (referência a `auth.users.id`) |

### 4. `anonymous_links`

Gerencia links anônimos para acesso sem autenticação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `document_id` | UUID | ID do documento (referência a `documents.id`) |
| `created_by` | UUID | ID do usuário que criou o link (referência a `auth.users.id`) |
| `permission` | TEXT | Tipo de permissão ('view' ou 'edit') |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `expires_at` | TIMESTAMPTZ | Data de expiração (opcional) |
| `is_active` | BOOLEAN | Se o link está ativo ou foi revogado |
| `access_token` | TEXT | Token de acesso único |

## Políticas de Segurança (RLS)

As seguintes políticas de Row Level Security (RLS) foram configuradas para garantir a segurança dos dados:

### Para a tabela `documents`:

- **Document owners have full access**: Proprietários têm controle total sobre seus documentos
- **Collaborators can read documents**: Colaboradores podem ler documentos compartilhados
- **Collaborators can update documents**: Colaboradores podem modificar documentos compartilhados

### Para a tabela `document_collaborators`:

- **Document owners can manage collaborators**: Proprietários podem gerenciar quem tem acesso aos seus documentos
- **Users can see their own collaborations**: Usuários podem ver documentos compartilhados com eles
- **Collaborators with permission can add other users**: Colaboradores com permissão específica podem compartilhar com outros usuários

### Para a tabela `project_files`:

- **Document owners have full access to files**: Proprietários têm controle total sobre arquivos
- **Collaborators can view files**: Colaboradores podem visualizar arquivos
- **Collaborators can upload files**: Colaboradores podem fazer upload de arquivos

### Para a tabela `anonymous_links`:

- **Document owners can manage anonymous links**: Proprietários podem gerenciar todos os links anônimos
- **Collaborators with permission can view anonymous links**: Colaboradores com permissão podem ver links anônimos
- **Collaborators with permission can create anonymous links**: Colaboradores com permissão podem criar links anônimos

## Funções Auxiliares

Foi criada a função `get_document_by_token` para facilitar a validação de tokens anônimos e recuperar os documentos associados:

```sql
CREATE OR REPLACE FUNCTION public.get_document_by_token(token TEXT)
RETURNS TABLE (
  document_id UUID,
  name TEXT,
  content TEXT,
  permission TEXT,
  is_valid BOOLEAN
)
```

Esta função é usada pela API para validar tokens anônimos e fornecer o nível apropriado de acesso ao documento.

## Relacionamentos

As tabelas estão relacionadas através de chaves estrangeiras, garantindo integridade referencial:

- `documents.owner_id` → `auth.users.id`
- `document_collaborators.document_id` → `documents.id`
- `document_collaborators.user_id` → `auth.users.id`
- `project_files.document_id` → `documents.id`
- `project_files.uploader_id` → `auth.users.id`
- `anonymous_links.document_id` → `documents.id`
- `anonymous_links.created_by` → `auth.users.id` 