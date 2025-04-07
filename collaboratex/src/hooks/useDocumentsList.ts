'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface SupabaseDocument {
  id: string;
  title: string;
  content: any;
  created_at: string;
  updated_at: string;
  owner_id: string;
  is_public: boolean;
}

export interface DocumentListItem {
  id: string;
  title: string;
  content?: any;
  created_at: string;
  updated_at: string;
  owner_id: string;
  is_public: boolean;
  collaborators_count?: number;
}

export function useDocumentsList() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  
  const fetchDocuments = async () => {
    // Não tente carregar documentos se não estivermos logados
    if (!isLoggedIn || !user) {
      setDocuments([]);
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar a sessão atual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Sessão de autenticação não encontrada');
      }
      
      // Buscar os documentos que o usuário é proprietário
      const { data: ownedDocs, error: ownedDocsError } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (ownedDocsError) {
        throw new Error(ownedDocsError.message);
      }
      
      // Formatar os documentos para a exibição
      const formattedDocs = ownedDocs.map((doc: SupabaseDocument) => ({
        id: doc.id,
        title: doc.title,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        owner_id: doc.owner_id,
        is_public: doc.is_public,
        // Como ainda não temos a contagem real, vamos simular aleatoriamente para teste
        collaborators_count: Math.floor(Math.random() * 3)
      }));
      
      setDocuments(formattedDocs);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar documentos quando o componente montar e o usuário estiver autenticado
  useEffect(() => {
    // Apenas carregue documentos quando a autenticação não estiver carregando
    // e o usuário estiver logado
    if (!authLoading && isLoggedIn && user) {
      fetchDocuments();
    }
  }, [authLoading, isLoggedIn, user]);
  
  // Função para criar novo documento
  const createDocument = async (title: string) => {
    // Não tente criar um documento se não estivermos logados
    if (!isLoggedIn || !user) {
      return { 
        success: false, 
        error: 'Usuário não autenticado' 
      };
    }
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Sessão de autenticação não encontrada');
      }
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title,
          content: '',
          owner_id: user.id,
          is_public: false
        })
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        // Recarregar a lista de documentos
        await fetchDocuments();
        return { success: true, documentId: data[0].id };
      }
      
      return { success: false, error: 'Falha ao criar documento' };
    } catch (err) {
      console.error('Erro ao criar documento:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao criar documento' 
      };
    }
  };

  // Função para deletar um documento
  const deleteDocument = async (documentId: string) => {
    // Não tente deletar um documento se não estivermos logados
    if (!isLoggedIn || !user) {
      return { 
        success: false, 
        error: 'Usuário não autenticado' 
      };
    }
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Sessão de autenticação não encontrada');
      }
      
      // Verificar se o usuário é o dono do documento
      const { data: docCheck, error: docCheckError } = await supabase
        .from('documents')
        .select('owner_id')
        .eq('id', documentId)
        .single();
      
      if (docCheckError) {
        throw new Error(docCheckError.message);
      }
      
      if (!docCheck) {
        throw new Error('Documento não encontrado');
      }
      
      if (docCheck.owner_id !== user.id) {
        throw new Error('Você não tem permissão para excluir este documento');
      }
      
      // Deletar o documento
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Atualizar a lista após excluir
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar documento:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao deletar documento' 
      };
    }
  };
  
  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    createDocument,
    deleteDocument
  };
} 