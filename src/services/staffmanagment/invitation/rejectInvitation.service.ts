import axiosInstance from '@/apiConfigs/axiosInstance';

export interface RejectInvitation {
  success: boolean;
  message: string;
  id: number;
}

export const rejectInvitation = async (
  invitation_id: string,
  token: string,
): Promise<RejectInvitation> => {
  const response = await axiosInstance.get(
    `/organizations/invitation/${invitation_id}/reject/${token}`,
  );
  return response.data;
};
