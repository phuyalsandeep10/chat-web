// utils/formatWorkspacePayload.ts
import WorkspaceData from '@/store/WorkspaceStore/useWorkspaceStore';

export const buildWorkspacePayload = (updatedData: Partial<WorkspaceData>) => {
  const defaultValues: WorkspaceData = {
    logo: '',
    owner: '',
    name: '',
    domain: '',
    contact_dial_code: '',
    contact_email: '',
    contact_phone: '',
    facebook_username: '',
    telegram_username: '',
    twitter_username: '',
    whatsapp_number: '',
  };

  return { ...defaultValues, ...updatedData };
};
