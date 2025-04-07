// Types relacionados aos componentes de documentos no dashboard

export interface DocumentData {
  id: string;
  title: string;
  updated_at: string;
  collaborators_count: number;
}

export interface DocumentCardProps {
  document: DocumentData;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onEditTitle?: (id: string, newTitle: string) => Promise<{ success: boolean; error?: string }>;
  listMode?: boolean;
}

export interface DeleteModalProps {
  document: DocumentData;
  isOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  onClose: (e: React.MouseEvent) => void;
  onConfirm: (e: React.MouseEvent) => void;
}

export interface EditTitleModalProps {
  document: DocumentData;
  isOpen: boolean;
  isEditing: boolean;
  newTitle: string;
  error: string | null;
  onClose: (e: React.MouseEvent) => void;
  onConfirm: (e: React.FormEvent) => void;
  onTitleChange: (value: string) => void;
} 