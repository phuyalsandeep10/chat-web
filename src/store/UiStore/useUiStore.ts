import { create } from 'zustand';

interface UiState {
  showChatInfo: boolean;
  openChatInfo: () => void;
  closeChatInfo: () => void;
  activeTab: 'Unresolved' | 'Resolved';
  setActiveTab: (tab: 'Unresolved' | 'Resolved') => void;
}

export const useUiStore = create<UiState>((set) => ({
  showChatInfo: false,
  openChatInfo: () => set({ showChatInfo: true }),
  closeChatInfo: () => set({ showChatInfo: false }),
  activeTab: 'Unresolved',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
