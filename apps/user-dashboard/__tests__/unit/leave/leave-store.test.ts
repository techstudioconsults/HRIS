import { describe, it, expect, beforeEach } from 'vitest';
import { useLeaveStore } from '@/modules/@org/admin/leave/stores/leave-store';

describe('useLeaveStore (Zustand)', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useLeaveStore.setState({
      showLeaveSetupModal: false,
      hasCompletedLeaveSetup: false,
      showLeaveDetailsDrawer: false,
      selectedLeaveRequestId: null,
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct defaults', () => {
      const state = useLeaveStore.getState();

      expect(state.showLeaveSetupModal).toBe(false);
      expect(state.hasCompletedLeaveSetup).toBe(false);
      expect(state.showLeaveDetailsDrawer).toBe(false);
      expect(state.selectedLeaveRequestId).toBeNull();
    });
  });

  describe('setShowLeaveSetupModal', () => {
    it('should set showLeaveSetupModal to true', () => {
      const { setShowLeaveSetupModal } = useLeaveStore.getState();

      setShowLeaveSetupModal(true);

      expect(useLeaveStore.getState().showLeaveSetupModal).toBe(true);
    });

    it('should set showLeaveSetupModal to false', () => {
      useLeaveStore.setState({ showLeaveSetupModal: true });

      const { setShowLeaveSetupModal } = useLeaveStore.getState();
      setShowLeaveSetupModal(false);

      expect(useLeaveStore.getState().showLeaveSetupModal).toBe(false);
    });
  });

  describe('setHasCompletedLeaveSetup', () => {
    it('should update hasCompletedLeaveSetup status', () => {
      const { setHasCompletedLeaveSetup } = useLeaveStore.getState();

      setHasCompletedLeaveSetup(true);

      expect(useLeaveStore.getState().hasCompletedLeaveSetup).toBe(true);

      setHasCompletedLeaveSetup(false);

      expect(useLeaveStore.getState().hasCompletedLeaveSetup).toBe(false);
    });
  });

  describe('setShowLeaveDetailsDrawer', () => {
    it('should open details drawer', () => {
      const { setShowLeaveDetailsDrawer } = useLeaveStore.getState();

      setShowLeaveDetailsDrawer(true);

      expect(useLeaveStore.getState().showLeaveDetailsDrawer).toBe(true);
    });

    it('should close details drawer', () => {
      useLeaveStore.setState({ showLeaveDetailsDrawer: true });

      const { setShowLeaveDetailsDrawer } = useLeaveStore.getState();
      setShowLeaveDetailsDrawer(false);

      expect(useLeaveStore.getState().showLeaveDetailsDrawer).toBe(false);
    });
  });

  describe('setSelectedLeaveRequestId', () => {
    it('should set selectedLeaveRequestId to a string', () => {
      const { setSelectedLeaveRequestId } = useLeaveStore.getState();

      setSelectedLeaveRequestId('lr_001');

      expect(useLeaveStore.getState().selectedLeaveRequestId).toBe('lr_001');
    });

    it('should set selectedLeaveRequestId to null', () => {
      useLeaveStore.setState({ selectedLeaveRequestId: 'lr_001' });

      const { setSelectedLeaveRequestId } = useLeaveStore.getState();
      setSelectedLeaveRequestId(null);

      expect(useLeaveStore.getState().selectedLeaveRequestId).toBeNull();
    });
  });

  describe('resetUI', () => {
    it('should reset all state to initial values', () => {
      // Set all state to non-default values
      useLeaveStore.setState({
        showLeaveSetupModal: true,
        hasCompletedLeaveSetup: true,
        showLeaveDetailsDrawer: true,
        selectedLeaveRequestId: 'lr_001',
      });

      expect(useLeaveStore.getState().showLeaveSetupModal).toBe(true);
      expect(useLeaveStore.getState().hasCompletedLeaveSetup).toBe(true);
      expect(useLeaveStore.getState().showLeaveDetailsDrawer).toBe(true);
      expect(useLeaveStore.getState().selectedLeaveRequestId).toBe('lr_001');

      // Call resetUI
      const { resetUI } = useLeaveStore.getState();
      resetUI();

      // Verify all state reset to initial values
      const state = useLeaveStore.getState();
      expect(state.showLeaveSetupModal).toBe(false);
      expect(state.hasCompletedLeaveSetup).toBe(false);
      expect(state.showLeaveDetailsDrawer).toBe(false);
      expect(state.selectedLeaveRequestId).toBeNull();
    });

    it('should be idempotent', () => {
      const { resetUI } = useLeaveStore.getState();

      resetUI();
      const state1 = useLeaveStore.getState();

      resetUI();
      const state2 = useLeaveStore.getState();

      expect(state1).toEqual(state2);
    });
  });

  describe('Multiple State Changes', () => {
    it('should handle sequential state updates', () => {
      const state = useLeaveStore.getState();

      state.setShowLeaveSetupModal(true);
      state.setHasCompletedLeaveSetup(true);
      state.setShowLeaveDetailsDrawer(true);
      state.setSelectedLeaveRequestId('lr_001');

      const currentState = useLeaveStore.getState();
      expect(currentState.showLeaveSetupModal).toBe(true);
      expect(currentState.hasCompletedLeaveSetup).toBe(true);
      expect(currentState.showLeaveDetailsDrawer).toBe(true);
      expect(currentState.selectedLeaveRequestId).toBe('lr_001');
    });

    it('should allow independent state mutations', () => {
      const state = useLeaveStore.getState();

      state.setShowLeaveSetupModal(true);
      expect(useLeaveStore.getState().showLeaveSetupModal).toBe(true);
      expect(useLeaveStore.getState().hasCompletedLeaveSetup).toBe(false); // unchanged

      state.setHasCompletedLeaveSetup(true);
      expect(useLeaveStore.getState().showLeaveSetupModal).toBe(true); // unchanged
      expect(useLeaveStore.getState().hasCompletedLeaveSetup).toBe(true);
    });
  });
});
