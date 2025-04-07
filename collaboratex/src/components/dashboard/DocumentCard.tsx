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
  
  // Estados para o modal de edição de título
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Debug para verificar props
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
        // Fechar o modal será automático, pois o componente será desmontado após a exclusão
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir documento');
      setIsDeleting(false);
    }
  };
  
  // Handlers para o modal de edição de título
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
    
    // Validar título antes de atualizar
    if (!newTitle.trim()) {
      setEditError("O título não pode estar vazio.");
      return;
    }
    
    // Se o título não mudou, apenas fechar o modal
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
        // Fechar o modal após a atualização bem-sucedida
        setShowEditModal(false);
        setIsEditingTitle(false);
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Erro ao atualizar título');
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

      {/* Modais compartilhados entre os modos de exibição */}
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

// Re-exportação das interfaces para compatibilidade com código existente
export type { DocumentData } from './types'; 