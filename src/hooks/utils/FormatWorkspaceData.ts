// utils/formatWorkspacePayload.ts
import WorkspaceData from '@/store/WorkspaceStore/useWorkspaceStore';

export const buildWorkspacePayload = (updatedData: Partial<WorkspaceData>) => {
  const defaultValues: WorkspaceData = {
    profile_picture: '',
    workspace_owner: '',
    name: '',
    domain: '',
    phone_code: '',
    email: '',
    contact_phone: '',
    facebook: '',
    telegram: '',
    twitter: '',
    whatsapp: '',
  };

  return { ...defaultValues, ...updatedData };
};
