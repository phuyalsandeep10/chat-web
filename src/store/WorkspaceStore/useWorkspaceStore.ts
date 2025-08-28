import { create } from 'zustand';

export default interface WorkspaceData {
  profile_picture: string | null;
  workspace_owner: string;
  name: string;
  domain: string;
  phone_code: string;
  email: string;
  phone?: string;
  facebook: string;
  telegram: string;
  twitter: string;
  whatsapp: string;
  timezone_id?: number;
  contact_phone: string;
  workspace_owner_id?: number;
}
const defaultValues: Partial<WorkspaceData> = {
  profile_picture: '',
  workspace_owner: '',
  name: '',
  domain: '',
  phone_code: '',
  email: '',
  phone: '',
  facebook: '',
  telegram: '',
  twitter: '',
  whatsapp: '',
  timezone_id: 0,
  contact_phone: '',
};

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
