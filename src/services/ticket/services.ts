import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export const getTicketDetails = async (ticket_id: any) => {
  // console.log("lkdjsklfj", ticket_id)
  try {
    const response = await axiosInstance.get(`/tickets/${ticket_id}`);
    if (!response) {
      throw new Error('Failed to fetch ticket details');
    }
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
