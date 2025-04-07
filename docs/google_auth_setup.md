# Configuração da Autenticação Google no CollaboraTex

Este documento detalha o processo de configuração da autenticação com Google no projeto CollaboraTex, desde a criação das credenciais no Google Cloud até a ativação do provedor no Supabase.

## 1. Criar Credenciais no Google Cloud Platform

### 1.1. Acesse o Console do Google Cloud

1. Navegue até [console.cloud.google.com](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um existente

### 1.2. Configurar a Tela de Consentimento OAuth

1. No menu lateral, navegue para **APIs e Serviços > Tela de consentimento OAuth**
2. Selecione o tipo de usuário (Externo ou Interno)
3. Preencha as informações necessárias:
   - Nome do aplicativo: `CollaboraTex`
   - Email de suporte do usuário: seu email
   - Logo (opcional): logo do CollaboraTex
   - Domínio autorizado: `iglmyhzcbemszfewchpt.supabase.co` (seu domínio do Supabase)
   - Informações de contato do desenvolvedor: seu email

### 1.3. Criar Credenciais OAuth

1. No menu lateral, navegue para **APIs e Serviços > Credenciais**
2. Clique em **Criar Credenciais > ID do Cliente OAuth**
3. Selecione o tipo de aplicativo: **Aplicativo da Web**
4. Nome: `CollaboraTex Web Client`
5. Origens JavaScript autorizadas:
   - `http://localhost:3000` (para desenvolvimento)
   - `https://collaboratex.vercel.app` (ou o domínio de produção)
6. URIs de redirecionamento autorizados:
   - `http://localhost:3000/auth/callback` (para desenvolvimento)
   - `https://iglmyhzcbemszfewchpt.supabase.co/auth/v1/callback` (para o Supabase)
   - `https://collaboratex.vercel.app/auth/callback` (ou seu domínio de produção)
7. Clique em **Criar**

Após a criação, você receberá um **Client ID** e um **Client Secret**. Guarde essas informações com segurança.

## 2. Configurar o Provedor Google no Supabase

### 2.1. Acesse o Dashboard do Supabase

1. Navegue até [app.supabase.io](https://app.supabase.io/)
2. Selecione o projeto `CollaboraTex` (ID: `iglmyhzcbemszfewchpt`)

### 2.2. Ativar o Provedor Google

1. No menu lateral, navegue para **Authentication > Providers**
2. Encontre **Google** na lista de provedores
3. Ative o toggle para habilitar o Google
4. Preencha os seguintes campos:
   - **Client ID**: Cole o Client ID obtido do Google Cloud
   - **Client Secret**: Cole o Client Secret obtido do Google Cloud
   - **Authorized Client Domains**: Adicione `localhost` e seu domínio de produção (ex: `collaboratex.vercel.app`)
5. Clique em **Salvar**

## 3. URL de Callback do Supabase

O URL de callback do Supabase para o Google OAuth é:

```
https://iglmyhzcbemszfewchpt.supabase.co/auth/v1/callback
```

### 3.1. Notas sobre a URL de Callback

- **Permanência do URL**: Este URL não muda enquanto seu projeto Supabase estiver ativo com o mesmo ID (`iglmyhzcbemszfewchpt`).

- **Em caso de mudança do ID do projeto**: Se você criar um novo projeto Supabase, o ID será diferente e, consequentemente, o URL de callback também mudará. Nesse caso, você precisará:
  1. Atualizar o URL de redirecionamento nas credenciais do Google Cloud
  2. Configurar o novo projeto Supabase com as mesmas credenciais

- **Verificando o URL atual**: Para confirmar o URL correto de callback a qualquer momento:
  1. Acesse o Dashboard do Supabase
  2. Vá para **Authentication > URL Configuration**
  3. Verifique a seção **Redirect URLs** onde você encontrará o URL base do seu projeto

## 4. Implementação no Código

### 4.1. Configuração do Cliente

Já implementamos no código do CollaboraTex:

- Hook `useAuth` com a função `signInWithGoogle`
- Botão de login com Google na interface de autenticação
- Rota de callback para processar a autenticação OAuth

### 4.2. Função de Login com Google

```typescript
const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { success: true };
    
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

### 4.3. Rota de Callback

Criamos uma rota `/auth/callback` no Next.js para processar o redirecionamento após a autenticação:

```typescript
// app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const response = NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name: string, options: any) {
            response.cookies.delete({
              name,
              ...options
            });
          },
        },
      }
    );
    
    await supabase.auth.exchangeCodeForSession(code);
    return response;
  }
  
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
```

## 5. Solução de Problemas

### 5.1. Erro: "Unsupported provider: provider is not enabled"

Se você encontrar o erro: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`, isso indica que o provedor Google não está ativado corretamente no Supabase.

**Solução**:
1. Verifique se o provedor Google está ativado no dashboard do Supabase
2. Confirme se o Client ID e Client Secret estão corretos
3. Verifique se o domínio do seu aplicativo está autorizado nas configurações do projeto do Google Cloud

### 5.2. Erro: "Invalid redirect URI"

Se o Google retornar um erro sobre URI de redirecionamento inválido:

**Solução**:
1. Verifique se o URL exato `https://iglmyhzcbemszfewchpt.supabase.co/auth/v1/callback` está adicionado na lista de URIs de redirecionamento autorizados no console do Google Cloud
2. O URL é sensível a maiúsculas/minúsculas e deve ser exatamente igual

### 5.3. Erro: "Error in the callback"

Se o processo de callback falhar:

**Solução**:
1. Verifique os logs do servidor para identificar o problema específico
2. Confirme se o código para trocar o código de autorização por um token está implementado corretamente
3. Verifique se todas as variáveis de ambiente necessárias estão configuradas

## 6. Segurança e Boas Práticas

1. **Nunca compartilhe** o Client Secret do Google em código público ou repositórios
2. Mantenha as credenciais OAuth como variáveis de ambiente
3. Implemente validação de estado para evitar ataques CSRF durante o fluxo OAuth
4. Configure corretamente a verificação de domínio para aumentar a segurança
5. Considere adicionar verificação de email para garantir que apenas usuários de domínios específicos possam se registrar (para aplicações corporativas)

---

Documento criado em 07/04/2025 para o projeto CollaboraTex. 