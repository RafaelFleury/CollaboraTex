import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AnonymousLink {
  id: string;
  access_token: string;
  permission: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

interface GenerateLinkOptions {
  permission: string;
  expiresInDays: number | null;
}

export function useAnonymousLinks(documentId: string | null) {
  const [links, setLinks] = useState<AnonymousLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingLinkId, setRevokingLinkId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  // Fetch anonymous links
  const fetchLinks = async () => {
    if (!documentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .rpc('list_anonymous_links', {
          p_document_id: documentId
        });
      
      if (error) throw error;
      
      setLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching anonymous links:', err);
      setError(err.message || 'Failed to load anonymous links');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a new anonymous link
  const generateLink = async ({ permission, expiresInDays }: GenerateLinkOptions) => {
    if (!documentId) return null;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const { data, error } = await supabase
        .rpc('generate_anonymous_link', {
          p_document_id: documentId,
          p_permission: permission,
          p_expires_in_days: expiresInDays
        });
      
      if (error) throw error;
      
      // Create the full URL with the returned token
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/editor/anon/${data}`;
      
      setGeneratedLink(fullUrl);
      
      // Refresh the links list
      await fetchLinks();
      
      return fullUrl;
    } catch (err: any) {
      console.error('Error generating link:', err);
      setError(err.message || 'Failed to generate anonymous link');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Revoke an anonymous link
  const revokeLink = async (linkId: string) => {
    try {
      setRevokingLinkId(linkId);
      
      const { data, error } = await supabase
        .rpc('revoke_anonymous_link', {
          p_link_id: linkId
        });
      
      if (error) throw error;
      
      // Update the links list locally to reflect the change
      setLinks(links.map(link => 
        link.id === linkId 
          ? { ...link, is_active: false } 
          : link
      ));
      
      return true;
    } catch (err: any) {
      console.error('Error revoking link:', err);
      setError(err.message || 'Failed to revoke link');
      return false;
    } finally {
      setRevokingLinkId(null);
    }
  };
  
  // Delete an anonymous link
  const deleteLink = async (linkId: string) => {
    try {
      setDeletingLinkId(linkId);
      
      const { data, error } = await supabase
        .rpc('delete_anonymous_link', {
          p_link_id: linkId
        });
      
      if (error) throw error;
      
      // Remove the link from the local list
      setLinks(links.filter(link => link.id !== linkId));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting link:', err);
      setError(err.message || 'Failed to delete link');
      return false;
    } finally {
      setDeletingLinkId(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Generate the full URL for a token
  const getFullUrl = (token: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/editor/anon/${token}`;
  };
  
  // Load links when the component mounts or documentId changes
  useEffect(() => {
    if (documentId) {
      fetchLinks();
    }
  }, [documentId]);
  
  return {
    links,
    isLoading,
    error,
    revokingLinkId,
    deletingLinkId,
    isGenerating,
    generatedLink,
    generateLink,
    revokeLink,
    deleteLink,
    formatDate,
    getFullUrl,
    setGeneratedLink
  };
} 