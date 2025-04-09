'use client';

import { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import AnonymousLinkModal from './AnonymousLinkModal';

interface AnonymousLinkDialogProps {
  documentId: string | null;
  isOwner: boolean;
}

export default function AnonymousLinkDialog({ documentId, isOwner }: AnonymousLinkDialogProps) {
  const [showModal, setShowModal] = useState(false);
  
  // Don't show anything if the user is not the owner or if there's no document
  if (!isOwner || !documentId) {
    return null;
  }
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <UserPlusIcon className="h-4 w-4 mr-2" />
        Invite
      </button>
      
      <AnonymousLinkModal
        documentId={documentId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
} 