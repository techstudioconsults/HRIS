import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Resources — Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FolderCard rendering', () => {
    it.todo('should render folder name');
    it.todo('should render child and file count badges');
    it.todo('should show action menu on hover');
    it.todo('should not render rename/delete actions for read-only users');
  });

  describe('FileCard rendering', () => {
    it.todo('should render file name and MIME type icon');
    it.todo('should render formatted file size (KB / MB)');
    it.todo('should render upload date in relative format');
  });

  describe('CreateFolderModal validation', () => {
    it.todo('should disable submit when name is empty');
    it.todo('should show error when name exceeds 100 characters');
    it.todo('should show error when name contains a forward slash');
    it.todo('should call onSubmit with trimmed name value');
  });

  describe('BreadcrumbNav', () => {
    it.todo('should render "Resources" as the root crumb');
    it.todo('should render each ancestor folder as a clickable link');
    it.todo('should render the current folder as non-clickable text');
  });

  describe('ResourcesView', () => {
    it.todo('should render loading skeleton while folder list is fetching');
    it.todo('should render empty state when no root folders exist');
    it.todo('should render FolderCardGrid when folders are returned');
    it.todo('should switch to Files tab when Files tab is clicked');
  });

  describe('useCreateFolder hook', () => {
    it.todo('should apply optimistic update before API resolves');
    it.todo('should rollback optimistic update on API error');
    it.todo('should invalidate folder query on success');
  });
});
