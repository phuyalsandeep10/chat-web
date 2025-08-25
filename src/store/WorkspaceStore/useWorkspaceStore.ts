import { Country } from '@/services/organizations/types';
import { create } from 'zustand';

interface WorkspaceData {
  image: string;
  name: string;
  domain: string;
  timeZone: string;
  email: string;
  phone: string;
  messenger: string;
  telegram: string;
  xUsername: string;
  whatsApp: string;
}

interface WorkspaceStore {
  updatedData: Partial<WorkspaceData>;
  setData: (newData: Partial<WorkspaceData>) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  updatedData: {},
  setData: (newData) =>
    set((state) => ({
      updatedData: { ...state.updatedData, ...newData },
    })),
  reset: () => set({ updatedData: {} }),
}));
