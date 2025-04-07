'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface DocumentData {
  id?: string;
  title: string;
  content: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
}

export function useDocument(documentId?: string) {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  
  // Carregar documento do Supabase
  useEffect(() => {
    if (documentId && !authLoading && isLoggedIn) {
      fetchDocument(documentId);
    } else if (!authLoading && !isLoggedIn && documentId) {
      setError('Usuário não autenticado');
      setIsLoading(false);
    }
  }, [documentId, authLoading, isLoggedIn]);
  
  // Função para buscar um documento pelo ID
  const fetchDocument = async (id: string) => {
    if (!isLoggedIn || !user) {
      setError('Usuário não autenticado');
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
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Verificar se o usuário tem acesso a este documento
        if (data.owner_id !== user.id && !data.is_public) {
          throw new Error('Você não tem permissão para acessar este documento');
        }
        
        // Converte o conteúdo JSON para string se necessário
        const documentData = {
          ...data,
          content: typeof data.content === 'string' 
            ? data.content 
            : JSON.stringify(data.content)
        };
        setDocument(documentData);
      } else {
        setDocument(null);
        setError('Documento não encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documento');
      console.error('Erro ao carregar documento:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para salvar um documento
  const saveDocument = async (documentData: DocumentData) => {
    if (!isLoggedIn || !user) {
      setError('Usuário não autenticado');
      return false;
    }
    
    setIsSaving(true);
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
      
      let response;
      
      if (documentData.id) {
        // Atualizar documento existente
        // Verificar se o usuário é o dono do documento
        const { data: docCheck } = await supabase
          .from('documents')
          .select('owner_id')
          .eq('id', documentData.id)
          .single();
        
        if (docCheck && docCheck.owner_id !== user.id) {
          throw new Error('Você não tem permissão para editar este documento');
        }
        
        response = await supabase
          .from('documents')
          .update({
            title: documentData.title,
            content: documentData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', documentData.id)
          .select();
      } else {
        // Criar novo documento
        response = await supabase
          .from('documents')
          .insert({
            title: documentData.title,
            content: documentData.content,
            owner_id: user.id,
            is_public: documentData.is_public || false
          })
          .select();
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Atualizar o estado do documento
      if (response.data && response.data.length > 0) {
        const updatedDoc = {
          ...response.data[0],
          content: typeof response.data[0].content === 'string'
            ? response.data[0].content
            : JSON.stringify(response.data[0].content)
        };
        setDocument(updatedDoc);
      }
      
      setLastSaved(new Date());
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar documento');
      console.error('Erro ao salvar documento:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para criar um novo documento
  const createDocument = async (title: string, initialContent: string = '') => {
    if (!isLoggedIn || !user) {
      setError('Usuário não autenticado');
      return null;
    }
    
    const newDocument: DocumentData = {
      title: title,
      content: initialContent,
      is_public: false
    };
    
    const success = await saveDocument(newDocument);
    return success ? document : null;
  };
  
  return {
    document,
    isLoading,
    error,
    isSaving,
    lastSaved,
    fetchDocument,
    saveDocument,
    createDocument,
    updateContent: (content: string) => {
      if (document) {
        setDocument({ ...document, content });
      }
    }
  };
} 