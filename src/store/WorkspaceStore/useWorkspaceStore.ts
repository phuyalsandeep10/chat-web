import { create } from 'zustand';

export default interface WorkspaceData {
  logo: string | null;
  owner: string;
  name: string;
  domain: string;
  contact_dial_code: string;
  contact_email: string;
  phone?: string;
  facebook_username: string;
  telegram_username: string;
  twitter_username: string;
  whatsapp_number: string;
  timezone_id?: number;
  contact_phone: string;
  owner_id?: number;
}
const defaultValues: Partial<WorkspaceData> = {
  logo: '',
  owner: '',
  name: '',
  domain: '',
  contact_dial_code: '',
  contact_email: '',
  phone: '',
  facebook_username: '',
  telegram_username: '',
  twitter_username: '',
  whatsapp_number: '',
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
