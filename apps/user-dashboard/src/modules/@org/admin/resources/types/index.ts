export type {
  ApiError,
  CreateFolderDto,
  DeleteResponse,
  DownloadResponse,
  FileQueryParameters,
  Folder,
  FolderFile,
  FolderQueryParameters,
  UpdateFolderDto,
} from '../services/types';

export type {
  EditFolderFormProperties,
  RenameFolderFormData,
} from '../_components/forms/edit-folder.types';

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface FilesSkeletonProperties {
  count?: number;
}

export interface ResourcesBodyProperties {
  defaultView?: 'folders' | 'files';
  searchQuery?: string;
}

export interface ResourcesHeaderProperties {
  onSearch?: (query: string) => void;
}

export interface FilesTabProperties {
  files: import('../services/types').FolderFile[];
  searchQuery: string;
}

export interface FoldersTabProperties {
  folders: import('../services/types').Folder[];
  searchQuery: string;
}

export interface FileCardProperties {
  file: import('../services/types').FolderFile;
}

export interface FolderCardProperties {
  folder: import('../services/types').Folder;
}

export interface CreateFileFormProperties {
  onClose?: () => void;
}

export interface CreateFolderFormProperties {
  onClose?: () => void;
}
