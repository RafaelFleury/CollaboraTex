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
    // Don't try to load documents if we're not logged in
    if (!isLoggedIn || !user) {
      setDocuments([]);
      setError('User not authenticated');
      setIsLoading(false);
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
      
      // Fetch documents owned by the user
      const { data: ownedDocs, error: ownedDocsError } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (ownedDocsError) {
        throw new Error(ownedDocsError.message);
      }
      
      // Format documents for display
      const formattedDocs = ownedDocs.map((doc: SupabaseDocument) => ({
        id: doc.id,
        title: doc.title,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        owner_id: doc.owner_id,
        is_public: doc.is_public,
        // Set as 0 until collaboration functionality is implemented
        collaborators_count: 0
      }));
      
      setDocuments(formattedDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Error loading documents');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch documents when component mounts and user is authenticated
  useEffect(() => {
    // Only load documents when authentication is not loading
    // and user is logged in
    if (!authLoading && isLoggedIn && user) {
      fetchDocuments();
    }
  }, [authLoading, isLoggedIn, user]);
  
  // Function to create new document
  const createDocument = async (title: string) => {
    // Don't try to create a document if we're not logged in
    if (!isLoggedIn || !user) {
      return { 
        success: false, 
        error: 'User not authenticated' 
      };
    }
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Authentication session not found');
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
        // Reload document list
        await fetchDocuments();
        return { success: true, documentId: data[0].id };
      }
      
      return { success: false, error: 'Failed to create document' };
    } catch (err) {
      console.error('Error creating document:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error creating document' 
      };
    }
  };

  // Function to delete a document
  const deleteDocument = async (documentId: string) => {
    // Don't try to delete a document if we're not logged in
    if (!isLoggedIn || !user) {
      return { 
        success: false, 
        error: 'User not authenticated' 
      };
    }
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      if (!sessionData.session) {
        throw new Error('Authentication session not found');
      }
      
      // Check if user owns the document
      const { data: docCheck, error: docCheckError } = await supabase
        .from('documents')
        .select('owner_id')
        .eq('id', documentId)
        .single();
      
      if (docCheckError) {
        throw new Error(docCheckError.message);
      }
      
      if (!docCheck) {
        throw new Error('Document not found');
      }
      
      if (docCheck.owner_id !== user.id) {
        throw new Error('You do not have permission to delete this document');
      }
      
      // Delete the document
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Update list after deletion
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting document:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error deleting document' 
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