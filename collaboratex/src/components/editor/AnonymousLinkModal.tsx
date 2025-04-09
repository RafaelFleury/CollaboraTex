import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import AnonymousLinkManager from './AnonymousLinkManager';

interface AnonymousLinkModalProps {
  documentId: string | null;
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
}

// Available expiration options
const expirationOptions = [
  { value: null, label: 'Never' },
  { value: 1, label: '1 day' },
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 365, label: '1 year' }
];

// Available permission options
const permissionOptions = [
  { value: 'view', label: 'View only' },
  { value: 'edit', label: 'Edit' }
];

export default function AnonymousLinkModal({ documentId, isOpen, onClose }: AnonymousLinkModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshLinks, setRefreshLinks] = useState(0);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [permission, setPermission] = useState<string>('edit');
  const [showOptions, setShowOptions] = useState(false);
  
  if (!isOpen) return null;
  
  const generateLink = async () => {
    if (!documentId) return;
    
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
      
      // Increment refreshLinks to force links reload
      setRefreshLinks(prev => prev + 1);
    } catch (err: any) {
      console.error('Error generating link:', err);
      setError(err.message || 'Failed to generate anonymous link');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <XIcon className="h-5 w-5" />
        </button>
        
        <h3 className="text-lg font-medium mb-4">Manage Anonymous Access</h3>
        
        <div className="space-y-6">
          {/* Generate new link section */}
          <div className="border-b pb-6 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-3">Generate New Link</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Permission
                  </label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                    className="block w-full p-2 text-sm border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                  >
                    {permissionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiration
                  </label>
                  <select
                    value={expiresInDays === null ? 'null' : expiresInDays.toString()}
                    onChange={(e) => setExpiresInDays(e.target.value === 'null' ? null : parseInt(e.target.value))}
                    className="block w-full p-2 text-sm border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                  >
                    {expirationOptions.map((option) => (
                      <option key={option.label} value={option.value === null ? 'null' : option.value.toString()}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={generateLink}
                disabled={isGenerating}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : "Generate Anonymous Link"}
              </button>
              
              {generatedLink && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 p-2 border rounded-md text-sm text-black dark:text-white bg-white dark:bg-gray-800"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Anyone with this link can {permission === 'edit' ? 'access and edit' : 'view'} this document without logging in.
                    {expiresInDays && ` This link will expire in ${expiresInDays} day${expiresInDays > 1 ? 's' : ''}.`}
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mt-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Existing links section */}
          <div>
            <h4 className="text-sm font-medium mb-3">Active Links</h4>
            <AnonymousLinkManager key={refreshLinks} documentId={documentId} isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
} 