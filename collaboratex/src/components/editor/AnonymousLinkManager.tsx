'use client';

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

interface AnonymousLinkManagerProps {
  documentId: string | null;
  isOwner: boolean;
}

export default function AnonymousLinkManager({ documentId, isOwner }: AnonymousLinkManagerProps) {
  const [links, setLinks] = useState<AnonymousLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingLinkId, setRevokingLinkId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  
  // Don't show anything if the user is not the owner or if there's no document
  if (!isOwner || !documentId) {
    return null;
  }
  
  // Fetch anonymous links when the component is mounted
  useEffect(() => {
    if (!documentId) return;
    
    const fetchLinks = async () => {
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
    
    fetchLinks();
  }, [documentId]);
  
  // Function to revoke an anonymous link
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
    } catch (err: any) {
      console.error('Error revoking link:', err);
      setError(`Falha ao revogar link: ${err.message}`);
    } finally {
      setRevokingLinkId(null);
    }
  };
  
  // Function to permanently delete an anonymous link
  const deleteLink = async (linkId: string) => {
    // Confirm with the user before deleting
    if (!confirm('Are you sure you want to permanently delete this link?')) {
      return;
    }
    
    try {
      setDeletingLinkId(linkId);
      
      const { data, error } = await supabase
        .rpc('delete_anonymous_link', {
          p_link_id: linkId
        });
      
      if (error) throw error;
      
      // Remove the link from the local list
      setLinks(links.filter(link => link.id !== linkId));
    } catch (err: any) {
      console.error('Error deleting link:', err);
      alert(`Failed to delete link: ${err.message}`);
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
  
  // Copy link to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback para ambientes não-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 text-sm">
        {error}
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        No anonymous links found.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div 
          key={link.id} 
          className={`p-4 rounded-lg border ${
            link.is_active 
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              {link.permission === 'edit' ? 'Editor' : 'Viewer'} Link
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                link.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {link.is_active ? 'Active' : 'Inactive'}
              </span>
              
              {link.is_active && (
                <button
                  onClick={() => revokeLink(link.id)}
                  disabled={revokingLinkId === link.id || deletingLinkId === link.id}
                  className="text-xs px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                >
                  {revokingLinkId === link.id ? 'Revoking...' : 'Revoke'}
                </button>
              )}
              
              <button
                onClick={() => deleteLink(link.id)}
                disabled={deletingLinkId === link.id || revokingLinkId === link.id}
                className="text-xs px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
              >
                {deletingLinkId === link.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Created: {formatDate(link.created_at)}
            {link.expires_at && <span> · Expires: {formatDate(link.expires_at)}</span>}
          </div>
          
          {link.is_active && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={getFullUrl(link.access_token)}
                readOnly
                className="flex-1 p-2 text-xs border rounded text-black dark:text-white bg-white dark:bg-gray-800"
              />
              <button
                onClick={() => copyToClipboard(getFullUrl(link.access_token))}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs transition-colors"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 