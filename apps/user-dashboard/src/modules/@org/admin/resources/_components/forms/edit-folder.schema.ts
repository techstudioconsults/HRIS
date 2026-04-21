import { z } from 'zod';

export const renameFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
});
