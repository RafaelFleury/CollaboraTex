"use client";

import { useState, useEffect } from 'react';
import { DocumentCardProps, DocumentData } from './types';
import DocumentCardGrid from './DocumentCardGrid';
import DocumentCardList from './DocumentCardList';
import DeleteDocumentModal from './DeleteDocumentModal';
import EditTitleModal from './EditTitleModal';

export default function DocumentCard({ document, onDelete, onEditTitle, listMode = false }: DocumentCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // States for title editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Debug for checking props
  useEffect(() => {
    if (showMenu) {
      console.log(
        "DocumentCard Menu Debug", 
        listMode ? "List Mode" : "Grid Mode", 
        "- onDelete:", Boolean(onDelete), 
        "onEditTitle:", Boolean(onEditTitle)
      );
    }
  }, [showMenu, onDelete, onEditTitle, listMode]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(false);
    setError(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await onDelete(document.id);
      
      if (!result.success && result.error) {
        setError(result.error);
        setIsDeleting(false);
      } else {
        // Modal will close automatically as the component will unmount after deletion
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting document');
      setIsDeleting(false);
    }
  };
  
  // Handlers for title editing modal
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    setNewTitle(document.title);
    setEditError(null);
    setShowEditModal(true);
  };
  
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(false);
    setEditError(null);
  };
  
  const handleTitleChange = (value: string) => {
    setNewTitle(value);
  };
  
  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onEditTitle) return;
    
    // Validate title before updating
    if (!newTitle.trim()) {
      setEditError("Title cannot be empty.");
      return;
    }
    
    // If the title hasn't changed, just close the modal
    if (newTitle.trim() === document.title) {
      setShowEditModal(false);
      return;
    }
    
    setIsEditingTitle(true);
    setEditError(null);
    
    try {
      const result = await onEditTitle(document.id, newTitle.trim());
      
      if (!result.success && result.error) {
        setEditError(result.error);
        setIsEditingTitle(false);
      } else {
        // Close the modal after successful update
        setShowEditModal(false);
        setIsEditingTitle(false);
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Error updating title');
      setIsEditingTitle(false);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className="relative group h-full">
      {listMode ? (
        <DocumentCardList
          document={document}
          showMenu={showMenu}
          onMenuToggle={handleMenuToggle}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          closeMenu={closeMenu}
          onDelete={onDelete}
          onEditTitle={onEditTitle}
        />
      ) : (
        <DocumentCardGrid
          document={document}
          showMenu={showMenu}
          onMenuToggle={handleMenuToggle}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          closeMenu={closeMenu}
          onEditTitle={onEditTitle}
        />
      )}

      {/* Shared modals between display modes */}
      <DeleteDocumentModal
        document={document}
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        error={error}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      
      <EditTitleModal
        document={document}
        isOpen={showEditModal}
        isEditing={isEditingTitle}
        newTitle={newTitle}
        error={editError}
        onClose={handleCancelEdit}
        onConfirm={handleConfirmEdit}
        onTitleChange={handleTitleChange}
      />
    </div>
  );
}

// Re-export interfaces for compatibility with existing code
export type { DocumentData } from './types'; 