import axiosInstance from '@/apiConfigs/axiosInstance';

export interface ConfirmTicketResponse {
  success: boolean;
  message: string;
  id: number;
}

export const confirmTicket = async (
  ticketId: string,
  token: string,
): Promise<ConfirmTicketResponse> => {
  const response = await axiosInstance.get(
    `/tickets/confirm/${ticketId}/${token}`,
  );
  return response.data;
};
