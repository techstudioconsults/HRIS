import type { z } from 'zod';

import type { renameFolderSchema } from './edit-folder.schema';

export type RenameFolderFormData = z.infer<typeof renameFolderSchema>;

export interface EditFolderFormProperties {
  folderId: string;
  currentName: string;
  onClose?: () => void;
}
