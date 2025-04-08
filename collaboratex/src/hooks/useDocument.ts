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
  
  // Load document from Supabase
  useEffect(() => {
    if (documentId && !authLoading && isLoggedIn) {
      fetchDocument(documentId);
    } else if (!authLoading && !isLoggedIn && documentId) {
      setError('User not authenticated');
      setIsLoading(false);
    }
  }, [documentId, authLoading, isLoggedIn]);
  
  // Function to fetch a document by ID
  const fetchDocument = async (id: string) => {
    if (!isLoggedIn || !user) {
      setError('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Authentication session not found');
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
        // Check if user has access to this document
        if (data.owner_id !== user.id && !data.is_public) {
          throw new Error('You do not have permission to access this document');
        }
        
        // Convert JSON content to string if necessary
        const documentData = {
          ...data,
          content: typeof data.content === 'string' 
            ? data.content 
            : JSON.stringify(data.content)
        };
        setDocument(documentData);
      } else {
        setDocument(null);
        setError('Document not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading document');
      console.error('Error loading document:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save a document
  const saveDocument = async (documentData: DocumentData) => {
    if (!isLoggedIn || !user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Check current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Authentication session not found');
      }
      
      let response;
      
      if (documentData.id) {
        // Update existing document
        // Check if user owns the document
        const { data: docCheck } = await supabase
          .from('documents')
          .select('owner_id')
          .eq('id', documentData.id)
          .single();
        
        if (docCheck && docCheck.owner_id !== user.id) {
          throw new Error('You do not have permission to edit this document');
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
        // Create new document
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
      
      // Update document state
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
      setError(err instanceof Error ? err.message : 'Error saving document');
      console.error('Error saving document:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to create a new document
  const createDocument = async (title: string, initialContent: string = '') => {
    if (!isLoggedIn || !user) {
      setError('User not authenticated');
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