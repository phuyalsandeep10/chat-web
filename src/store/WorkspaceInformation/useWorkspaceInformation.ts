import { create } from 'zustand';

export type WorkspaceInformationData = {
  id: number;
  name: string;
  domain?: string;
  description?: string;
  logo?: string;
  purpose?: string;
  active?: boolean;
  contact_email?: string | null;
  contact_phone?: string | '';
  twitter_username?: string | null;
  facebook_username?: string | null;
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  owner_id?: number;
  identifier?: string;
  created_at?: string;
  contact_dial_code?: string;
  owner_image?: string;
  owner_name?: string;
  timezone_id?: number;
};

type WorkspaceInformationStore = {
  workspace: WorkspaceInformationData | null;
  setWorkspace: (data: WorkspaceInformationData) => void;
  updateWorkspace: (data: Partial<WorkspaceInformationData>) => void;
  clearWorkspace: () => void;
};

export const useWorkspaceInformationStore = create<WorkspaceInformationStore>(
  (set) => ({
    workspace: null,
    setWorkspace: (data) => set({ workspace: data }),
    updateWorkspace: (data) =>
      set((state) => ({
        workspace: state.workspace ? { ...state.workspace, ...data } : null,
      })),
    clearWorkspace: () => set({ workspace: null }),
  }),
);
