import { create } from 'zustand';

interface TicketState {
  assignModalOpen: boolean;
  openAssignModal: () => void;
  closeAssignModal: () => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  assignModalOpen: false,
  openAssignModal: () => set({ assignModalOpen: true }),
  closeAssignModal: () => set({ assignModalOpen: false }),
}));
