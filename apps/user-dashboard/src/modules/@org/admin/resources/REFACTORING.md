# Resources Module Refactoring

## Overview
This refactoring removes unnecessary prop drilling and follows the consistent architectural patterns used throughout the application (similar to the employee module).

## Changes Made

### 1. New Shared Component: `ConfirmDialog`
**Location:** `src/components/shared/dialog/confirm-dialog.tsx`

- Created a reusable confirmation dialog component
- Wraps `AlertModal` with a consistent API
- Supports variants: `destructive`, `default`, `warning`
- Provides a simpler interface than using `AlertModal` directly

**Usage:**
```tsx
<ConfirmDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  loading={isLoading}
  title="Delete Item"
  description="Are you sure you want to delete this item?"
  confirmText="Delete"
  variant="destructive"
/>
```

### 2. Refactored `FolderCard`
**Location:** `src/modules/@org/admin/resources/_components/ui/FolderCard.tsx`

**Before:**
- Received multiple callback props: `onClick`, `onRename`, `onDelete`
- No internal state management
- Required parent to manage all dialog states

**After:**
- Self-contained with internal dialog state management
- Handles its own delete and rename dialogs
- Uses `useRouter` for navigation internally
- Uses `useResourceService` for mutations internally
- Only requires `folder` prop

**Benefits:**
- Reduced prop drilling (3 callback props eliminated)
- Improved encapsulation
- Easier to maintain and test
- Consistent with app patterns

### 3. Refactored `FileCard`
**Location:** `src/modules/@org/admin/resources/_components/ui/FileCard.tsx`

**Before:**
- Received `onDelete` callback prop
- No internal state management
- Required parent to manage dialog state

**After:**
- Self-contained with internal dialog state
- Handles its own delete dialog
- Uses `useResourceService` for mutations internally
- Only requires `file` prop

**Benefits:**
- Reduced prop drilling (1 callback prop eliminated)
- Improved encapsulation
- Consistent with `FolderCard` and app patterns

### 4. Simplified `FoldersTab`
**Location:** `src/modules/@org/admin/resources/_components/tabs/FoldersTab.tsx`

**Before:**
```tsx
interface FoldersTabProperties {
  folders: Folder[];
  searchQuery: string;
  onFolderClick: (folderId: string) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
}
```

**After:**
```tsx
interface FoldersTabProperties {
  folders: Folder[];
  searchQuery: string;
}
```

**Benefits:**
- 3 callback props removed
- Simpler component interface
- Easier to understand and maintain

### 5. Simplified `FilesTab`
**Location:** `src/modules/@org/admin/resources/_components/tabs/FilesTab.tsx`

**Before:**
```tsx
interface FilesTabProperties {
  files: FolderFile[];
  searchQuery: string;
  onDeleteFile: (file: FolderFile) => void;
}
```

**After:**
```tsx
interface FilesTabProperties {
  files: FolderFile[];
  searchQuery: string;
}
```

**Benefits:**
- 1 callback prop removed
- Simpler component interface

### 6. Simplified `ResourcesBody`
**Location:** `src/modules/@org/admin/resources/_components/ResourcesBody.tsx`

**Before:**
- Managed 4 different dialog states
- Handled folder deletion logic
- Handled file deletion logic
- Handled folder renaming logic
- Passed callbacks down through multiple levels

**After:**
- Only fetches and displays data
- No dialog state management
- No mutation logic
- Clean separation of concerns
- ~110 lines of code removed

**Code Reduction:**
- From 188 lines to 77 lines (59% reduction)
- Removed 6 state variables
- Removed 4 handler functions
- Removed 3 dialog components from this level

## Architecture Benefits

### 1. Reduced Prop Drilling
**Before:** Props were passed through multiple levels:
```
ResourcesBody → FoldersTab → FolderCard (3 levels)
ResourcesBody → FilesTab → FileCard (3 levels)
```

**After:** Each card component is self-contained:
```
ResourcesBody → FoldersTab → FolderCard (data only)
ResourcesBody → FilesTab → FileCard (data only)
```

### 2. Improved Encapsulation
- Each card component owns its business logic
- Dialog state is colocated with the component that uses it
- Mutations are handled where they're initiated

### 3. Better Testability
- Cards can be tested independently
- No need to mock parent callbacks
- Easier to test dialog interactions

### 4. Consistent with App Patterns
This refactoring follows the same pattern used in the employee module:
- See: `src/modules/@org/admin/employee/_views/table-data.tsx`
- Components handle their own actions and dialogs
- Parent components focus on data fetching and layout

### 5. Easier Maintenance
- Changes to card behavior don't affect parent components
- Adding new card actions doesn't require parent updates
- Dialog logic is colocated with usage

## Migration Guide

### For Future Card Components
When creating new card components, follow this pattern:

```tsx
export const MyCard = ({ item }: { item: MyItem }) => {
  const { useDeleteItem } = useMyService();
  const deleteMutation = useDeleteItem();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(item.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div>{/* Card UI */}</div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete Item"
        description="Are you sure?"
        variant="destructive"
      />
    </>
  );
};
```

## Breaking Changes
None - this is an internal refactoring that maintains the same external API.

## Testing Checklist
- [ ] Folder cards display correctly
- [ ] File cards display correctly
- [ ] Folder deletion works
- [ ] File deletion works
- [ ] Folder renaming works
- [ ] File download works
- [ ] File viewing works
- [ ] Empty states display correctly
- [ ] Search filtering works
- [ ] Tab switching works
- [ ] Loading states work
- [ ] Error states work