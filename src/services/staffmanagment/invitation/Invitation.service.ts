import axiosInstance from '@/apiConfigs/axiosInstance';

export interface InvitationProps {
  success: boolean;
  message: string;
  id: number;
  token: string;
}

export const rejectInvitation = async (
  invitation_id: string,
  token: string,
): Promise<InvitationProps> => {
  const response = await axiosInstance.post(
    `/organizations/invitation/${invitation_id}/reject/${token}`,
  );
  return response.data;
};

export const acceptInvitaion = async (
  invitation_id: string,
  token: string,
): Promise<InvitationProps> => {
  const response = await axiosInstance.post(
    `/organizations/invitation/${invitation_id}/accept/${token}`,
  );
  return response.data;
};
