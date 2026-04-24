import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// MSW server setup should be configured in vitest.setup.ts using resourcesHandlers from fixtures/

describe('Resources — Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Folder list fetching', () => {
    it.todo('should fetch and display root folders on mount');
    it.todo('should fetch sub-folders when drilling into a FolderCard');
    it.todo('should update breadcrumb when navigating into a sub-folder');
  });

  describe('Create folder mutation', () => {
    it.todo('should add a new FolderCard when POST /folders returns 201');
    it.todo(
      'should show inline error on name field when POST /folders returns 409'
    );
    it.todo(
      'should rollback the optimistic FolderCard when POST /folders returns 500'
    );
  });

  describe('File list fetching', () => {
    it.todo(
      'should fetch and display files in the current folder on Files tab'
    );
    it.todo('should show empty state when GET /files returns an empty array');
  });

  describe('File upload mutation', () => {
    it.todo('should show upload progress for a dropped PDF file');
    it.todo(
      'should show the uploaded FileCard after POST /files/upload returns 201'
    );
    it.todo('should show per-file error when POST /files/upload returns 413');
  });

  describe('Delete folder mutation', () => {
    it.todo('should open confirmation dialog before deleting');
    it.todo('should remove FolderCard when DELETE /folders/:id returns 200');
    it.todo('should show error toast when DELETE /folders/:id returns 500');
  });
});
