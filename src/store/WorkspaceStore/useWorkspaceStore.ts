import { create } from 'zustand';

export default interface WorkspaceData {
  profile_picture: string;
  workspace_owner: string;
  name: string;
  domain: string;
  phone_code: string;
  email: string;
  contact_phone: string;
  facebook: string;
  telegram: string;
  twitter: string;
  whatsapp: string;
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
